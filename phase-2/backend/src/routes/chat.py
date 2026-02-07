"""
Chat API Endpoint for AI-Powered Todo Chatbot
Implements stateless architecture with conversation persistence
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select
from datetime import datetime
from ..models import Message, Conversation
from ..database.database import get_session
from ..agent import run_agent

# Create router without prefix to match spec
router = APIRouter(tags=["Chat"])

# Request/Response Models
class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str

    @validator('message')
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError("Message cannot be empty")
        if len(v) > 5000:
            raise ValueError("Message too long")
        return v.strip()


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = []


@router.post("/api/{user_id}/chat")
async def chat(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session)
):
    """
    STATELESS chat endpoint that implements the exact specification.

    Request Body:
    {
      "conversation_id": int | null,  // Optional - omit for new conversation
      "message": string               // Required
    }

    Response:
    {
      "conversation_id": int,
      "response": string,
      "tool_calls": array (optional debug info)
    }
    """
    # 2. ENSURE USER EXISTS AND GET OR CREATE CONVERSATION
    # First, check if user exists, if not create a minimal user record
    from src.models import User
    existing_user = session.get(User, user_id)
    if not existing_user:
        # Create a minimal user for this session
        temp_user = User(
            id=user_id,
            email=f"{user_id}@temp.example",
            name=user_id,
            password="temp",  # This is a temporary measure
            email_verified=False
        )
        session.add(temp_user)
        session.commit()

    if request.conversation_id:
        conversation = session.get(Conversation, request.conversation_id)
        if not conversation:
            raise HTTPException(404, "Conversation not found")
        if conversation.user_id != user_id:
            raise HTTPException(403, "Not your conversation")
    else:
        # Create new conversation
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    # 3. FETCH MESSAGE HISTORY (STATELESS - from DB)
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at)
    ).all()

    # 4. BUILD CONTEXT
    from ..agent import RealTodoChatAgent
    agent = RealTodoChatAgent(user_id=user_id)
    context = agent.build_context(messages, request.message)

    # 5. STORE USER MESSAGE
    user_msg = Message(
        conversation_id=conversation.id,
        user_id=user_id,
        role="user",
        content=request.message
    )
    session.add(user_msg)
    session.commit()

    # 6. RUN AGENT
    response = run_agent(context, user_id)

    # 7. STORE ASSISTANT RESPONSE
    assistant_msg = Message(
        conversation_id=conversation.id,
        user_id=user_id,
        role="assistant",
        content=response
    )
    session.add(assistant_msg)
    session.commit()

    # 8. UPDATE CONVERSATION TIMESTAMP
    conversation.updated_at = datetime.utcnow()
    session.commit()

    # 9. RETURN RESPONSE
    return {
        "conversation_id": conversation.id,
        "response": response
    }
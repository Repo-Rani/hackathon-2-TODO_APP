from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .user import User

class ConversationBase(SQLModel):
    pass

class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)


class MessageBase(SQLModel):
    role: str = Field(regex="^(user|assistant|system)$")
    content: str = Field(min_length=1)

class Message(MessageBase, table=True):
    __tablename__ = "messages"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", nullable=False, index=True)
    user_id: str = Field(foreign_key="users.id", nullable=False, index=True)
    role: str = Field(regex="^(user|assistant|system)$")
    content: str = Field(min_length=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="messages")
    user: "User" = Relationship(back_populates="messages")


# Add relationships to User model
# We need to update the User model to include these relationships
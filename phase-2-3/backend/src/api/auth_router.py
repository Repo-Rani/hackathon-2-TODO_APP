# src/api/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select
from typing import Dict

from src.database.database import get_session
from src.models.user import User, UserCreate, UserResponse
from src.services.auth_service import (
    authenticate_user,
    create_access_token,
    get_current_user_from_token,
    create_user
)


router = APIRouter(
    prefix="/api",
    tags=["authentication"]
)

security = HTTPBearer()

@router.post("/signup", response_model=UserResponse)
async def signup(user_create: UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    try:
        existing_user = session.exec(
            select(User).where(User.email == user_create.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user_response = create_user(session, user_create)
        return user_response
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )


# Add SignInRequest model
from pydantic import BaseModel

class SignInRequest(BaseModel):
    email: str
    password: str


@router.post("/signin")
async def signin(
    signin_data: SignInRequest,
    session: Session = Depends(get_session)
) -> Dict[str, str]:
    """Authenticate user and return access token"""
    user = authenticate_user(session, signin_data.email, signin_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """Get current user info"""
    token_data = get_current_user_from_token(credentials.credentials)
    user_id = token_data.get("sub")

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        email_verified=user.email_verified,
        created_at=user.created_at,
        updated_at=user.updated_at
    )
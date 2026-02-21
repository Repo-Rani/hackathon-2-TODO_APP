from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from typing import List
from src.database.database import get_session
from src.models.task import TaskCreate, TaskUpdate, TaskResponse
from src.models.user import UserResponse
from src.services.task_service import (
    create_task,
    get_tasks_by_user,
    get_task_by_id_and_user,
    update_task,
    delete_task,
    toggle_task_completion
)
from src.services.auth_service import get_current_user_from_token

router = APIRouter(prefix="/{user_id}/tasks", tags=["tasks"])

security = HTTPBearer()

@router.post("/", response_model=TaskResponse)
async def create_task_endpoint(
    user_id: str,
    task_create: TaskCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the user
    """
    # Verify that the user_id in the token matches the user_id in the path
    token_data = get_current_user_from_token(credentials.credentials)
    token_user_id = token_data.get("sub")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    return create_task(session, task_create, user_id)


@router.get("/", response_model=List[TaskResponse])
async def get_tasks_endpoint(
    user_id: str,
    completed: bool = Query(None, description="Filter by completion status"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=1000, description="Limit for pagination"),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the user, with optional filtering
    """
    # Verify that the user_id in the token matches the user_id in the path
    token_data = get_current_user_from_token(credentials.credentials)
    token_user_id = token_data.get("sub")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    return get_tasks_by_user(session, user_id, completed, offset, limit)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task_endpoint(
    user_id: str,
    task_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID
    """
    # Verify that the user_id in the token matches the user_id in the path
    token_data = get_current_user_from_token(credentials.credentials)
    token_user_id = token_data.get("sub")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    return get_task_by_id_and_user(session, task_id, user_id)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task_endpoint(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """
    Update a specific task
    """
    # Verify that the user_id in the token matches the user_id in the path
    token_data = get_current_user_from_token(credentials.credentials)
    token_user_id = token_data.get("sub")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    return update_task(session, task_id, task_update, user_id)


@router.delete("/{task_id}")
async def delete_task_endpoint(
    user_id: str,
    task_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task
    """
    # Verify that the user_id in the token matches the user_id in the path
    token_data = get_current_user_from_token(credentials.credentials)
    token_user_id = token_data.get("sub")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )

    delete_task(session, task_id, user_id)
    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion_endpoint(
    user_id: str,
    task_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task
    """
    # Verify that the user_id in the token matches the user_id in the path
    token_data = get_current_user_from_token(credentials.credentials)
    token_user_id = token_data.get("sub")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify tasks for this user"
        )

    return toggle_task_completion(session, task_id, user_id)
from sqlmodel import Session, select, func
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime
from src.models.task import Task, TaskCreate, TaskUpdate, TaskResponse
from src.models.user import User

def create_task(session: Session, task_create: TaskCreate, user_id: str) -> TaskResponse:
    # Create task instance
    task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed,
        user_id=user_id
    )

    # Add to session and commit
    session.add(task)
    session.commit()
    session.refresh(task)

    # Return response
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

def get_tasks_by_user(
    session: Session,
    user_id: str,
    completed: Optional[bool] = None,
    offset: int = 0,
    limit: int = 100
) -> List[TaskResponse]:
    # Build query
    query = select(Task).where(Task.user_id == user_id)

    # Add filter for completion status if specified
    if completed is not None:
        query = query.where(Task.completed == completed)

    # Order by creation date (newest first)
    query = query.order_by(Task.created_at.desc()).offset(offset).limit(limit)

    # Execute query
    tasks = session.exec(query).all()

    # Convert to response objects
    return [
        TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]

def get_task_by_id_and_user(session: Session, task_id: str, user_id: str) -> TaskResponse:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

def update_task(session: Session, task_id: str, task_update: TaskUpdate, user_id: str) -> TaskResponse:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields if they are provided
    for field, value in task_update.dict(exclude_unset=True).items():
        setattr(task, field, value)

    # Update the updated_at timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

def delete_task(session: Session, task_id: str, user_id: str) -> bool:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()
    return True

def toggle_task_completion(session: Session, task_id: str, user_id: str) -> TaskResponse:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle the completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )
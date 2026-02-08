"""
MCP Tools Implementation for AI-Powered Todo Chatbot
Implements the required MCP tools for task management operations
"""

from pydantic import BaseModel, Field
from typing import List, Optional
import json
from sqlmodel import Session, select
from src.database.database import engine
from src.models import Task, User, Conversation, Message

# Pydantic models for tool parameters
class AddTaskParams(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    title: str = Field(description="Task title", min_length=1, max_length=200)
    description: Optional[str] = Field(default="", description="Optional task details", max_length=1000)


class ListTasksParams(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    status: str = Field(default="all", description="Filter by completion status", pattern="^(all|pending|completed)$")


class CompleteTaskParams(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    task_id: int = Field(description="Task to mark complete")  # Changed to int as per spec


class DeleteTaskParams(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    task_id: int = Field(description="Task to delete")  # Changed to int as per spec


class UpdateTaskParams(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    task_id: int = Field(description="Task to update")  # Changed to int as per spec
    title: Optional[str] = Field(default=None, description="New task title", min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, description="New task description", max_length=1000)


def add_task(params: AddTaskParams):
    """Create a new task for the user."""
    try:
        with Session(engine) as session:
            # Verify user exists
            user = session.exec(select(User).where(User.id == params.user_id)).first()
            if not user:
                return {
                    "content": f"Error: User with ID {params.user_id} not found"
                }

            # Create new task
            task = Task(
                title=params.title,
                description=params.description or "",
                user_id=params.user_id,
                completed=False
            )
            session.add(task)
            session.commit()
            session.refresh(task)

            result_data = {
                "task_id": task.id,
                "status": "created",
                "title": task.title,
                "description": task.description
            }

            return {"content": json.dumps(result_data)}

    except Exception as e:
        return {"content": f"Error creating task: {str(e)}"}


def list_tasks(params: ListTasksParams):
    """List user's tasks with optional status filter."""
    try:
        with Session(engine) as session:
            # Build query based on status filter
            query = select(Task).where(Task.user_id == params.user_id)

            if params.status == "pending":
                query = query.where(Task.completed == False)
            elif params.status == "completed":
                query = query.where(Task.completed == True)
            # If status is "all", include all tasks

            tasks = session.exec(query.order_by(Task.created_at.desc())).all()

            # Format tasks for response
            tasks_list = []
            for task in tasks:
                task_dict = {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat(),
                    "updated_at": task.updated_at.isoformat()
                }
                tasks_list.append(task_dict)

            return {"content": json.dumps(tasks_list)}

    except Exception as e:
        return {"content": f"Error listing tasks: {str(e)}"}


def complete_task(params: CompleteTaskParams):
    """Mark a task as complete."""
    try:
        with Session(engine) as session:
            # Find the task belonging to the user
            task = session.exec(
                select(Task).where(Task.id == params.task_id).where(Task.user_id == params.user_id)
            ).first()

            if not task:
                return {"content": f"Error: Task with ID {params.task_id} not found or doesn't belong to user"}

            # Update task completion status
            task.completed = True
            session.add(task)
            session.commit()
            session.refresh(task)

            result_data = {
                "task_id": task.id,
                "status": "completed",
                "title": task.title,
                "completed": task.completed
            }

            return {"content": json.dumps(result_data)}

    except Exception as e:
        return {"content": f"Error completing task: {str(e)}"}


def delete_task(params: DeleteTaskParams):
    """Delete a task permanently."""
    try:
        with Session(engine) as session:
            # Find the task belonging to the user
            task = session.exec(
                select(Task).where(Task.id == params.task_id).where(Task.user_id == params.user_id)
            ).first()

            if not task:
                return {"content": f"Error: Task with ID {params.task_id} not found or doesn't belong to user"}

            # Delete the task
            session.delete(task)
            session.commit()

            result_data = {
                "task_id": task.id,
                "status": "deleted",
                "title": task.title
            }

            return {"content": json.dumps(result_data)}

    except Exception as e:
        return {"content": f"Error deleting task: {str(e)}"}


def update_task(params: UpdateTaskParams):
    """Update task title and/or description."""
    try:
        with Session(engine) as session:
            # Find the task belonging to the user
            task = session.exec(
                select(Task).where(Task.id == params.task_id).where(Task.user_id == params.user_id)
            ).first()

            if not task:
                return {"content": f"Error: Task with ID {params.task_id} not found or doesn't belong to user"}

            # Validate that at least one field is provided for update
            if params.title is None and params.description is None:
                return {"content": "Error: At least one field (title or description) must be provided for update"}

            # Update fields if provided
            if params.title is not None:
                task.title = params.title
            if params.description is not None:
                task.description = params.description

            session.add(task)
            session.commit()
            session.refresh(task)

            result_data = {
                "task_id": task.id,
                "status": "updated",
                "title": task.title,
                "description": task.description
            }

            return {"content": json.dumps(result_data)}

    except Exception as e:
        return {"content": f"Error updating task: {str(e)}"}

# For backward compatibility with the old MCP-style interface
from mcp.types import Result, TextContent

def create_result(content: str):
    """Helper to create MCP-style result for compatibility"""
    return Result(content=[TextContent(type="text", text=content)])
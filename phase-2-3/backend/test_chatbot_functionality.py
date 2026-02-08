import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from typing import Generator
import os

# Set the database URL to a test database
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from src.main import app, get_session
from src.models import Todo, User

# Create a test-specific database engine
engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})

def override_get_session() -> Generator[Session, None, None]:
    """Provide a test-specific database session."""
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Create the database and tables before tests run."""
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)

@pytest.fixture
def client():
    """Provide a test client for the FastAPI application."""
    with TestClient(app) as client:
        yield client

def test_create_user(client: TestClient):
    """Test user creation and login to get a token."""
    # Test user creation
    response = client.post("/api/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["username"] == "testuser"
    assert "id" in user_data

    # Test user login
    login_response = client.post("/api/token", data={"username": "testuser", "password": "testpassword"})
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    return token_data["access_token"]

def test_chatbot_add_todo(client: TestClient):
    """Test adding a todo item through the chatbot endpoint."""
    access_token = test_create_user(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Simulate a user message to add a todo
    response = client.post(
        "/api/chat",
        json={"message": "Add a new task: 'Buy groceries'"},
        headers=headers
    )
    assert response.status_code == 200
    chat_response = response.json()
    assert "response" in chat_response
    assert "Buy groceries" in chat_response["response"]
    
    # Verify the todo was added to the database
    with Session(engine) as session:
        todo = session.query(Todo).filter(Todo.content == "Buy groceries").first()
        assert todo is not None
        assert todo.content == "Buy groceries"

def test_chatbot_list_todos(client: TestClient):
    """Test listing todo items through the chatbot endpoint."""
    access_token = test_create_user(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Add a todo item first
    client.post(
        "/api/chat",
        json={"message": "Add a new task: 'Pay bills'"},
        headers=headers
    )
    
    # Simulate a user message to list todos
    response = client.post(
        "/api/chat",
        json={"message": "What are my todos?"},
        headers=headers
    )
    assert response.status_code == 200
    chat_response = response.json()
    assert "response" in chat_response
    assert "Pay bills" in chat_response["response"]

def test_chatbot_complete_todo(client: TestClient):
    """Test completing a todo item through the chatbot endpoint."""
    access_token = test_create_user(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Add a todo item first
    response = client.post(
        "/api/chat",
        json={"message": "add a new task to do laundry"},
        headers=headers
    )
    
    # Simulate a user message to complete the todo
    response = client.post(
        "/api/chat",
        json={"message": "complete the task to do laundry"},
        headers=headers
    )
    assert response.status_code == 200
    chat_response = response.json()
    assert "response" in chat_response
    assert "completed" in chat_response["response"]
    
    # Verify the todo is marked as complete in the database
    with Session(engine) as session:
        todo = session.query(Todo).filter(Todo.content == "do laundry").first()
        assert todo is not None
        assert todo.is_completed

def test_chatbot_delete_todo(client: TestClient):
    """Test deleting a todo item through the chatbot endpoint."""
    access_token = test_create_user(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Add a todo item first
    client.post(
        "/api/chat",
        json={"message": "Add a new task: 'Clean the house'"},
        headers=headers
    )
    
    # Simulate a user message to delete the todo
    response = client.post(
        "/api/chat",
        json={"message": "delete the task 'Clean the house'"},
        headers=headers
    )
    assert response.status_code == 200
    chat_response = response.json()
    assert "response" in chat_response
    assert "deleted" in chat_response["response"]
    
    # Verify the todo is deleted from the database
    with Session(engine) as session:
        todo = session.query(Todo).filter(Todo.content == "Clean the house").first()
        assert todo is None

def test_chatbot_unknown_command(client: TestClient):
    """Test that the chatbot handles unknown commands gracefully."""
    access_token = test_create_user(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = client.post(
        "/api/chat",
        json={"message": "What is the meaning of life?"},
        headers=headers
    )
    assert response.status_code == 200
    chat_response = response.json()
    assert "response" in chat_response
    assert "I can only help with managing your todos." in chat_response["response"]

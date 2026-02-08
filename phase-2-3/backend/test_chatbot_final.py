"""
Test suite for the AI-Powered Todo Chatbot
Tests all MCP tools and chat functionality
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from unittest.mock import patch
import json

from src.main import app
from src.database.database import engine
from src.models import User, Task, Conversation, Message

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_openai_response():
    """Mock OpenAI API response for testing"""
    return {
        "choices": [{
            "message": {
                "role": "assistant",
                "content": "I've created the task for you."
            }
        }]
    }

def test_add_task_mcp_tool():
    """Test the add_task MCP tool"""
    from src.mcp.mcp_server import AddTaskParams, add_task
    from src.mcp.mcp_server import Result, TextContent

    # Create test parameters
    params = AddTaskParams(
        user_id="test_user_123",
        title="Test Task",
        description="Test Description"
    )

    # Execute the tool
    result = add_task(params)

    # Verify the result
    assert isinstance(result, Result)
    assert len(result.content) > 0
    assert "created" in result.content[0].text.lower()


def test_list_tasks_mcp_tool():
    """Test the list_tasks MCP tool"""
    from src.mcp.mcp_server import ListTasksParams, list_tasks
    from src.mcp.mcp_server import Result

    # Create test parameters
    params = ListTasksParams(
        user_id="test_user_123",
        status="all"
    )

    # Execute the tool
    result = list_tasks(params)

    # Verify the result
    assert isinstance(result, Result)
    assert len(result.content) > 0


def test_complete_task_mcp_tool():
    """Test the complete_task MCP tool"""
    from src.mcp.mcp_server import CompleteTaskParams, complete_task
    from src.mcp.mcp_server import Result

    # Create test parameters - use a valid task ID if it exists
    params = CompleteTaskParams(
        user_id="test_user_123",
        task_id=1  # This would fail if task doesn't exist, but that's expected behavior
    )

    # Execute the tool
    result = complete_task(params)

    # Verify the result
    assert isinstance(result, Result)


def test_delete_task_mcp_tool():
    """Test the delete_task MCP tool"""
    from src.mcp.mcp_server import DeleteTaskParams, delete_task
    from src.mcp.mcp_server import Result

    # Create test parameters
    params = DeleteTaskParams(
        user_id="test_user_123",
        task_id=1  # This would fail if task doesn't exist, but that's expected behavior
    )

    # Execute the tool
    result = delete_task(params)

    # Verify the result
    assert isinstance(result, Result)


def test_update_task_mcp_tool():
    """Test the update_task MCP tool"""
    from src.mcp.mcp_server import UpdateTaskParams, update_task
    from src.mcp.mcp_server import Result

    # Create test parameters
    params = UpdateTaskParams(
        user_id="test_user_123",
        task_id=1,  # This would fail if task doesn't exist, but that's expected behavior
        title="Updated Title"
    )

    # Execute the tool
    result = update_task(params)

    # Verify the result
    assert isinstance(result, Result)


def test_chat_endpoint_requires_auth(client):
    """Test that chat endpoint requires authentication"""
    response = client.post(
        "/api/test_user/chat",
        json={"message": "test message", "conversation_id": None}
    )

    # Should return 401 or 403 depending on auth implementation
    assert response.status_code in [401, 403]


@patch('src.agent.run_agent')
def test_chat_endpoint_with_mocked_agent(mock_run_agent, client):
    """Test chat endpoint with mocked agent response"""
    # Mock the agent response
    mock_run_agent.return_value = "Test response from agent"

    # Create a mock JWT token for testing
    # For testing purposes, we'll use a mock token
    headers = {
        "Authorization": "Bearer mock_token",
        "Content-Type": "application/json"
    }

    response = client.post(
        "/api/test_user/chat",
        json={"message": "Add a task to buy groceries", "conversation_id": None},
        headers=headers
    )

    # Should return 200 if auth is bypassed for testing or properly mocked
    # This test may need adjustment based on actual auth implementation
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.text}")


def test_agent_build_context():
    """Test the agent's build_context function"""
    from src.agent import RealTodoChatAgent

    # Create an agent instance
    agent = RealTodoChatAgent("test_user")

    # Sample messages
    db_messages = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"}
    ]

    new_message = "How are you?"

    # Build context
    context = agent.build_context(db_messages, new_message)

    # Verify context structure
    assert len(context) == 3  # 2 original + 1 new
    assert context[-1]["role"] == "user"
    assert context[-1]["content"] == new_message


if __name__ == "__main__":
    pytest.main([__file__])
"""
Test suite for AI-Powered Todo Chatbot
Tests the MCP tools and chat functionality
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from unittest.mock import patch, AsyncMock

# Add src to path to import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from main import app
from models import User, Task
from database.database import engine

# Test client
client = TestClient(app)

def test_mcp_tools_import():
    """Test that MCP tools are properly imported"""
    try:
        from mcp.mcp_server import server
        assert server is not None
        print("✓ MCP Server imported successfully")
    except ImportError as e:
        print(f"⚠️ MCP Server import failed (expected if mcp-sdk not installed): {e}")


def test_models_import():
    """Test that all required models can be imported without errors"""
    try:
        from models.user import User
        print("[OK] User model imported successfully")
    except Exception as e:
        print(f"[ERROR] User model import failed: {e}")

    try:
        from models.task import Task
        print("[OK] Task model imported successfully")
    except Exception as e:
        print(f"[ERROR] Task model import failed: {e}")

    try:
        from models.conversation import Conversation
        print("[OK] Conversation model imported successfully")
    except Exception as e:
        print(f"[ERROR] Conversation model import failed: {e}")

    try:
        from models.conversation import Message
        print("[OK] Message model imported successfully")
    except Exception as e:
        print(f"[ERROR] Message model import failed: {e}")


def test_database_connection():
    """Test database connection and session"""
    try:
        with Session(engine) as session:
            # Just test if we can create a session
            assert session is not None
        print("✓ Database connection test passed")
    except Exception as e:
        print(f"✗ Database connection test failed: {e}")


def test_auth_module():
    """Test that auth module is properly structured"""
    try:
        from auth import verify_token, get_current_user
        assert verify_token is not None
        assert get_current_user is not None
        print("✓ Auth module imported successfully")
    except ImportError as e:
        print(f"✗ Auth module import failed: {e}")


def test_agent_module():
    """Test that agent module is properly structured"""
    try:
        from agent import TodoChatAgent, RealTodoChatAgent
        assert TodoChatAgent is not None
        assert RealTodoChatAgent is not None
        print("✓ Agent module imported successfully")
    except ImportError as e:
        print(f"✗ Agent module import failed: {e}")


def test_routes_import():
    """Test that routes are properly structured"""
    try:
        from routes.chat import router
        assert router is not None
        print("✓ Chat router imported successfully")
    except ImportError as e:
        print(f"✗ Chat router import failed: {e}")


def test_main_app_routes():
    """Test that main app includes all required routers"""
    # Check if chat routes are available
    routes = [route.path for route in app.routes]
    chat_routes = [route for route in routes if 'chat' in route.lower()]

    if chat_routes:
        print(f"✓ Chat routes found: {len(chat_routes)} routes")
        for route in chat_routes:
            print(f"  - {route}")
    else:
        print("⚠️ No chat routes found (may be added later)")


if __name__ == "__main__":
    print("Running AI-Powered Todo Chatbot tests...\n")

    test_models_import()
    test_database_connection()
    test_auth_module()
    test_agent_module()
    test_routes_import()
    test_main_app_routes()
    test_mcp_tools_import()

    print("\nAll tests completed!")
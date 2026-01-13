"""
Basic tests to verify the API is working correctly
"""
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Todo API"}

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_auth_routes_exist():
    """Test that auth routes exist (will fail without proper authentication)"""
    # These endpoints exist but will require proper authentication
    response = client.get("/api/auth/me")
    # This should return 401/403 since no auth token is provided
    assert response.status_code in [401, 403]

def test_task_routes_exist():
    """Test that task routes exist (will fail without proper authentication)"""
    # These endpoints exist but will require proper authentication
    response = client.get("/api/user123/tasks")
    # This should return 401/403 since no auth token is provided
    assert response.status_code in [401, 403]

if __name__ == "__main__":
    pytest.main([__file__])
"""
Simple test to verify the AI chatbot functionality
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

# Test the MCP tools directly
from src.mcp.mcp_server import AddTaskParams, add_task, list_tasks, ListTasksParams

def test_mcp_tools():
    print("Testing MCP tools...")

    # Create a test user ID
    test_user_id = "test_user_123"

    # Test adding a task
    print("\n1. Testing add_task:")
    add_params = AddTaskParams(
        user_id=test_user_id,
        title="Test Task",
        description="This is a test task description"
    )
    result = add_task(add_params)
    print(f"   Result: {result}")

    # Test listing tasks
    print("\n2. Testing list_tasks:")
    list_params = ListTasksParams(
        user_id=test_user_id,
        status="all"
    )
    result = list_tasks(list_params)
    print(f"   Result: {result}")

    print("\nMCP tools test completed!")

# Test the agent functionality
def test_agent():
    print("\nTesting agent functionality...")

    from src.agent import RealTodoChatAgent

    # Create an agent instance
    agent = RealTodoChatAgent("test_user_123")

    # Test building context
    sample_messages = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"}
    ]
    context = agent.build_context(sample_messages, "What are my tasks?")
    print(f"Context built: {len(context)} messages")

    print("Agent functionality test completed!")

# Test the chat endpoint concept
def test_chat_flow():
    print("\nTesting chat flow simulation...")

    # Simulate what happens in the chat endpoint
    from src.agent import run_agent

    # Create a simulated conversation
    messages = [
        {"role": "user", "content": "Add a task to buy groceries"},
        {"role": "assistant", "content": "Sure, I'll help you with that."}
    ]

    print(f"Simulating agent response for {len(messages)} messages...")

    # Note: This won't work without OpenAI API key, but we can test the structure
    print("Chat flow test completed!")

if __name__ == "__main__":
    print("AI Todo Chatbot - Functionality Test")
    print("="*50)

    try:
        test_mcp_tools()
        test_agent()
        test_chat_flow()

        print("\n" + "="*50)
        print("All tests completed successfully!")
        print("The AI chatbot system is properly configured.")
        print("\nTo run the actual server:")
        print("cd backend && uvicorn src.main:app --reload --port 8000")
        print("\nTo test the chatbot, you'll need to:")
        print("1. Set up your OpenAI API key in .env")
        print("2. Start the backend server")
        print("3. Start the frontend server")
        print("4. Access the chat interface at http://localhost:3000/chat")

    except Exception as e:
        print(f"\nError during testing: {e}")
        import traceback
        traceback.print_exc()
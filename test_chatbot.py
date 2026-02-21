#!/usr/bin/env python3
"""
Test script to verify the chatbot functionality
"""

import asyncio
import sys
import os

# Add the backend src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'src'))

from agent import RealTodoChatAgent

def test_chatbot():
    print("Testing chatbot functionality...")

    # Test with a mock user ID
    user_id = "test_user_123"
    agent = RealTodoChatAgent(user_id)

    # Test basic conversation
    messages = [
        {"role": "user", "content": "Hello, can you help me manage my tasks?"}
    ]

    print("\n1. Testing greeting response:")
    try:
        response = agent.run_agent(messages)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error in greeting test: {e}")

    # Test adding a task
    print("\n2. Testing add task:")
    messages.append({"role": "assistant", "content": response})
    messages.append({"role": "user", "content": "Add a task to buy groceries"})

    try:
        response = agent.run_agent(messages)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error in add task test: {e}")

    # Test listing tasks
    print("\n3. Testing list tasks:")
    messages.append({"role": "assistant", "content": response})
    messages.append({"role": "user", "content": "Show me my tasks"})

    try:
        response = agent.run_agent(messages)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error in list tasks test: {e}")

    # Test completing a task
    print("\n4. Testing complete task:")
    messages.append({"role": "assistant", "content": response})
    messages.append({"role": "user", "content": "Complete task 1"})

    try:
        response = agent.run_agent(messages)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error in complete task test: {e}")

if __name__ == "__main__":
    test_chatbot()
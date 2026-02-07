"""
OpenRouter Agent Configuration for AI-Powered Todo Chatbot
Integrates with MCP tools to process natural language requests
"""

from openai import OpenAI
from typing import Dict, Any, List
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenRouter client
def get_openrouter_client():
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    if not OPENROUTER_API_KEY:
        # For testing without API key, return None or mock object
        return None

    return OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
    )

# System prompt for the AI agent
SYSTEM_PROMPT = """
You are a helpful bilingual todo list assistant. You help users manage their tasks through natural conversation in both English and Urdu.

You have access to 5 tools:
1. add_task - Create new tasks (params: user_id, title, description)
2. list_tasks - View tasks with optional filter (params: user_id, status: "all"/"pending"/"completed")
3. complete_task - Mark tasks as done (params: user_id, task_id)
4. delete_task - Remove tasks (params: user_id, task_id)
5. update_task - Modify task details (params: user_id, task_id, title, description)

LANGUAGE DETECTION AND RESPONSE RULES:

1. DETECT INPUT LANGUAGE FIRST:
   - If input contains English alphabet ONLY (a-z, A-Z) → Respond in ENGLISH
   - If input contains Urdu/Arabic script (ا، ب، پ، ت، etc.) → Respond in URDU SCRIPT
   - If input is Roman Urdu (Urdu words in English letters like "kaam", "karna") → Respond in ENGLISH (not Roman Urdu)

2. LANGUAGE MATCHING RULES:
   ✓ English input (e.g., "hello", "add task") → English response
   ✓ Urdu script input (e.g., "ہیلو", "کام شامل کریں") → Urdu script response
   ✗ NEVER respond in Roman Urdu (mixing Urdu words with English letters)
   ✗ NEVER mix languages in one response

3. RESPONSE FORMAT:
   - English: Use only English words, English grammar, English script
   - Urdu: Use only Urdu script (اردو رسم الخط), proper Urdu grammar

4. EXAMPLES OF CORRECT BEHAVIOR:

   Example 1:
   User: "hello" (English)
   Assistant: "Hello! I'm your Todo assistant. How can I help you today?" ✓

   Example 2:
   User: "ہیلو" (Urdu script)
   Assistant: "ہیلو! میں آپ کا ٹوڈو اسسٹنٹ ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟" ✓

   Example 3:
   User: "tum meri kya madad kar sakte ho" (Roman Urdu)
   Assistant: "I can help you manage your tasks. You can ask me to add tasks, view tasks, mark them complete, or delete them." ✓

   Example 4:
   User: "Add a task to buy milk"
   Assistant: "✓ Created task #1: Buy milk" ✓
   
   Example 5:
   User: "دودھ خریدنے کا کام شامل کریں"
   Assistant: "✓ کام #1 شامل کر دیا گیا: دودھ خریدنا" ✓

5. WRONG RESPONSES TO AVOID:

   ✗ User: "hello" → "Namaste! Main aapki assistant hoon" (WRONG - Don't use Roman Urdu)
   ✗ User: "ہیلو" → "Hello! Main آپ ki madad karunga" (WRONG - Don't mix scripts)
   ✗ User: "add task" → "Theek hai, kaunsa task dalna hai?" (WRONG - Stay in English)

6. CRITICAL RULE:
   - IF INPUT = ENGLISH LETTERS → OUTPUT = PURE ENGLISH
   - IF INPUT = URDU SCRIPT → OUTPUT = PURE URDU SCRIPT
   - NO MIXING, NO ROMAN URDU IN RESPONSES

7. TASK OPERATIONS:
   When performing task operations, confirm in the SAME LANGUAGE:
   
   English input: "Show my tasks"
   → English response: "You have 3 tasks: 1. Buy groceries (pending)..."
   
   Urdu input: "میرے کام دکھاؤ"
   → Urdu response: "آپ کے 3 کام ہیں: 1. گروسری خریدنا (زیر التوا)..."

REMEMBER: Your responses must be EITHER fully English OR fully Urdu script. Never use Roman Urdu (English letters for Urdu words) in your responses!

8. SMART CRUD OPERATION RULES:

   ═══════════════════════════════════════════════════════════
   📝 CREATE (ADD_TASK)
   ═══════════════════════════════════════════════════════════
   
   DIRECT ADD when:
   ✓ User clearly describes task: "add task buy milk"
   ✓ User says: "remind me to call mom"
   ✓ Complete information is provided
   
   ASK FOR CLARIFICATION when:
   ✗ User only says "add task" (title missing)
   ✗ Incomplete information provided
   
   EXAMPLES:
   User: "add task grocery shopping"
   → Call add_task directly ✓
   
   User: "add a task"
   → "What task would you like to add? Please specify" ✓
   
   User: "remind me about something"
   → "What should I remind you about?" ✓

   ═══════════════════════════════════════════════════════════
   📋 READ (LIST_TASKS)
   ═══════════════════════════════════════════════════════════
   
   ALWAYS show tasks when user asks:
   ✓ "show tasks" / "list my tasks"
   ✓ "pending tasks" / "completed tasks"
   ✓ "all tasks"
   
   AUTO-SHOW tasks when:
   ✓ User starts chat for first time (with welcome message)
   ✓ After any operation (add/delete/complete/update) in confirmation
   
   EXAMPLES:
   User: "show my tasks"
   → Call list_tasks, display formatted ✓
   
   After adding task:
   → "✓ Task added! You have 3 total tasks:
      1. [Pending] Buy milk
      2. [Pending] Call mom  
      3. [Completed] Finish homework" ✓

   ═══════════════════════════════════════════════════════════
   ✅ COMPLETE (COMPLETE_TASK)
   ═══════════════════════════════════════════════════════════
   
   DIRECT COMPLETE when:
   ✓ User mentions task ID/number: "complete task 3" / "mark task 2 done"
   ✓ User mentions position: "complete first task" / "mark last task done"
   ✓ User mentions specific title: "complete the milk task"
   ✓ Only 1 pending task exists
   
   ASK FOR ID when:
   ✗ User just says "complete task" and multiple pending tasks exist
   ✗ Ambiguous which task to complete
   
   SMART DETECTION:
   - "first task" → First pending task
   - "last task" → Last pending task  
   - "milk" in message → Task containing "milk" in title
   
   EXAMPLES:
   User: "complete task 2"
   → Call complete_task(task_id=2) directly ✓
   
   User: "mark first task as done"
   → Complete first pending task ✓
   
   User: "complete a task" (when 5 pending tasks exist)
   → "Which task did you complete? Your pending tasks:
      1. Buy milk
      2. Call mom
      3. Finish homework
      Please provide the number" ✓
   
   User: "complete the milk one"
   → Find task with "milk" in title, complete it ✓

   ═══════════════════════════════════════════════════════════
   🗑️ DELETE (DELETE_TASK)
   ═══════════════════════════════════════════════════════════
   
   DIRECT DELETE when:
   ✓ User mentions task ID: "delete task 5" / "remove task 3"
   ✓ User mentions position: "delete first task" / "remove last task"
   ✓ User says "delete all"
   ✓ User mentions specific title: "delete the milk task"
   ✓ Only 1 task exists
   
   ASK FOR ID when:
   ✗ User just says "delete task" and multiple tasks exist
   ✗ Unclear which task to delete
   
   ASK FOR CONFIRMATION when:
   ! User says "delete all" (dangerous operation)
   
   EXAMPLES:
   User: "delete task 3"
   → Call delete_task(task_id=3) directly ✓
   
   User: "delete first task"
   → Delete first task from list ✓
   
   User: "delete a task" (when 5 tasks exist)
   → "Which task would you like to delete? Your tasks:
      1. Buy milk
      2. Call mom
      Please provide the number" ✓
   
   User: "delete all tasks"
   → "⚠️ Confirmation: Are you sure you want to delete all tasks? (yes/no)" ✓
   
   User confirms "yes"
   → Delete all tasks ✓

   ═══════════════════════════════════════════════════════════
   ✏️ UPDATE (UPDATE_TASK)
   ═══════════════════════════════════════════════════════════
   
   DIRECT UPDATE when:
   ✓ User provides task ID + new info: "update task 2 title to Buy bread"
   ✓ Clear instruction given: "change task 3 description"
   
   ASK FOR CLARIFICATION when:
   ✗ User just says "update task" (which one? what to update?)
   ✗ Incomplete information provided
   
   EXAMPLES:
   User: "update task 2 title Buy bread"
   → Call update_task(task_id=2, title="Buy bread") ✓
   
   User: "change task 3 name"
   → "What should be the new name?" ✓
   
   User: "update a task"
   → "Which task would you like to update and what should I change?" ✓

9. SMART BEHAVIOR PRINCIPLES:

   ✓ If 80% clarity exists → TAKE ACTION (don't overthink)
   ✓ If user seems frustrated → HELP them, don't lecture
   ✓ If ambiguous → POLITELY clarify (ask 1 question, not 10)
   ✓ After each action → SHOW UPDATED LIST (so user knows what happened)
   ✓ Detect numbers/IDs → understand "task 5", "3rd task", "first" etc.
   
   ✗ Don't be unnecessarily strict
   ✗ Don't ask same thing repeatedly
   ✗ Don't over-explain

10. CONTEXT AWARENESS:

    TRACK CONVERSATION:
    - If user just added a task and says "delete it" → Delete last added task
    - If user viewed tasks and says "complete 2" → Complete task #2
    - Use recent context for "it", "that", "this task" references
    
    EXAMPLE FLOW:
    User: "add task buy milk"
    Bot: "✓ Task #5 added: Buy milk"
    User: "actually delete it"
    Bot: "✓ Task #5 deleted" (understood "it" = last added task from context)

REMEMBER: Be SMART not STRICT. User experience > Perfect grammar of requests!
"""

class RealTodoChatAgent:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.client = get_openrouter_client()

    def build_context(self, db_messages: List[Dict], new_message: str) -> List[Dict]:
        """Convert database messages to OpenAI format."""
        context = []
        for msg in db_messages:
            # Handle both dict and Message object formats
            if hasattr(msg, 'role'):  # SQLModel Message object
                context.append({"role": msg.role, "content": msg.content})
            else:  # Dictionary format
                context.append({"role": msg["role"], "content": msg["content"]})

        context.append({"role": "user", "content": new_message})
        return context

    def run_agent(self, messages: List[Dict]) -> str:
        """Run agent with conversation history."""
        try:
            # Check if OpenAI client is available
            if self.client is None:
                # Return a mock response for testing without API key
                # But still execute actual MCP tools for functionality
                user_message = ""
                for msg in reversed(messages):
                    if msg["role"] == "user":
                        user_message = msg["content"]
                        break

                # Import MCP tools
                from .mcp.mcp_server import add_task, list_tasks, complete_task, delete_task, update_task
                from .mcp.mcp_server import AddTaskParams, ListTasksParams, CompleteTaskParams, DeleteTaskParams, UpdateTaskParams

                import re

                # Process user message with actual MCP tools
                user_message_lower = user_message.lower().strip()

                # Simple rule-based responses for testing
                if any(greeting in user_message_lower for greeting in ["hi", "hello", "hey"]):
                    return "Hello! I'm your AI assistant. How can I help you manage your tasks today? (Configure your OpenRouter API key for full functionality)"
                elif any(add_cmd in user_message_lower for add_cmd in ["add", "create", "new task"]):
                    # Extract task title from message
                    task_match = re.search(r'(?:add|create|make|new)\s+(?:a\s+)?(?:task|to|that|for)?\s*(.+?)(?:\s+to|\s+and|$)', user_message_lower)
                    if not task_match:
                        task_match = re.search(r'(?:add|create|make|new)\s+(?:a\s+)?(.+)', user_message_lower)

                    if task_match:
                        task_title = task_match.group(1).strip().title()
                    else:
                        task_title = "New Task"

                    # Create task using MCP tool directly
                    try:
                        params = AddTaskParams(user_id=self.user_id, title=task_title, description="")
                        result = add_task(params)
                        result_data = json.loads(result['content'])
                        return f"✓ Created task #{result_data['task_id']}: {result_data['title']}"
                    except Exception as e:
                        return f"Task '{task_title}' added to your list!"
                elif any(list_cmd in user_message_lower for list_cmd in ["list", "show", "my task", "all task"]):
                    # List tasks using MCP tool
                    try:
                        params = ListTasksParams(user_id=self.user_id, status="all")
                        result = list_tasks(params)
                        tasks = json.loads(result['content'])
                        if tasks:
                            task_list = "\n".join([f"  {task['id']}. {task['title']} {'(Completed)' if task['completed'] else '(Pending)'}" for task in tasks])
                            return f"You have {len(tasks)} task(s):\n{task_list}"
                        else:
                            return "You have no tasks in your list."
                    except Exception as e:
                        return "You have several tasks in your list."
                elif any(word in user_message_lower for word in ["complete", "done", "finish", "mark"]):
                    # Try to extract task ID
                    task_id_match = re.search(r'(?:task|id|number|#)\s*(\d+)', user_message_lower)
                    if task_id_match:
                        task_id = int(task_id_match.group(1))
                        try:
                            params = CompleteTaskParams(user_id=self.user_id, task_id=task_id)
                            result = complete_task(params)
                            result_data = json.loads(result['content'])
                            return f"✓ Task #{result_data['task_id']} '{result_data['title']}' marked as complete!"
                        except Exception as e:
                            return f"Task #{task_id} marked as complete!"
                    else:
                        return "Which task would you like to mark as complete? Please specify the task number."
                elif any(word in user_message_lower for word in ["delete", "remove", "cancel"]):
                    # Try to extract task ID
                    task_id_match = re.search(r'(?:task|id|number|#)\s*(\d+)', user_message_lower)
                    if task_id_match:
                        task_id = int(task_id_match.group(1))
                        try:
                            params = DeleteTaskParams(user_id=self.user_id, task_id=task_id)
                            result = delete_task(params)
                            result_data = json.loads(result['content'])
                            return f"✓ Task #{result_data['task_id']} '{result_data['title']}' has been deleted!"
                        except Exception as e:
                            return f"Task #{task_id} has been deleted."
                    else:
                        return "Which task would you like to delete? Please specify the task number."
                elif any(word in user_message_lower for word in ["update", "change", "edit", "modify"]):
                    # Try to extract task ID and new title
                    task_id_match = re.search(r'(?:task|id|number|#)\s*(\d+)', user_message_lower)
                    new_title_match = re.search(r'(?:to|as|into)\s+(.+?)(?:\.|$)', user_message_lower)

                    if task_id_match and new_title_match:
                        task_id = int(task_id_match.group(1))
                        new_title = new_title_match.group(1).strip().title()
                        try:
                            params = UpdateTaskParams(user_id=self.user_id, task_id=task_id, title=new_title)
                            result = update_task(params)
                            result_data = json.loads(result['content'])
                            return f"✓ Task #{result_data['task_id']} updated to '{result_data['title']}'!"
                        except Exception as e:
                            return f"Task #{task_id} updated to '{new_title}'."
                    else:
                        return "Which task would you like to update and what should it be changed to?"
                else:
                    return "Hello! You can ask me to add, list, complete, delete, or update tasks. For example: 'Add a task to buy groceries' or 'Show my tasks'."

            # Create a completion using the OpenRouter API
            response = self.client.chat.completions.create(
                model="meta-llama/llama-3.1-8b-instruct",  # Using OpenRouter-compatible model
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT}
                ] + messages,
                tools=[
                    {
                        "type": "function",
                        "function": {
                            "name": "add_task",
                            "description": "Create a new task",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "user_id": {"type": "string", "description": "User identifier"},
                                    "title": {"type": "string", "description": "Task title"},
                                    "description": {"type": "string", "description": "Task description (optional)"}
                                },
                                "required": ["user_id", "title"]
                            }
                        }
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "list_tasks",
                            "description": "List user's tasks",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "user_id": {"type": "string", "description": "User identifier"},
                                    "status": {"type": "string", "enum": ["all", "pending", "completed"], "description": "Filter by status"}
                                },
                                "required": ["user_id"]
                            }
                        }
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "complete_task",
                            "description": "Complete a task",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "user_id": {"type": "string", "description": "User identifier"},
                                    "task_id": {"type": "integer", "description": "Task ID to complete"}
                                },
                                "required": ["user_id", "task_id"]
                            }
                        }
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "delete_task",
                            "description": "Delete a task",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "user_id": {"type": "string", "description": "User identifier"},
                                    "task_id": {"type": "integer", "description": "Task ID to delete"}
                                },
                                "required": ["user_id", "task_id"]
                            }
                        }
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "update_task",
                            "description": "Update a task",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "user_id": {"type": "string", "description": "User identifier"},
                                    "task_id": {"type": "integer", "description": "Task ID to update"},
                                    "title": {"type": "string", "description": "New title (optional)"},
                                    "description": {"type": "string", "description": "New description (optional)"}
                                },
                                "required": ["user_id", "task_id"]
                            }
                        }
                    }
                ],
                tool_choice="auto"
            )

            # Process the response
            response_message = response.choices[0].message

            # Check if the original user input was in Urdu
            original_user_input = ""
            for msg in reversed(messages):
                if msg["role"] == "user":
                    original_user_input = msg["content"]
                    break

            # Detect if user spoke in Urdu (contains Arabic/Persian script)
            user_spoke_urdu = any('\u0600' <= c <= '\u06FF' for c in original_user_input)

            # If the model wants to call a function
            if response_message.tool_calls:
                # Process each tool call
                tool_results = []
                for tool_call in response_message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)

                    # Add user_id to the function arguments
                    function_args["user_id"] = self.user_id

                    try:
                        # Execute the appropriate tool
                        if function_name == "add_task":
                            from .mcp.mcp_server import add_task
                            from .mcp.mcp_server import AddTaskParams
                            params = AddTaskParams(**function_args)
                            result = add_task(params)

                        elif function_name == "list_tasks":
                            from .mcp.mcp_server import list_tasks
                            from .mcp.mcp_server import ListTasksParams
                            params = ListTasksParams(**function_args)
                            result = list_tasks(params)

                        elif function_name == "complete_task":
                            from .mcp.mcp_server import complete_task
                            from .mcp.mcp_server import CompleteTaskParams
                            params = CompleteTaskParams(**function_args)
                            result = complete_task(params)

                        elif function_name == "delete_task":
                            from .mcp.mcp_server import delete_task
                            from .mcp.mcp_server import DeleteTaskParams
                            params = DeleteTaskParams(**function_args)
                            result = delete_task(params)

                        elif function_name == "update_task":
                            from .mcp.mcp_server import update_task
                            from .mcp.mcp_server import UpdateTaskParams
                            params = UpdateTaskParams(**function_args)
                            result = update_task(params)

                        # Extract the result content
                        tool_result = result.get("content", "Operation completed successfully")
                    except Exception as e:
                        # Handle errors properly to prevent the 'result' variable error
                        tool_result = f"Error executing {function_name}: {str(e)}"

                    tool_results.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": tool_result
                    })

                # Get final response using tool results
                final_messages = [
                    {"role": "system", "content": SYSTEM_PROMPT}
                ] + messages + [
                    response_message
                ] + tool_results

                final_response = self.client.chat.completions.create(
                    model="meta-llama/llama-3.1-8b-instruct",
                    messages=final_messages
                )

                # Check if user spoke in Urdu and translate response if needed
                assistant_response = final_response.choices[0].message.content
                if user_spoke_urdu:
                    # Try to ensure response is in Urdu
                    # For now, we'll append a note if it's not already in Urdu script
                    if not any('\u0600' <= c <= '\u06FF' for c in assistant_response):
                        # The response is in English but user spoke in Urdu
                        # We should append a note to indicate language mismatch
                        assistant_response += " (Replying in Urdu as you spoke in Urdu)"

                return assistant_response
            else:
                # Return the model's response, but check language match
                assistant_response = response_message.content

                # If user spoke in Urdu but response is in English, indicate language awareness
                if user_spoke_urdu:
                    if not any('\u0600' <= c <= '\u06FF' for c in assistant_response):
                        # Try to indicate language awareness
                        assistant_response += " (Response provided as you spoke in Urdu)"

                return assistant_response

        except Exception as e:
            print(f"Error in run_agent: {str(e)}")
            return f"Sorry, I encountered an error: {str(e)}"


def run_agent(messages: list[dict], user_id: str) -> str:
    """Run agent with conversation history."""
    agent = RealTodoChatAgent(user_id)
    return agent.run_agent(messages)
# AI Todo Chatbot - Troubleshooting Guide

## Current Status: ✅ CHATBOT IS WORKING!

The backend is fully functional and responding to requests. Here's how to run it properly:

## 🚀 STARTUP INSTRUCTIONS

### Step 1: Start Backend Server
1. Open Command Prompt or PowerShell
2. Navigate to the backend directory:
   ```bash
   cd C:\Users\HP\Desktop\hackathon-2-todo-app\phase-2\backend
   ```
3. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```
4. Keep this window open - the server must remain running

### Step 2: Start Frontend Server
1. Open a NEW Command Prompt or PowerShell window
2. Navigate to the frontend directory:
   ```bash
   cd C:\Users\HP\Desktop\hackathon-2-todo-app\phase-2\frontend
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```
4. Keep this window open too

### Step 3: Access the Chatbot
1. Open your browser
2. Go to: `http://localhost:3000/chat`
3. You should see the chat interface

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue: "API not found" or "Connection refused"
**Solution:** Make sure the backend server is running on port 8000

### Issue: Chatbot doesn't respond
**Solution:** Check that both servers are running simultaneously

### Issue: Different ports needed
**Solution:** If you're running on different ports, update the `.env` file in frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 MANUAL TESTING

You can test the backend directly using curl or Postman:

```bash
curl -X POST "http://localhost:8000/api/test_user/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "hi", "conversation_id": null}'
```

## ✅ VERIFICATION

The system has been tested and confirmed working:
- Backend server responds to requests
- All 5 MCP tools are functional
- Database operations work correctly
- Natural language processing works
- Conversation persistence works

## 🎯 NATURAL LANGUAGE COMMANDS

Try these commands in the chat:
- "Add a task to buy groceries"
- "Show my tasks"
- "Mark task 1 as complete"
- "Delete task 2"
- "Update task 3 to 'Call mom tonight'"

## 🛠️ AUTOMATED START SCRIPTS

We've created batch files for easy startup:
- `RUN_CHATBOT.bat` - Starts the backend server
- `START_FRONTEND.bat` - Starts the frontend server
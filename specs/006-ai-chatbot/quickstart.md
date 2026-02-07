# Quickstart Guide: AI-Powered Todo Chatbot

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (or Neon Serverless account)
- OpenAI API key
- Better Auth account

## Environment Setup

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies with UV
uv pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
export OPENAI_API_KEY="your-openai-api-key"
export BETTER_AUTH_SECRET="your-better-auth-secret"
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set environment variables
export NEXT_PUBLIC_OPENAI_DOMAIN_KEY="your-openai-domain-key"
export NEXT_PUBLIC_API_URL="http://localhost:8000"
export NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

## Database Setup

### 1. Create Neon Database
- Sign up at https://neon.tech
- Create a new project
- Copy the connection string

### 2. Run Migrations
```bash
# Create conversations and messages tables
psql $DATABASE_URL -f migrations/002_add_chat_tables.sql
```

## Running the Application

### 1. Start Backend
```bash
# From backend directory
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend
```bash
# From frontend directory
npm run dev
```

## API Endpoints

### Chat Endpoint
```
POST /api/{user_id}/chat
Headers: Authorization: Bearer {jwt_token}
Body: {
  "conversation_id": 123,  // Optional, omit for new conversation
  "message": "Add a task to buy groceries"
}
```

### Expected Response
```json
{
  "conversation_id": 123,
  "response": "✓ Created task #456: Buy groceries",
  "tool_calls": []  // Optional debug info
}
```

## Testing the Chatbot

### 1. Natural Language Commands
Try these commands in the chat interface:
- "Add a task to buy groceries"
- "Show my pending tasks"
- "Mark task 5 as complete"
- "Delete the meeting task"
- "Update task 3 to 'Call mom tonight'"

### 2. Multi-turn Conversations
The bot should maintain context across messages:
```
User: "Add a task to buy groceries"
Bot: "✓ Created task #1: Buy groceries"
User: "Add a description"
Bot: "What description would you like to add?"
User: "Milk, eggs, and bread"
Bot: "✓ Updated task #1: Buy groceries with description 'Milk, eggs, and bread'"
```

## MCP Tools Available

The following 5 MCP tools are available to the AI agent:

1. **add_task**: Create new tasks
2. **list_tasks**: View tasks (all/pending/completed)
3. **complete_task**: Mark tasks as done
4. **delete_task**: Remove tasks
5. **update_task**: Modify task details

## Troubleshooting

### Common Issues
- **JWT Error**: Ensure token is valid and user_id matches URL user_id
- **Database Connection**: Verify DATABASE_URL is correct
- **CORS Error**: Check ALLOWED_ORIGINS includes your frontend URL
- **MCP Tools Not Working**: Verify mcp_server.py is properly configured

### Development Tips
- Use `--reload` flag for hot reloading during development
- Check the agent logs for tool invocation details
- Monitor database connections during load testing
- Verify conversation persistence after server restarts
---
id: 1
title: "phase-3-constitution-update"
stage: "constitution"
date: "2026-01-22"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "phase-3-ai-chatbot"
branch: "main"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "phase-3", "ai-chatbot"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "phase-3-constitution.md"
tests: []
---

# Phase III Constitution Update

## Summary

Updated the project constitution to reflect Phase III requirements for the AI-Powered Todo Chatbot. Created a new constitution file (phase-3-constitution.md) that includes specifications for MCP tools, stateless architecture, and agent behavior standards.

## Outcome

Successfully created a comprehensive constitution document that outlines:
- Core principles for Phase III development
- MCP-First design requirements
- Stateless architecture constraints
- Agent behavior standards
- Technology stack specifications
- Security and privacy requirements

## Evaluation

The constitution aligns with all Phase III requirements including:
- Spec-driven development mandate
- MCP tools implementation (add_task, list_tasks, complete_task, delete_task, update_task)
- Stateless server architecture
- Database schema requirements
- JWT authentication requirements
- Bonus features integration (Urdu support, voice commands)

PROMPT_TEXT: |
  # Phase III Constitution - AI-Powered Todo Chatbot

  ## Project Identity

  **Name**: Todo AI Chatbot
  **Phase**: III - Conversational Interface
  **Timeline**: Due Dec 21, 2025
  **Points**: 200 (Base) + Up to 600 (Bonus)

  ---

  ## Core Principles

  ### 1. Spec-Driven Development (MANDATORY)
  - **NO manual coding** - All code must be generated via Claude Code
  - **Specification first** - Write specs before implementation
  - **Iterative refinement** - If output is incorrect, refine spec not code
  - **Traceability** - Every feature maps to a spec file

  ### 2. Stateless Architecture
  - **No in-memory state** - All conversation state persists in database
  - **Horizontal scalability** - Any server instance can handle any request
  - **Server restart resilience** - Conversations survive restarts
  - **Request independence** - Each request is self-contained

  ### 3. MCP-First Design
  - **Tool-based interaction** - AI uses MCP tools, not direct DB calls
  - **Standardized interface** - All operations through MCP protocol
  - **Agent agnostic** - Tools work with any AI agent
  - **Clear separation** - MCP layer between AI and data

  ### 4. Security & Privacy
  - **User isolation** - Users only access their own data
  - **JWT authentication** - Better Auth tokens required
  - **No data leakage** - Filter all queries by authenticated user
  - **Input validation** - Sanitize all user inputs

  ---

  ## Technology Stack (Non-Negotiable)

  ### Frontend
  - **OpenAI ChatKit** - Conversational UI
  - **Next.js 16+** - App Router pattern
  - **Better Auth** - JWT token generation
  - **Domain Allowlist** - Configure on OpenAI platform

  ### Backend
  - **Python FastAPI** - API server
  - **OpenAI Agents SDK** - AI orchestration
  - **Official MCP SDK** - Tool protocol implementation
  - **SQLModel** - ORM for database operations

  ### Database
  - **Neon Serverless PostgreSQL** - Persistent storage
  - **Three models required**:
    - Tasks (existing from Phase II)
    - Conversations (new)
    - Messages (new)

  ### Development Tools
  - **Claude Code** - Code generation
  - **Spec-Kit Plus** - Specification management
  - **UV** - Python package manager

  ---

  ## Architecture Constraints

  ### API Endpoint Structure
  ```
  POST /api/{user_id}/chat
  Request: { conversation_id?: int, message: string }
  Response: { conversation_id: int, response: string, tool_calls: array }
  ```

  ### Database Schema Requirements

  #### Conversations Table
  ```sql
  - id: integer (primary key)
  - user_id: string (foreign key → users.id)
  - created_at: timestamp
  - updated_at: timestamp
  ```

  #### Messages Table
  ```sql
  - id: integer (primary key)
  - conversation_id: integer (foreign key → conversations.id)
  - user_id: string (foreign key → users.id)
  - role: string ('user' | 'assistant')
  - content: text
  - created_at: timestamp
  ```

  ### MCP Tools Contract

  Each tool MUST implement:
  - **user_id parameter** (string, required) - For data isolation
  - **Consistent return format** - { task_id, status, title }
  - **Error handling** - Graceful failures with clear messages
  - **Database transactions** - Atomic operations

  #### Tool Specifications

  **add_task**
  ```python
  Parameters:
    - user_id: string (required)
    - title: string (required, 1-200 chars)
    - description: string (optional, max 1000 chars)
  Returns:
    { task_id: int, status: "created", title: string }
  ```

  **list_tasks**
  ```python
  Parameters:
    - user_id: string (required)
    - status: string (optional: "all" | "pending" | "completed")
  Returns:
    [{ id: int, title: string, completed: bool, ... }]
  ```

  **complete_task**
  ```python
  Parameters:
    - user_id: string (required)
    - task_id: integer (required)
  Returns:
    { task_id: int, status: "completed", title: string }
  ```

  **delete_task**
  ```python
  Parameters:
    - user_id: string (required)
    - task_id: integer (required)
  Returns:
    { task_id: int, status: "deleted", title: string }
  ```

  **update_task**
  ```python
  Parameters:
    - user_id: string (required)
    - task_id: integer (required)
    - title: string (optional)
    - description: string (optional)
  Returns:
    { task_id: int, status: "updated", title: string }
  ```

  ---

  ## Agent Behavior Standards

  ### Natural Language Understanding
  - **Intent recognition** - Map user phrases to correct tools
  - **Context awareness** - Use conversation history
  - **Confirmations** - Always confirm actions taken
  - **Error communication** - Clear, friendly error messages

  ### Response Quality
  - **Concise** - No unnecessary verbosity
  - **Actionable** - Include next steps when relevant
  - **Contextual** - Reference task details in responses
  - **Professional** - Maintain helpful, respectful tone

  ### Tool Chaining
  - **Multi-step operations** - Chain tools when needed
    - Example: "Delete the meeting task" → list_tasks + delete_task
  - **Efficiency** - Minimize redundant tool calls
  - **Validation** - Check prerequisites before operations

  ---

  ## Stateless Request Flow (CRITICAL)

  ### Every Request Must:
  1. **Fetch history** - Load conversation from database
  2. **Build context** - Combine history + new message
  3. **Store user message** - Persist to Messages table
  4. **Run agent** - Execute with MCP tools
  5. **Store assistant response** - Persist to Messages table
  6. **Return response** - Send to client
  7. **Release state** - Server holds NOTHING

  ### Conversation Management
  ```python
  # Pseudocode pattern
  def handle_chat(user_id, message, conversation_id=None):
      # 1. Get or create conversation
      if not conversation_id:
          conversation = create_conversation(user_id)
      else:
          conversation = get_conversation(conversation_id, user_id)

      # 2. Fetch history
      messages = get_messages(conversation.id)

      # 3. Build message array
      context = [{"role": m.role, "content": m.content} for m in messages]
      context.append({"role": "user", "content": message})

      # 4. Store user message
      save_message(conversation.id, "user", message)

      # 5. Run agent
      response = run_agent_with_tools(context)

      # 6. Store assistant response
      save_message(conversation.id, "assistant", response)

      # 7. Return
      return {
          "conversation_id": conversation.id,
          "response": response
      }
  ```

  ---

  ## Bonus Points Integration

  ### Reusable Intelligence (+200)
  - **Create Claude Code Subagents** for:
    - MCP tool generation
    - Database schema updates
    - Agent prompt engineering
  - **Create Agent Skills** for:
    - Conversation history formatting
    - Error handling patterns
    - Tool response parsing

  ### Multi-language Support - Urdu (+100)
  - **Agent system prompt** - Include Urdu language capability
  - **Response formatting** - Support RTL text rendering
  - **Natural language** - Understand Urdu commands
    - Example: "کام شامل کریں" → add_task
    - Example: "تمام کام دکھائیں" → list_tasks

  ### Voice Commands (+200)
  - **Web Speech API** integration in ChatKit
  - **Voice-to-text** conversion
  - **Hands-free operation** - "Hey Todo, add groceries"
  - **Audio feedback** - Text-to-speech responses

  ---

  ## Code Organization Standards

  ### Monorepo Structure
  ```
  hackathon-todo/
  ├── .spec-kit/
  │   └── config.yaml
  ├── specs/
  │   ├── phase3/
  │   │   ├── chatbot-overview.md
  │   │   ├── mcp-tools.md
  │   │   ├── agent-behavior.md
  │   │   ├── database-schema.md
  │   │   └── conversation-flow.md
  │   └── ...
  ├── AGENTS.md
  ├── CLAUDE.md
  ├── frontend/
  │   ├── CLAUDE.md
  │   ├── app/
  │   │   └── chat/
  │   │       └── page.tsx (ChatKit integration)
  │   └── lib/
  │       └── api.ts (chat endpoint client)
  ├── backend/
  │   ├── CLAUDE.md
  │   ├── main.py
  │   ├── models.py (Conversation, Message models)
  │   ├── mcp_server.py (MCP tools)
  │   ├── agent.py (OpenAI Agents SDK setup)
  │   └── routes/
  │       └── chat.py (POST /api/chat endpoint)
  └── README.md
  ```

  ### File Naming Conventions
  - **Specs**: Kebab-case (mcp-tools.md)
  - **Python**: Snake_case (mcp_server.py)
  - **TypeScript**: camelCase (chatApi.ts)
  - **Components**: PascalCase (ChatInterface.tsx)

  ### Code Comments (MANDATORY)
  ```python
  # [Task]: T-003
  # [From]: specs/phase3/mcp-tools.md §2.1
  # [Purpose]: Implement add_task MCP tool

  @mcp.tool()
  async def add_task(user_id: str, title: str, description: str = ""):
      """Create a new task for the user."""
      # Implementation
  ```

  ---

  ## Testing Requirements

  ### MCP Tools Testing
  - **Unit tests** for each tool
  - **User isolation** - Verify data separation
  - **Error cases** - Test invalid inputs
  - **Edge cases** - Empty strings, long text, special chars

  ### Agent Testing
  - **Intent recognition** - Test natural language mapping
  - **Tool chaining** - Test multi-step operations
  - **Context retention** - Test conversation memory
  - **Error recovery** - Test graceful failures

  ### Integration Testing
  - **End-to-end flow** - UI → Agent → MCP → DB
  - **Stateless verification** - Test server restart scenarios
  - **Concurrent requests** - Test race conditions

  ---

  ## Performance Standards

  ### Response Time
  - **Chat endpoint** - < 3 seconds (95th percentile)
  - **MCP tool calls** - < 500ms per tool
  - **Database queries** - Indexed user_id lookups

  ### Scalability
  - **Stateless design** - Support horizontal scaling
  - **Database connection pooling** - Reuse connections
  - **Async operations** - Non-blocking I/O

  ---

  ## Security Checklist

  - [ ] JWT validation on every request
  - [ ] User ID verification (token user === URL user)
  - [ ] SQL injection prevention (parameterized queries)
  - [ ] XSS protection (sanitize outputs)
  - [ ] Rate limiting (prevent abuse)
  - [ ] CORS configuration (whitelist frontend domain)
  - [ ] Secrets management (env variables, not hardcoded)
  - [ ] HTTPS enforcement (production)

  ---

  ## Deployment Requirements

  ### OpenAI ChatKit Setup
  1. **Deploy frontend** to get production URL
  2. **Configure domain allowlist**:
     - https://platform.openai.com/settings/organization/security/domain-allowlist
     - Add your Vercel URL
     - Get domain key
  3. **Set environment variable**: `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`

  ### Environment Variables
  ```bash
  # Backend
  DATABASE_URStep-by-step local development
  2. **MCP tools documentation** - Each tool with examples
  3. **Natural language examples** - 10+ command samples
  4. **Architecture diagram** - Visual flow
  5. **Environment variables** - Complete list
  6. **Deployment guide** - Production setup

  ### Spec Files Must Include
  1. **User stories** - "As a user, I can..."
  2. **Acceptance criteria** - Testable conditions
  3. **Technical approach** - How to implement
  4. **Edge cases** - Error scenarios
  5. **Examples** - Request/response samples

  ---

  ## Success Criteria

  ### Functional
  - [ ] All 5 MCP tools working
  - [ ] Natural language commands recognized
  - [ ] Conversations persist across sessions
  - [ ] Multi-turn conversations maintain context
  - [ ] Error handling graceful
  - [ ] User data isolation enforced

  ### Technical
  - [ ] Stateless server architecture
  - [ ] MCP protocol properly implemented
  - [ ] OpenAI Agents SDK integrated
  - [ ] Database schema complete
  - [ ] JWT authentication working

  ### Quality
  - [ ] Spec-driven development followed
  - [ ] All code generated by Claude Code
  - [ ] Comprehensive specs in /specs folder
  - [ ] CLAUDE.md files updated
  - [ ] Demo video < 90 seconds

  ---

  ## Prohibited Practices

  ### ❌ NEVER DO THIS
  - Manual code writing (violates spec-driven rule)
  - Hardcoded user data or credentials
  - Session state in memory (breaks stateless principle)
  - Direct database calls from agent (use MCP tools)
  - Skipping JWT validation
  - Exposing other users' data
  - Inventing features not in spec

  ### ✅ ALWAYS DO THIS
  - Write spec before implementation
  - Use Claude Code for code generation
  - Store all state in database
  - Route all operations through MCP tools
  - Validate JWT on every request
  - Filter queries by authenticated user
  - Map features to spec files

  ---

  ## Submission Deliverables

  ### GitHub Repository
  - [ ] `/specs/phase3/` folder with all specifications
  - [ ] Updated AGENTS.md and CLAUDE.md
  - [ ] Frontend with ChatKit integration
  - [ ] Backend with MCP server and Agent
  - [ ] Database migration scripts
  - [ ] README with setup guide

  ### Deployed Application
  - [ ] Vercel URL for frontend
  - [ ] Backend API URL
  - [ ] OpenAI domain allowlist configured
  - [ ] Environment variables set

  ### Demo Video (90 seconds max)
  - [ ] Show natural language task creation
  - [ ] Demonstrate conversation continuity
  - [ ] Show multi-turn interaction
  - [ ] Display MCP tool invocations
  - [ ] Show error handling
  - [ ] (If bonus) Urdu or voice demo

  ---

  ## References

  ### Official Documentation
  - OpenAI Agents SDK: https://github.com/openai/openai-agents-sdk
  - MCP Protocol: https://github.com/modelcontextprotocol/python-sdk
  - ChatKit: https://platform.openai.com/docs/guides/chatkit
  - Better Auth: https://www.better-auth.com/docs

  ### Hackathon Resources
  - Spec-Kit Plus: https://github.com/panaversity/spec-kit-plus
  - Claude Code: https://claude.com/product/claude-code
  - Phase III Spec (this document): `specs/phase3/`

  ---

  ## Version History

  - **v1.0** - Initial constitution for Phase III
  - **Created**: Based on Hackathon II requirements

RESPONSE_TEXT: |
  Created a new constitution file for Phase III - the AI-Powered Todo Chatbot. The file phase-3-constitution.md contains comprehensive guidelines covering:

  - Core principles for spec-driven development, stateless architecture, and MCP-first design
  - Detailed technology stack requirements
  - MCP tool specifications for add_task, list_tasks, complete_task, delete_task, and update_task
  - Stateless request flow patterns
  - Agent behavior standards
  - Security and privacy requirements
  - Bonus features integration (Urdu support, voice commands)
  - Code organization standards
  - Testing and performance requirements

  The constitution aligns with all Phase III requirements and provides clear guidelines for implementation while maintaining the spec-driven development approach.
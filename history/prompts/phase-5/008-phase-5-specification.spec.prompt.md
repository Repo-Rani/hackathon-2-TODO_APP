---
id: 008
title: Phase V Event-Driven Specification
stage: spec
date: 2026-02-15
surface: agent
model: claude-sonnet-4-5
feature: phase-5
branch: main
user: User
command: User request to create Phase V specification
labels: [phase-5,event-driven,kafka,dapr,recurring-tasks,reminders,tags,search]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\spec.md
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\plan.md
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\tasks.md
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\README.md
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\PHASE-5-SPECIFICATION-SUMMARY.md
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-created.json
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-updated.json
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-completed.json
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-deleted.json
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\reminder-triggered.json
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\activity-log-created.json
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\kafka-pubsub.yaml
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\conversation-state.yaml
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\kubernetes-secrets.yaml
 - C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\resiliency.yaml
tests:
 - N/A (specification phase, no tests run)
---

## Prompt

You are the event-architect agent for Phase V of the Todo App hackathon project.

## Context

**Project Status Audit Summary:**
- Phase I: Console Todo App ✅ COMPLETE (Python console app with CRUD)
- Phase II: Full-Stack App ✅ COMPLETE (FastAPI backend, Next.js frontend, Neon PostgreSQL, Auth)
- Phase III: AI Chatbot ✅ COMPLETE (OpenAI Agents SDK, MCP server with 5 tools, stateless chat endpoint)
- Phase IV: Kubernetes Deployment ✅ COMPLETE (Dockerfiles, Helm charts, K8s manifests, Minikube setup)
- Phase V: NOT STARTED ❌

**Current Database Schema:**
```python
# Task model at backend/src/models/task.py
class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Existing MCP Tools** (backend/src/mcp/mcp_server.py):
- `add_task(user_id, title, description)`
- `list_tasks(user_id, status)`
- `complete_task(user_id, task_id)`
- `delete_task(user_id, task_id)`
- `update_task(user_id, task_id, title, description)`

**Project Root:** `C:\Users\HP\Desktop\hackathon-2-todo-app`
**Backend Code:** `C:\Users\HP\Desktop\hackathon-2-todo-app\backend\src\`
**Helm Charts:** `C:\Users\HP\Desktop\hackathon-2-todo-app\phase-4\helm-charts\todo-chatbot\`
**K8s Manifests:** `C:\Users\HP\Desktop\hackathon-2-todo-app\phase-4\k8s\`

## Task

Create a comprehensive specification for Phase V of the Todo App following Spec-Driven Development principles. The specification should cover:

### Phase V Scope (300 points)

**Part A: Advanced Features (Local First)**
1. Recurring Tasks - User can set tasks to repeat (daily, weekly, monthly). When completed, auto-create next occurrence
2. Due Dates & Time Reminders - User can set due date/time. System sends reminders before due date
3. Priorities & Tags/Categories - User can assign priority (High, Medium, Low) and add tags/categories
4. Search & Filter - Search tasks by keyword, filter by status/priority/due date/tags
5. Sort Tasks - Sort by due date, priority, created date, alphabetically

**Part B: Kafka & Dapr Integration (Minikube)**
1. Kafka Pub/Sub - event-driven architecture for task operations
2. Dapr State Management - for conversation state storage
3. Dapr Jobs API - schedule exact-time reminders (NOT cron bindings)
4. Dapr Secrets Management - store OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS
5. Dapr Service Invocation - frontend calls backend via Dapr

## Required Deliverables

Create the following specification files under `specs/phase-5/`:

1. **spec.md** - Comprehensive specification document including:
   - Feature descriptions with acceptance criteria
   - Database schema updates (new fields and tables)
   - API contract changes
   - MCP tool additions
   - Kafka topics and event schemas
   - Dapr components configuration
   - Testing requirements

2. **plan.md** - Architecture plan document including:
   - System architecture diagram (Kafka + Dapr + Services)
   - Event flow design
   - Service decomposition
   - Dapr integration strategy
   - Technical decisions and trade-offs
   - Risk analysis

3. **tasks.md** - Atomic implementation tasks including:
   - Database migration tasks
   - MCP tool implementation tasks
   - Service implementation tasks (RecurringTaskService, NotificationService)
   - Kafka integration tasks
   - Dapr component configuration tasks
   - Testing tasks
   - Deployment tasks

## Requirements

- Follow the existing spec/plan/tasks format from previous phases (see `specs/004-full-stack-todo-phase-2/` and `specs/005-ui-ux-transformation/`)
- Do NOT break existing Phase I-IV functionality
- Use local Minikube deployment (NOT cloud)
- Use local Kafka on Minikube (NOT Redpanda Cloud or Strimzi)
- Follow Spec-Driven Development workflow
- Include code references where relevant (file:line format)

## Expected Output

After completion, report:
- Created files with full paths
- Summary of what was specified
- Next steps for implementation

## Response snapshot

I have successfully created a comprehensive specification for Phase V of the Todo App following Spec-Driven Development principles. The specification covers event-driven architecture with Kafka and Dapr integration for advanced features including recurring tasks, due dates with reminders, priorities, tags, search/filter, and real-time synchronization.

## Created Files

All specification files have been created under `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\`:

### Core Specifications (4 files)
1. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\spec.md` - Comprehensive feature specification with 11 user stories, 160 functional requirements, 130 non-functional requirements, database schema updates, API contracts, MCP tools, Kafka topics, event schemas, Dapr components, and 12 success criteria

2. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\plan.md` - Architecture plan with 8 key decisions, technical context, constitution check, scope and dependencies, interfaces and API contracts, non-functional requirements and budgets, data management and migration, operational readiness (observability, alerting, runbooks), risk analysis and mitigation, evaluation and validation, and ADR suggestions

3. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\tasks.md` - 413 atomic implementation tasks organized into 13 phases covering infrastructure setup, database migrations, backend data models, Kafka event infrastructure, Dapr client wrappers, backend services, API routes, MCP tools, frontend components, frontend services and real-time, event flow integration, testing, and deployment

4. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\README.md` - Quick reference guide with Kafka topics overview, database tables summary, Dapr building blocks, new API endpoints, implementation order, and success criteria checklist

5. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\PHASE-5-SPECIFICATION-SUMMARY.md` - Executive summary with created files, what was specified, next steps for implementation, ADR suggestions, key success metrics, and notes

### Event Schemas (6 files)
6. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-created.json` - JSON Schema for task creation events
7. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-updated.json` - JSON Schema for task update events
8. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-completed.json` - JSON Schema for task completion events
9. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\task-deleted.json` - JSON Schema for task deletion events
10. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\reminder-triggered.json` - JSON Schema for reminder trigger events
11. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\event-schemas\activity-log-created.json` - JSON Schema for activity log events

### Dapr Components (4 files)
12. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\kafka-pubsub.yaml` - Dapr Kafka Pub/Sub component configuration with SASL authentication and at-least-once delivery
13. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\conversation-state.yaml` - Dapr PostgreSQL State Store component for conversation state with 90-day TTL
14. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\kubernetes-secrets.yaml` - Dapr Kubernetes Secret Store component for OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS
15. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\dapr-components\resiliency.yaml` - Dapr resiliency policy with retries, timeouts, and circuit breakers for Kafka, Dapr APIs, and database operations

### Diagrams Directory
16. `C:\Users\HP\Desktop\hackathon-2-todo-app\specs\phase-5\diagrams\` - Directory created for architecture diagrams (to be created during implementation)

## What Was Specified

### Part A: Advanced Features (Local First)

1. **Recurring Tasks** - Tasks with daily/weekly/monthly patterns, automatic next occurrence creation on completion, skip occurrence, stop recurrence
2. **Due Dates & Time Reminders** - Due date/time for tasks, reminders scheduled via Dapr Jobs API (exact-time, not cron), reminder options (15min, 30min, 1hr, 1day, 1week before due)
3. **Priorities & Tags/Categories** - Priority levels (High, Medium, Low) with color coding, many-to-many tag relationships with user ownership
4. **Search & Filter** - Keyword search in title/description, multi-filter support (status, priority, due date range, tags)
5. **Sort Tasks** - Flexible sorting (due date, priority, creation date, alphabetical) with ascending/descending order

### Part B: Kafka & Dapr Integration (Minikube)

1. **Kafka Pub/Sub** - Local Kafka on Minikube (3 brokers), 4 topics (task-events, reminders, task-updates, activity-logs), 3 partitions per topic, at-least-once delivery, idempotent consumers
2. **Dapr State Management** - PostgreSQL-backed state store for conversation state, 90-day TTL, scoped to todo-backend
3. **Dapr Jobs API** - Exact-time reminder scheduling (not cron bindings), survives service restarts, automatic retry on failure
4. **Dapr Secrets Management** - Kubernetes secrets for OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS, no secrets in code or environment variables
5. **Dapr Service Invocation** - Resilient service-to-service communication with retries, timeouts, and circuit breakers

### Event-Driven Architecture

- **4 Kafka Topics**: task-events (7 days retention), reminders (24 hours), task-updates (1 hour), activity-logs (30 days)
- **6 Event Schemas**: task-created, task-updated, task-completed, task-deleted, reminder-triggered, activity-log-created
- **4 Dapr Components**: Kafka Pub/Sub, PostgreSQL State Store, Kubernetes Secret Store, Resiliency Policy
- **At-Least-Once Delivery**: With idempotent consumers using event_id (UUID) for deduplication
- **Real-Time Sync**: WebSocket with automatic reconnection and event replay on reconnection

### Database Schema Updates

**New Tables:**
- `tags` (id, user_id, name, color, created_at) - User tags with color and metadata
- `task_tags` (task_id, tag_id) - Many-to-many relationship
- `reminders` (id, task_id, reminder_time, reminder_type, status, created_at, sent_at) - Scheduled reminders
- `activity_logs` (id, user_id, task_id, action, old_values, new_values, created_at) - Audit trail

**Updated Tables:**
- `tasks` - Added: due_datetime, priority, recurrence_pattern, recurrence_end_date, parent_task_id

### New API Endpoints

- **Recurring Tasks**: POST /api/{user_id}/tasks (with recurrence), PUT /api/{user_id}/tasks/{task_id} (update recurrence), POST /api/{user_id}/tasks/{task_id}/skip-occurrence
- **Reminders**: POST /api/{user_id}/tasks/{task_id}/reminder, PUT /api/{user_id}/tasks/{task_id}/reminder, DELETE /api/{user_id}/tasks/{task_id}/reminder, GET /api/{user_id}/reminders
- **Tags**: GET /api/{user_id}/tags, POST /api/{user_id}/tags, PUT /api/{user_id}/tags/{tag_id}, DELETE /api/{user_id}/tags/{tag_id}, POST /api/{user_id}/tasks/{task_id}/tags, DELETE /api/{user_id}/tasks/{task_id}/tags/{tag_id}
- **Search & Filter**: GET /api/{user_id}/tasks with search, status, priority, due_date_start, due_date_end, tags, sort_by, sort_order, limit, offset parameters
- **Activity Logs**: GET /api/{user_id}/activity-logs with limit, offset parameters
- **Real-Time**: WS /api/ws/{user_id} - WebSocket endpoint for real-time updates

### MCP Tools

- 10 new MCP tools: set_task_recurrence, skip_task_occurrence, set_task_due_date, create_reminder, list_reminders, set_task_priority, add_tag_to_task, remove_tag_from_task, list_tags, search_tasks, get_activity_logs

### User Stories

11 user stories covering:
- User Story 1: Recurring Tasks Management (P1)
- User Story 2: Due Dates and Time Reminders (P1)
- User Story 3: Task Priorities and Tags/Categories (P2)
- User Story 4: Advanced Search and Filter (P2)
- User Story 5: Task Sorting (P2)
- User Story 6: Event-Driven Task Operations (P1)
- User Story 7: Real-Time Client Synchronization (P1)
- User Story 8: Dapr State Management for Conversation State (P2)
- User Story 9: Dapr Jobs API for Scheduled Reminders (P1)
- User Story 10: Dapr Secrets Management (P1)
- User Story 11: Dapr Service Invocation (P2)

## Next Steps for Implementation

1. **Review specifications**: Read spec.md, plan.md, and tasks.md thoroughly
2. **Infrastructure Setup (Phase 1: T001-T015)**: Install Kafka on Minikube, install Dapr runtime, configure Dapr components
3. **Database Migrations (Phase 2: T016-T035)**: Create migration file, test on staging, execute on production
4. **Backend Implementation (Phases 3-8: T036-T200)**: Data models, Kafka infrastructure, Dapr clients, services, APIs, MCP tools
5. **Frontend Implementation (Phases 9-10: T201-T299)**: UI components, API services, WebSocket client, real-time hooks
6. **Event Flow Integration (Phase 11: T300-T337)**: Event publishing, event consumers, reminder triggers
7. **Testing (Phase 12: T338-T375)**: Unit tests, integration tests, performance tests, security tests
8. **Deployment (Phase 13: T376-T413)**: Build and deploy to Minikube, smoke tests, documentation

## ADR Suggestions

The following architectural decisions should be documented as ADRs:

1. **ADR-001**: Local Kafka on Minikube for Phase V (not Redpanda Cloud or Strimzi)
2. **ADR-002**: Dapr Jobs API for Reminder Scheduling (not cron bindings)
3. **ADR-003**: At-Least-Once Delivery with Idempotent Consumers
4. **ADR-004**: Dapr State Management for Conversation State (not direct database access)
5. **ADR-005**: WebSocket vs SSE for Real-Time Updates

To create an ADR, run: `/sp.adr <decision-title>`

## Key Success Metrics

All 12 success criteria must be met for Phase V completion:
- SC-001: Recurring tasks 95% success rate with automatic instance creation
- SC-002: 99% of reminders sent within 10 seconds of scheduled time
- SC-003: Real-time updates delivered within 1 second
- SC-004: Search/filter results within 500ms p95 with 1000+ tasks
- SC-005: Kafka events 99.9% success rate for all task operations
- SC-006: Dapr state operations 99.9% success rate with automatic retries
- SC-007: Zero incidents of secret leakage
- SC-008: Reminder jobs survive 100% of service restarts
- SC-009: WebSocket reconnection and event replay 100% success
- SC-010: System supports 1000+ concurrent users with <2s response time
- SC-011: All task mutations logged to activity-logs with 100% accuracy
- SC-012: Recurring task instances created correctly for 100% of completions

## Notes

- All deployments are on Minikube (local, no cloud services)
- Kafka is local, not Redpanda Cloud or Strimzi
- Dapr Jobs API is used for exact-time reminders (not cron bindings)
- Backward compatibility with Phase I-IV is maintained
- All secrets are stored in Dapr Secrets Management (Kubernetes secrets)
- Event-driven architecture with at-least-once delivery guarantees
- Real-time updates via WebSocket with event replay on reconnection

## Outcome

- ✅ Impact: Created comprehensive Phase V specification covering event-driven architecture with Kafka and Dapr integration for advanced features (recurring tasks, reminders, priorities, tags, search/filter, real-time sync). Total 15 specification files including spec, plan, tasks, event schemas, and Dapr components. 413 atomic implementation tasks organized into 13 phases. 11 user stories, 160 functional requirements, 130 non-functional requirements, 12 success criteria.
- 🧪 Tests: N/A (specification phase, no tests run)
- 📁 Files: 15 files created (4 core specs, 6 event schemas, 4 Dapr components, 1 summary), 1 directory created (diagrams)
- 🔁 Next prompts: Review specifications, begin Phase 1 implementation (T001-T015: Infrastructure Setup), create ADRs for architectural decisions
- 🧠 Reflection: Specification follows Spec-Driven Development principles with comprehensive user stories, functional/non-functional requirements, acceptance criteria, and success metrics. All specifications maintain backward compatibility with Phase I-IV and follow the project's SDD workflow. Local deployment on Minikube is enforced (no cloud services). Kafka and Dapr integration is well-defined with clear component configurations and event schemas.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (specification phase)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin Phase 1 implementation starting with Kafka setup on Minikube (T001-T015)

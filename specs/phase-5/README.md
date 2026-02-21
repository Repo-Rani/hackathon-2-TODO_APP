# Phase V - Event-Driven Advanced Features

## Overview

Phase V transforms the Todo App into an event-driven microservices architecture with Kafka and Dapr integration. This phase introduces advanced productivity features including recurring tasks, due dates with reminders, priorities, tags, search/filter, and real-time synchronization.

## Specification Documents

### Core Specifications

- **[spec.md](./spec.md)** - Comprehensive feature specification including:
  - 11 user stories covering all Phase V features
  - Functional requirements (FR-101 to FR-160)
  - Non-functional requirements (NFR-101 to NFR-130)
  - Database schema updates (new tables and columns)
  - API contract changes (new endpoints and updated schemas)
  - MCP tool additions (10 new tools)
  - Kafka topics and event schemas
  - Dapr components configuration
  - Testing requirements
  - Success criteria (SC-001 to SC-012)

- **[plan.md](./plan.md)** - Architecture plan document including:
  - Technical context and constraints
  - Constitution check validation
  - Scope and dependencies
  - Key architectural decisions with rationale
  - Interfaces and API contracts
  - Non-functional requirements and budgets
  - Data management and migration strategy
  - Operational readiness (observability, alerting, runbooks)
  - Risk analysis and mitigation
  - Evaluation and validation criteria
  - Architectural Decision Records (ADR) suggestions

- **[tasks.md](./tasks.md)** - Atomic implementation tasks including:
  - 413 tasks organized into 13 phases
  - Phase 1: Infrastructure Setup (Kafka & Dapr on Minikube)
  - Phase 2: Database Migrations
  - Phase 3: Backend Data Models
  - Phase 4: Kafka Event Infrastructure
  - Phase 5: Dapr Client Wrappers
  - Phase 6: Backend Services
  - Phase 7: Backend API Routes
  - Phase 8: MCP Tool Additions
  - Phase 9: Frontend Components
  - Phase 10: Frontend Services and Real-Time
  - Phase 11: Event Flow Integration
  - Phase 12: Testing and Quality Assurance
  - Phase 13: Deployment and Documentation
  - Dependencies and parallel execution strategies
  - Implementation strategy (MVP first, incremental delivery)

## Event Schemas

The [event-schemas/](./event-schemas/) directory contains JSON Schema definitions for all Kafka events:

- **task-created.json** - Schema for task creation events
- **task-updated.json** - Schema for task update events
- **task-completed.json** - Schema for task completion events
- **task-deleted.json** - Schema for task deletion events
- **reminder-triggered.json** - Schema for reminder trigger events
- **activity-log-created.json** - Schema for activity log events

Each event schema includes:
- Required fields: event_type, event_id, timestamp, version, data
- Version field for schema evolution (semver)
- Data field with event-specific payload
- JSON Schema validation rules

## Dapr Components

The [dapr-components/](./dapr-components/) directory contains Dapr component configuration YAML files:

- **kafka-pubsub.yaml** - Kafka Pub/Sub component configuration
  - Brokers: kafka:9092
  - Consumer group: todo-app-consumer-group
  - Auth: SASL with username/password from secrets
  - Delivery semantic: at_least_once
  - TLS: disabled (local deployment)

- **conversation-state.yaml** - PostgreSQL State Store component
  - Table: conversation_state
  - Key prefix: conversation
  - TTL: 90 days
  - Scope: todo-backend only

- **kubernetes-secrets.yaml** - Kubernetes Secret Store component
  - Stores: OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS
  - Scope: todo-backend and todo-frontend

- **resiliency.yaml** - Dapr Resiliency Policy
  - Retries: 3 attempts with exponential backoff
  - Timeouts: 5-30 seconds depending on operation
  - Circuit Breakers: Trip after 5 consecutive failures
  - Applied to Kafka, Dapr APIs, and database operations

## Diagrams

The [diagrams/](./diagrams/) directory will contain visual architecture diagrams (to be created during implementation):

- **architecture.png** - System architecture diagram showing Kafka, Dapr, and services
- **event-flow.png** - Event flow diagram showing event publication and consumption
- **kafka-topics.png** - Kafka topics diagram showing partitions and consumer groups

## Quick Reference

### Kafka Topics

| Topic | Partitions | Retention | Purpose |
|-------|-----------|-----------|---------|
| task-events | 3 | 7 days | All task mutations |
| reminders | 3 | 24 hours | Reminder events |
| task-updates | 3 | 1 hour | Real-time client sync |
| activity-logs | 3 | 30 days | Activity audit events |

### Database Tables

**New Tables:**
- `tags` - User tags for task categorization
- `task_tags` - Many-to-many relationship between tasks and tags
- `reminders` - Scheduled reminder notifications
- `activity_logs` - Audit trail of task mutations

**Updated Tables:**
- `tasks` - Added: due_datetime, priority, recurrence_pattern, recurrence_end_date, parent_task_id

### Dapr Building Blocks

- **Pub/Sub** - Kafka integration for event streaming
- **State Management** - PostgreSQL for conversation state
- **Jobs API** - Exact-time reminder scheduling
- **Secrets Management** - Kubernetes secrets for sensitive data
- **Service Invocation** - Resilient service-to-service communication

### New API Endpoints

**Recurring Tasks:**
- `POST /api/{user_id}/tasks` - Support recurrence_pattern
- `PUT /api/{user_id}/tasks/{task_id}` - Update recurrence settings
- `POST /api/{user_id}/tasks/{task_id}/skip-occurrence` - Skip next occurrence

**Reminders:**
- `POST /api/{user_id}/tasks/{task_id}/reminder` - Create reminder
- `PUT /api/{user_id}/tasks/{task_id}/reminder` - Update reminder
- `DELETE /api/{user_id}/tasks/{task_id}/reminder` - Cancel reminder
- `GET /api/{user_id}/reminders` - List reminders

**Tags:**
- `GET /api/{user_id}/tags` - List tags
- `POST /api/{user_id}/tags` - Create tag
- `PUT /api/{user_id}/tags/{tag_id}` - Update tag
- `DELETE /api/{user_id}/tags/{tag_id}` - Delete tag
- `POST /api/{user_id}/tasks/{task_id}/tags` - Add tag to task
- `DELETE /api/{user_id}/tasks/{task_id}/tags/{tag_id}` - Remove tag

**Search & Filter:**
- `GET /api/{user_id}/tasks?search=...&status=...&priority=...&due_date_start=...&due_date_end=...&tags=...&sort_by=...&sort_order=...` - Advanced search and filter

**Activity Logs:**
- `GET /api/{user_id}/activity-logs?limit=...&offset=...` - Get activity feed

**Real-Time:**
- `WS /api/ws/{user_id}` - WebSocket for real-time updates

## Implementation Order

### Phase 1: Infrastructure (T001-T015)
1. Install Kafka on Minikube
2. Install Dapr runtime
3. Configure Dapr components
4. Verify connectivity

### Phase 2-3: Database & Models (T016-T054)
1. Create migrations
2. Define data models
3. Test relationships

### Phase 4-5: Event Infrastructure (T055-T103)
1. Create Kafka producer/consumer
2. Define event schemas
3. Create Dapr client wrappers
4. Test integration

### Phase 6-7: Backend Services & APIs (T104-T183)
1. Implement business logic services
2. Create API endpoints
3. Integrate with Kafka and Dapr
4. Write tests

### Phase 8: MCP Tools (T184-T200)
1. Add new MCP tools
2. Test via AI chatbot

### Phase 9-10: Frontend (T201-T299)
1. Create UI components
2. Implement API services
3. Add WebSocket client
4. Test real-time updates

### Phase 11: Event Flow (T300-T337)
1. Integrate event publishing
2. Implement event consumers
3. Test end-to-end flows

### Phase 12: Testing (T338-T375)
1. Run unit tests
2. Run integration tests
3. Run performance tests
4. Run security tests

### Phase 13: Deployment (T376-T413)
1. Build and deploy
2. Smoke tests
3. Complete documentation

## Success Criteria

All success criteria must be met for Phase V completion:

- [ ] SC-001: Recurring tasks 95% success rate with automatic instance creation
- [ ] SC-002: 99% of reminders sent within 10 seconds of scheduled time
- [ ] SC-003: Real-time updates delivered within 1 second
- [ ] SC-004: Search/filter results within 500ms p95 with 1000+ tasks
- [ ] SC-005: Kafka events 99.9% success rate for all task operations
- [ ] SC-006: Dapr state operations 99.9% success rate with automatic retries
- [ ] SC-007: Zero incidents of secret leakage
- [ ] SC-008: Reminder jobs survive 100% of service restarts
- [ ] SC-009: WebSocket reconnection and event replay 100% success
- [ ] SC-010: System supports 1000+ concurrent users with <2s response time
- [ ] SC-011: All task mutations logged to activity-logs with 100% accuracy
- [ ] SC-012: Recurring task instances created correctly for 100% of completions

## ADR Suggestions

The following architectural decisions should be documented as ADRs:

1. **ADR-001**: Local Kafka on Minikube for Phase V (not Redpanda Cloud or Strimzi)
2. **ADR-002**: Dapr Jobs API for Reminder Scheduling (not cron bindings)
3. **ADR-003**: At-Least-Once Delivery with Idempotent Consumers
4. **ADR-004**: Dapr State Management for Conversation State (not direct database access)
5. **ADR-005**: WebSocket vs SSE for Real-Time Updates

To create an ADR, run: `/sp.adr <decision-title>`

## Notes

- All deployments are on Minikube (local, no cloud services)
- Kafka is local, not Redpanda Cloud or Strimzi
- Dapr Jobs API is used for exact-time reminders (not cron bindings)
- Backward compatibility with Phase I-IV is maintained
- All secrets are stored in Dapr Secrets Management (Kubernetes secrets)
- Event-driven architecture with at-least-once delivery guarantees
- Real-time updates via WebSocket with event replay on reconnection

## Next Steps

1. Review [spec.md](./spec.md) for detailed requirements
2. Review [plan.md](./plan.md) for architectural decisions
3. Review [tasks.md](./tasks.md) for implementation tasks
4. Set up infrastructure (Phase 1: T001-T015)
5. Start implementation following task order in tasks.md

## Related Documents

- [Project Constitution](../../.specify/memory/constitution.md)
- [Phase I Specifications](../../specs/001-add-task/)
- [Phase II Specifications](../../specs/004-full-stack-todo-phase-2/)
- [Phase III Specifications](../../specs/005-ui-ux-transformation/)
- [Phase IV Specifications](../../specs/phase-4/)

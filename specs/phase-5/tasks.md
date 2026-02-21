# Tasks: Phase V - Event-Driven Advanced Features

**Feature**: Phase V - Event-Driven Advanced Features with Kafka and Dapr
**Branch**: `phase-5`
**Created**: 2026-02-15

## Summary

Implementation tasks for Phase V of the Todo App, introducing event-driven architecture with Kafka and Dapr integration. Tasks cover advanced features (recurring tasks, reminders, priorities, tags, search/filter) and infrastructure (Kafka, Dapr components, real-time sync). All tasks follow Spec-Driven Development principles and maintain backward compatibility with Phase I-IV.

## Phase 1: Infrastructure Setup (Kafka & Dapr on Minikube)

### Goal
Set up local Kafka cluster and Dapr runtime on Minikube, configure Dapr components for Pub/Sub, State Management, Jobs API, and Secrets Management.

### Independent Test Criteria
- Kafka cluster is running and accessible from Minikube
- Dapr sidecars are injected into pods
- Dapr components are configured and working
- Health checks pass for all components

### Tasks

- [ ] T001 Install and configure local Kafka on Minikube (3 brokers, 3 Zookeepers)
- [ ] T002 Create Kafka topics (task-events, reminders, task-updates, activity-logs) with proper partitioning
- [ ] T003 Install Dapr runtime on Minikube (dapr init --kubernetes --runtime-version 1.12+)
- [ ] T004 Create Dapr Kafka Pub/Sub component configuration (kafka-pubsub.yaml)
- [ ] T005 Create Dapr PostgreSQL State Store component configuration (conversation-state.yaml)
- [ ] T006 Create Dapr Kubernetes Secret Store component configuration (kubernetes-secrets.yaml)
- [ ] T007 Create Dapr resiliency policy configuration (retries, timeouts, circuit breakers)
- [ ] T008 Configure Kubernetes secrets for OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS
- [ ] T009 Update Helm charts to include Kafka deployment and Dapr components
- [ ] T010 Update Kubernetes manifests to include Dapr sidecar injection annotations
- [ ] T011 Create setup script for Kafka and Dapr initialization (scripts/setup-kafka.sh, scripts/setup-dapr.sh)
- [ ] T012 Verify Kafka connectivity from backend pods (telnet/nc test)
- [ ] T013 Verify Dapr sidecar connectivity (curl localhost:3500/v1.0/healthz)
- [ ] T014 Test Dapr Pub/Sub with sample message
- [ ] T015 Test Dapr State Management with sample state

## Phase 2: Database Migrations

### Goal
Create and execute database migrations for new tables (tags, task_tags, reminders, activity_logs) and new columns in tasks table.

### Independent Test Criteria
- Database migrations run successfully
- New tables are created with correct schema
- New columns are added to tasks table
- Indexes are created for performance
- Rollback migration works correctly

### Tasks

- [ ] T016 Create migration file 005_add_advanced_features.py in backend/src/migrations/
- [ ] T017 Add tags table with id, user_id, name, color, created_at fields
- [ ] T018 Add task_tags many-to-many table with task_id, tag_id foreign keys
- [ ] T019 Add reminders table with id, task_id, reminder_time, reminder_type, status, created_at, sent_at fields
- [ ] T020 Add activity_logs table with id, user_id, task_id, action, old_values, new_values, created_at fields
- [ ] T021 Add due_datetime column to tasks table
- [ ] T022 Add priority column to tasks table with CHECK constraint (High, Medium, Low)
- [ ] T023 Add recurrence_pattern column to tasks table with CHECK constraint (daily, weekly, monthly, none)
- [ ] T024 Add recurrence_end_date column to tasks table
- [ ] T025 Add parent_task_id column to tasks table with self-referencing foreign key
- [ ] T026 Create indexes on tags(user_id, name) for uniqueness
- [ ] T027 Create indexes on activity_logs(user_id, created_at) for query performance
- [ ] T028 Create indexes on activity_logs(task_id) for query performance
- [ ] T029 Create indexes on reminders(task_id, reminder_time) for query performance
- [ ] T030 Populate default priority values for existing tasks (set to 'Medium')
- [ ] T031 Write downgrade migration script (drop tables, remove columns)
- [ ] T032 Test migration on staging database
- [ ] T033 Test rollback migration on staging database
- [ ] T034 Execute migration on production database
- [ ] T035 Verify data integrity after migration

## Phase 3: Backend Data Models

### Goal
Create SQLModel classes for new entities (Tag, Reminder, ActivityLog) and update Task model with new fields.

### Independent Test Criteria
- All models are created and valid
- Relationships are properly defined
- Type hints are correct
- Models pass validation tests

### Tasks

- [ ] T036 Create Tag model in backend/src/models/tag.py (id, user_id, name, color, created_at)
- [ ] T037 Create TagBase, TagCreate, TagUpdate, TagResponse schemas
- [ ] T038 Create Reminder model in backend/src/models/reminder.py (id, task_id, reminder_time, reminder_type, status, created_at, sent_at)
- [ ] T039 Create ReminderBase, ReminderCreate, ReminderUpdate, ReminderResponse schemas
- [ ] T040 Create ActivityLog model in backend/src/models/activity_log.py (id, user_id, task_id, action, old_values, new_values, created_at)
- [ ] T041 Create ActivityLogBase, ActivityLogCreate, ActivityLogResponse schemas
- [ ] T042 Update TaskBase in backend/src/models/task.py with new fields (due_datetime, priority, recurrence_pattern, recurrence_end_date)
- [ ] T043 Update TaskCreate schema to include new optional fields
- [ ] T044 Update TaskUpdate schema to include new optional fields
- [ ] T045 Update TaskResponse schema to include new fields and nested tags/reminder objects
- [ ] T046 Add relationship from Task to Tag (many-to-many via task_tags)
- [ ] T047 Add relationship from Task to Reminder (one-to-many)
- [ ] T048 Add relationship from Task to ActivityLog (one-to-many)
- [ ] T049 Update Task model with parent_task_id self-referencing relationship
- [ ] T050 Update backend/src/models/__init__.py to export new models
- [ ] T051 Write unit tests for Tag model
- [ ] T052 Write unit tests for Reminder model
- [ ] T053 Write unit tests for ActivityLog model
- [ ] T054 Write unit tests for updated Task model

## Phase 4: Kafka Event Infrastructure

### Goal
Create Kafka producer, consumer, event schemas, and serializers for event-driven architecture.

### Independent Test Criteria
- Kafka producer can publish events
- Kafka consumer can consume events
- Event schemas are validated
- Serialization/deserialization works correctly
- Events are published to correct topics

### Tasks

- [ ] T055 Create event schemas in backend/src/events/event_schemas.py (task-created, task-updated, task-completed, task-deleted, reminder-triggered, activity-log-created)
- [ ] T056 Define event schema classes with Pydantic validation
- [ ] T057 Add version field to all event schemas
- [ ] T058 Create event serializers in backend/src/events/serializers.py (model to JSON, JSON to model)
- [ ] T059 Create Kafka producer wrapper in backend/src/services/kafka_producer.py
- [ ] T060 Configure Kafka producer with at-least-once semantics (acks=all, retries=3)
- [ ] T061 Implement publish_event(event_type, event_data) method
- [ ] T062 Add error handling and retry logic for Kafka publishing
- [ ] T063 Create Kafka consumer wrapper in backend/src/services/kafka_consumer.py
- [ ] T064 Configure Kafka consumer with consumer group and offset management
- [ ] T065 Implement consume_events(topic, handler) method
- [ ] T066 Add idempotency check using event_id (UUID) to handle duplicate messages
- [ ] T067 Configure dead letter queue for failed message processing
- [ ] T068 Create event handler base class in backend/src/events/handlers.py
- [ ] T069 Implement TaskCreatedEventHandler
- [ ] T070 Implement TaskUpdatedEventHandler
- [ ] T071 Implement TaskCompletedEventHandler
- [ ] T072 Implement TaskDeletedEventHandler
- [ ] T073 Implement ReminderTriggeredEventHandler
- [ ] T074 Implement ActivityLogCreatedEventHandler
- [ ] T075 Write unit tests for event schemas
- [ ] T076 Write unit tests for event serialization/deserialization
- [ ] T077 Write integration tests for Kafka producer
- [ ] T078 Write integration tests for Kafka consumer
- [ ] T079 Test event publishing on task operations
- [ ] T080 Test event consumption with idempotency

## Phase 5: Dapr Client Wrappers

### Goal
Create Dapr SDK wrapper clients for Pub/Sub, State Management, Jobs API, Secrets Management, and Service Invocation.

### Independent Test Criteria
- Dapr Pub/Sub client can publish messages
- Dapr State client can save and retrieve state
- Dapr Jobs client can schedule and cancel jobs
- Dapr Secrets client can retrieve secrets
- Dapr Invocation client can call services

### Tasks

- [ ] T081 Create Dapr Pub/Sub client in backend/src/dapr/pubsub_client.py
- [ ] T082 Implement publish_message(topic, message) method
- [ ] T083 Add error handling and Dapr resiliency (retries)
- [ ] T084 Create Dapr State Management client in backend/src/dapr/state_client.py
- [ ] T085 Implement save_state(key, value) method
- [ ] T086 Implement get_state(key) method
- [ ] T087 Implement delete_state(key) method
- [ ] T088 Add TTL support for state expiration
- [ ] T089 Create Dapr Jobs API client in backend/src/dapr/jobs_client.py
- [ ] T090 Implement schedule_job(name, schedule, data) method
- [ ] T091 Implement cancel_job(name) method
- [ ] T092 Implement get_job(name) method
- [ ] T093 Create Dapr Secrets Management client in backend/src/dapr/secrets_client.py
- [ ] T094 Implement get_secret(secret_name, key) method
- [ ] T095 Create Dapr Service Invocation client in backend/src/dapr/invocation_client.py
- [ ] T096 Implement invoke_service(app_id, method, data) method
- [ ] T097 Add observability (tracing, metrics) to all Dapr clients
- [ ] T098 Write unit tests for Dapr Pub/Sub client
- [ ] T099 Write unit tests for Dapr State client
- [ ] T100 Write unit tests for Dapr Jobs client
- [ ] T101 Write unit tests for Dapr Secrets client
- [ ] T102 Write unit tests for Dapr Invocation client
- [ ] T103 Write integration tests for Dapr clients

## Phase 6: Backend Services

### Goal
Create business logic services for recurring tasks, reminders, tags, search, and activity logging.

### Independent Test Criteria
- All services implement required business logic
- Services integrate with database models
- Services publish events to Kafka
- Services handle errors gracefully
- Unit tests pass for all services

### Tasks

- [ ] T104 Create RecurringTaskService in backend/src/services/recurring_task_service.py
- [ ] T105 Implement calculate_next_occurrence(recurrence_pattern, current_date) method
- [ ] T106 Implement create_next_occurrence(parent_task) method
- [ ] T107 Implement skip_occurrence(task_id) method
- [ ] T108 Implement stop_recurrence(task_id) method
- [ ] T109 Create ReminderService in backend/src/services/reminder_service.py
- [ ] T110 Implement create_reminder(task_id, reminder_time) method
- [ ] T111 Implement update_reminder(reminder_id, new_time) method
- [ ] T112 Implement cancel_reminder(reminder_id) method
- [ ] T113 Implement schedule_reminder_job(reminder_id) using Dapr Jobs API
- [ ] T114 Implement cancel_reminder_job(reminder_id) using Dapr Jobs API
- [ ] T115 Implement trigger_reminder(reminder_id) method (called by Dapr Jobs API)
- [ ] T116 Create TagService in backend/src/services/tag_service.py
- [ ] T117 Implement create_tag(user_id, name, color) method
- [ ] T118 Implement update_tag(tag_id, name, color) method
- [ ] T119 Implement delete_tag(tag_id) method
- [ ] T120 Implement list_tags(user_id) method
- [ ] T121 Implement add_tag_to_task(task_id, tag_id) method
- [ ] T122 Implement remove_tag_from_task(task_id, tag_id) method
- [ ] T123 Create SearchService in backend/src/services/search_service.py
- [ ] T124 Implement search_tasks(user_id, keyword) method
- [ ] T125 Implement filter_tasks(user_id, filters) method (status, priority, due_date, tags)
- [ ] T126 Implement sort_tasks(user_id, sort_by, sort_order) method
- [ ] T127 Create ActivityLogService in backend/src/services/activity_log_service.py
- [ ] T128 Implement log_activity(user_id, task_id, action, old_values, new_values) method
- [ ] T129 Implement get_activity_logs(user_id, limit, offset) method
- [ ] T130 Publish activity-log-created event to Kafka on log
- [ ] T131 Update TaskService in backend/src/services/task_service.py with advanced features
- [ ] T132 Add due_datetime, priority, recurrence settings to create_task
- [ ] T133 Add support for tags in create_task
- [ ] T134 Add support for tags in update_task
- [ ] T135 Add support for recurrence settings in update_task
- [ ] T136 Add due_datetime, priority to list_tasks
- [ ] T137 Add search, filter, sort parameters to list_tasks
- [ ] T138 Publish task-created, task-updated, task-completed, task-deleted events
- [ ] T139 Write unit tests for RecurringTaskService
- [ ] T140 Write unit tests for ReminderService
- [ ] T141 Write unit tests for TagService
- [ ] T142 Write unit tests for SearchService
- [ ] T143 Write unit tests for ActivityLogService
- [ ] T144 Write unit tests for updated TaskService

## Phase 7: Backend API Routes

### Goal
Create API endpoints for advanced features (recurring tasks, reminders, tags, search, activity logs) and WebSocket endpoint for real-time updates.

### Independent Test Criteria
- All API endpoints work correctly
- Input validation is enforced
- Error responses are proper
- Events are published to Kafka
- WebSocket connections work

### Tasks

- [ ] T145 Create tag_router.py in backend/src/api/
- [ ] T146 Implement GET /api/{user_id}/tags endpoint
- [ ] T147 Implement POST /api/{user_id}/tags endpoint
- [ ] T148 Implement PUT /api/{user_id}/tags/{tag_id} endpoint
- [ ] T149 Implement DELETE /api/{user_id}/tags/{tag_id} endpoint
- [ ] T150 Create reminder_router.py in backend/src/api/
- [ ] T151 Implement POST /api/{user_id}/tasks/{task_id}/reminder endpoint
- [ ] T152 Implement PUT /api/{user_id}/tasks/{task_id}/reminder endpoint
- [ ] T153 Implement DELETE /api/{user_id}/tasks/{task_id}/reminder endpoint
- [ ] T154 Implement GET /api/{user_id}/reminders endpoint
- [ ] T155 Create search_router.py in backend/src/api/
- [ ] T156 Implement GET /api/{user_id}/tasks with search, filter, sort parameters
- [ ] T157 Create activity_router.py in backend/src/api/
- [ ] T158 Implement GET /api/{user_id}/activity-logs endpoint
- [ ] T159 Update task_router.py in backend/src/api/ with new endpoints
- [ ] T160 Add POST /api/{user_id}/tasks/{task_id}/skip-occurrence endpoint
- [ ] T161 Update POST /api/{user_id}/tasks to support recurrence and tags
- [ ] T162 Update PUT /api/{user_id}/tasks/{task_id} to support recurrence and tags
- [ ] T163 Update PATCH /api/{user_id}/tasks/{task_id}/complete to trigger next occurrence creation
- [ ] T164 Update DELETE /api/{user_id}/tasks/{task_id} to cancel reminders
- [ ] T165 Create websocket_router.py in backend/src/api/
- [ ] T166 Implement WebSocket endpoint WS /api/ws/{user_id}
- [ ] T167 Implement subscribe action for WebSocket clients
- [ ] T168 Implement unsubscribe action for WebSocket clients
- [ ] T169 Create websocket_manager.py in backend/src/realtime/
- [ ] T170 Implement WebSocketConnectionManager class
- [ ] T171 Implement broadcast_message(user_id, message) method
- [ ] T172 Implement handle_client_message(websocket, user_id) method
- [ ] T173 Add authentication to WebSocket connections (JWT token in query string)
- [ ] T174 Add error handling and connection cleanup
- [ ] T175 Integrate WebSocket with Kafka consumer for real-time updates
- [ ] T176 Publish task-updates to Kafka for WebSocket clients
- [ ] T177 Create Dapr invocation wrapper for frontend-backend communication (optional)
- [ ] T178 Write unit tests for tag_router
- [ ] T179 Write unit tests for reminder_router
- [ ] T180 Write unit tests for search_router
- [ ] T181 Write unit tests for activity_router
- [ ] T182 Write integration tests for WebSocket endpoint
- [ ] T183 Write integration tests for updated task_router

## Phase 8: MCP Tool Additions

### Goal
Add new MCP tools for recurring tasks, reminders, priorities, tags, search, and activity logs.

### Independent Test Criteria
- All new MCP tools work correctly
- Tool parameters are validated
- Tools return proper responses
- Tools integrate with backend services
- MCP server updates are backward compatible

### Tasks

- [ ] T184 Add set_task_recurrence tool to backend/src/mcp/mcp_server.py
- [ ] T185 Add skip_task_occurrence tool to backend/src/mcp/mcp_server.py
- [ ] T186 Add set_task_due_date tool to backend/src/mcp/mcp_server.py
- [ ] T187 Add create_reminder tool to backend/src/mcp/mcp_server.py
- [ ] T188 Add list_reminders tool to backend/src/mcp/mcp_server.py
- [ ] T189 Add set_task_priority tool to backend/src/mcp/mcp_server.py
- [ ] T190 Add add_tag_to_task tool to backend/src/mcp/mcp_server.py
- [ ] T191 Add remove_tag_from_task tool to backend/src/mcp/mcp_server.py
- [ ] T192 Add list_tags tool to backend/src/mcp/mcp_server.py
- [ ] T193 Add search_tasks tool to backend/src/mcp/mcp_server.py
- [ ] T194 Add get_activity_logs tool to backend/src/mcp/mcp_server.py
- [ ] T195 Define Pydantic models for all new tool parameters
- [ ] T196 Implement tool logic using backend services
- [ ] T197 Add error handling for all tools
- [ ] T198 Update MCP server documentation with new tools
- [ ] T199 Write unit tests for all new MCP tools
- [ ] T200 Test MCP tools via AI chatbot interface

## Phase 9: Frontend Components

### Goal
Create frontend components for advanced features (recurring tasks, due dates, reminders, priorities, tags, search/filter/sort).

### Independent Test Criteria
- All components render correctly
- Components integrate with API services
- User interactions work as expected
- Components display data properly
- Components are responsive

### Tasks

- [ ] T201 Create DueDatePicker component in frontend/src/components/DueDatePicker.tsx
- [ ] T202 Add date and time input fields
- [ ] T203 Add validation for past dates
- [ ] T204 Add timezone conversion
- [ ] T205 Create ReminderPicker component in frontend/src/components/ReminderPicker.tsx
- [ ] T206 Add reminder time options (15min, 30min, 1hr, 1day, 1week before due)
- [ ] T207 Add custom reminder time input
- [ ] T208 Create PriorityBadge component in frontend/src/components/PriorityBadge.tsx
- [ ] T209 Add color coding (High=red, Medium=yellow, Low=green)
- [ ] T210 Add priority selector in TaskForm
- [ ] T211 Create RecurringTaskForm component in frontend/src/components/RecurringTaskForm.tsx
- [ ] T212 Add recurrence pattern selector (daily, weekly, monthly, none)
- [ ] T213 Add recurrence end date picker
- [ ] T214 Add recurrence preview (next occurrence dates)
- [ ] T215 Create TagSelector component in frontend/src/components/TagSelector.tsx
- [ ] T216 Add tag list display with colors
- [ ] T217 Add tag creation UI
- [ ] T218 Add tag selection multi-select
- [ ] T219 Create SearchBar component in frontend/src/components/SearchBar.tsx
- [ ] T220 Add keyword input field
- [ ] T221 Add search button
- [ ] T222 Add debounced search
- [ ] T223 Create FilterPanel component in frontend/src/components/FilterPanel.tsx
- [ ] T224 Add status filter (all, pending, completed)
- [ ] T225 Add priority filter (High, Medium, Low)
- [ ] T226 Add due date range filter
- [ ] T227 Add tag filter
- [ ] T228 Create SortDropdown component in frontend/src/components/SortDropdown.tsx
- [ ] T229 Add sort options (due date, priority, created date, alphabetical)
- [ ] T230 Add sort order toggle (ascending/descending)
- [ ] T231 Update TaskForm component to include DueDatePicker
- [ ] T232 Update TaskForm component to include PriorityBadge selector
- [ ] T233 Update TaskForm component to include RecurringTaskForm
- [ ] T234 Update TaskForm component to include TagSelector
- [ ] T235 Update TaskForm component to include ReminderPicker
- [ ] T236 Update TaskItem component to display due date
- [ ] T237 Update TaskItem component to display priority badge
- [ ] T238 Update TaskItem component to display tags
- [ ] T239 Update TaskItem component to display recurrence indicator
- [ ] T240 Update TaskItem component to display reminder indicator
- [ ] T241 Update TaskList component to include SearchBar
- [ ] T242 Update TaskList component to include FilterPanel
- [ ] T243 Update TaskList component to include SortDropdown
- [ ] T244 Update TaskList component to display filtered/sorted results
- [ ] T245 Add visual indicators for overdue tasks
- [ ] T246 Add visual indicators for upcoming tasks
- [ ] T247 Create ActivityFeed component in frontend/src/components/ActivityFeed.tsx
- [ ] T248 Display activity log entries with timestamps
- [ ] T249 Create Activity page in frontend/src/pages/activity.tsx
- [ ] T250 Write unit tests for DueDatePicker
- [ ] T251 Write unit tests for ReminderPicker
- [ ] T252 Write unit tests for PriorityBadge
- [ ] T253 Write unit tests for RecurringTaskForm
- [ ] T254 Write unit tests for TagSelector
- [ ] T255 Write unit tests for SearchBar
- [ ] T256 Write unit tests for FilterPanel
- [ ] T257 Write unit tests for SortDropdown
- [ ] T258 Write integration tests for updated TaskForm
- [ ] T259 Write integration tests for updated TaskList

## Phase 10: Frontend Services and Real-Time

### Goal
Update frontend API services and implement WebSocket client for real-time updates.

### Independent Test Criteria
- API services call new endpoints correctly
- WebSocket client connects and receives updates
- Real-time updates are applied to UI
- Error handling is proper
- Reconnection logic works

### Tasks

- [ ] T260 Update frontend/src/services/api.ts with new endpoints
- [ ] T261 Add setTaskDueDate method
- [ ] T262 Add createReminder method
- [ ] T263 Add updateReminder method
- [ ] T264 Add deleteReminder method
- [ ] T265 Add listReminders method
- [ ] T266 Add setTaskPriority method
- [ ] T267 Add createTag method
- [ ] T268 Add updateTag method
- [ ] T269 Add deleteTag method
- [ ] T270 Add listTags method
- [ ] T271 Add addTagToTask method
- [ ] T272 Add removeTagFromTask method
- [ ] T273 Add searchTasks method with filters and sort
- [ ] T274 Add getActivityLogs method
- [ ] T275 Add setTaskRecurrence method
- [ ] T276 Add skipTaskOccurrence method
- [ ] T277 Update getTasks method to support search, filter, sort parameters
- [ ] T278 Create WebSocket client in frontend/src/services/websocket.ts
- [ ] T279 Implement connect(user_id) method
- [ ] T280 Implement subscribe(channels) method
- [ ] T281 Implement unsubscribe(channels) method
- [ ] T282 Implement disconnect() method
- [ ] T283 Add event listeners for task-updates
- [ ] T284 Add event listeners for reminders
- [ ] T285 Implement automatic reconnection with exponential backoff
- [ ] T286 Implement event replay on reconnection
- [ ] T287 Add error handling for WebSocket errors
- [ ] T288 Create useRealtimeUpdates hook in frontend/src/hooks/useRealtimeUpdates.ts
- [ ] T289 Use hook in TaskList component for real-time updates
- [ ] T290 Update task state when real-time events received
- [ ] T291 Show toast notifications for reminders
- [ ] T292 Create useTaskFilters hook in frontend/src/hooks/useTaskFilters.ts
- [ ] T293 Manage search, filter, sort state in hook
- [ ] T294 Write unit tests for updated API services
- [ ] T295 Write unit tests for WebSocket client
- [ ] T296 Write unit tests for useRealtimeUpdates hook
- [ ] T297 Write unit tests for useTaskFilters hook
- [ ] T298 Write integration tests for real-time updates
- [ ] T299 Test WebSocket reconnection and event replay

## Phase 11: Event Flow Integration

### Goal
Integrate event publishing and consumption across all services to enable event-driven architecture.

### Independent Test Criteria
- Task operations publish events to Kafka
- Events are consumed by activity log service
- Events are consumed by real-time sync service
- Reminder events are triggered by Dapr Jobs API
- Event flow is end-to-end tested

### Tasks

- [ ] T300 Integrate Kafka producer in TaskService
- [ ] T301 Publish task-created event on create_task
- [ ] T302 Publish task-updated event on update_task
- [ ] T303 Publish task-completed event on complete_task
- [ ] T304 Publish task-deleted event on delete_task
- [ ] T305 Integrate activity logging in TaskService
- [ ] T306 Log activity on create_task
- [ ] T307 Log activity on update_task
- [ ] T308 Log activity on complete_task
- [ ] T309 Log activity on delete_task
- [ ] T310 Publish activity-log-created event
- [ ] T311 Integrate reminder scheduling in TaskService
- [ ] T312 Schedule reminder job on create_reminder
- [ ] T313 Update reminder job on update_reminder
- [ ] T314 Cancel reminder job on delete_reminder
- [ ] T315 Cancel reminder job on task deletion
- [ ] T316 Create reminder trigger endpoint (called by Dapr Jobs API)
- [ ] T317 Publish reminder-triggered event when reminder fires
- [ ] T318 Create activity log consumer service
- [ ] T319 Subscribe to task-events topic
- [ ] T320 Process events and create activity log entries
- [ ] T321 Implement idempotency check using event_id
- [ ] T322 Create real-time sync consumer service
- [ ] T323 Subscribe to task-updates topic
- [ ] T324 Process events and broadcast to WebSocket clients
- [ ] T325 Implement user-specific filtering for WebSocket broadcasts
- [ ] T326 Create reminder notification consumer service
- [ ] T327 Subscribe to reminders topic
- [ ] T328 Process events and send notifications via WebSocket
- [ ] T329 Integrate recurring task creation in TaskService
- [ ] T330 Create next occurrence on complete_task if recurring
- [ ] T331 Publish task-created event for new occurrence
- [ ] T332 Write end-to-end test for task-created event flow
- [ ] T333 Write end-to-end test for task-updated event flow
- [ ] T334 Write end-to-end test for task-completed event flow
- [ ] T335 Write end-to-end test for reminder trigger flow
- [ ] T336 Write end-to-end test for recurring task creation flow
- [ ] T337 Write end-to-end test for real-time sync flow

## Phase 12: Testing and Quality Assurance

### Goal
Comprehensive testing (unit, integration, performance, security) and quality assurance for all Phase V features.

### Independent Test Criteria
- All unit tests pass (>80% coverage)
- All integration tests pass
- Performance tests meet targets
- Security tests pass
- Code quality standards met

### Tasks

- [ ] T338 Run unit tests for backend services (pytest)
- [ ] T339 Run unit tests for frontend components (Jest/Vitest)
- [ ] T340 Generate coverage report for backend
- [ ] T341 Generate coverage report for frontend
- [ ] T342 Run integration tests for Kafka producer/consumer
- [ ] T343 Run integration tests for Dapr components
- [ ] T344 Run integration tests for database operations
- [ ] T345 Run integration tests for WebSocket
- [ ] T346 Run end-to-end tests for user story 1 (recurring tasks)
- [ ] T347 Run end-to-end tests for user story 2 (due dates and reminders)
- [ ] T348 Run end-to-end tests for user story 3 (priorities and tags)
- [ ] T349 Run end-to-end tests for user story 4 (search and filter)
- [ ] T350 Run end-to-end tests for user story 5 (sorting)
- [ ] T351 Run end-to-end tests for user story 6 (event-driven operations)
- [ ] T352 Run end-to-end tests for user story 7 (real-time sync)
- [ ] T353 Run end-to-end tests for user story 8 (Dapr state management)
- [ ] T354 Run end-to-end tests for user story 9 (Dapr Jobs API)
- [ ] T355 Run end-to-end tests for user story 10 (Dapr secrets management)
- [ ] T356 Run performance tests (load test: 1000 concurrent users)
- [ ] T357 Run stress tests (5000 concurrent users)
- [ ] T358 Run soak tests (24 hours at 50% capacity)
- [ ] T359 Measure task operation latency (target: 200ms p95)
- [ ] T360 Measure search/filter latency (target: 500ms p95)
- [ ] T361 Measure real-time update latency (target: 1s)
- [ ] T362 Measure Kafka throughput (target: 1000 events/sec)
- [ ] T363 Measure Kafka consumer lag
- [ ] T364 Run security tests (OWASP Top 10)
- [ ] T365 Test for secret leakage (check logs, environment variables)
- [ ] T366 Test cross-user data isolation
- [ ] T367 Test SQL injection prevention
- [ ] T368 Test XSS prevention
- [ ] T369 Test CSRF protection
- [ ] T370 Test rate limiting
- [ ] T371 Run dependency vulnerability scan
- [ ] T372 Run code quality checks (linting)
- [ ] T373 Run type checking (mypy for Python, tsc for TypeScript)
- [ ] T374 Fix all critical and high-severity issues
- [ ] T375 Generate test report

## Phase 13: Deployment and Documentation

### Goal
Deploy Phase V to Minikube, create deployment scripts, and complete documentation.

### Independent Test Criteria
- Deployment is successful
- All services are running
- Health checks pass
- Smoke tests pass
- Documentation is complete

### Tasks

- [ ] T376 Build Docker images for backend with Dapr sidecar
- [ ] T377 Build Docker images for frontend
- [ ] T378 Push Docker images to local registry
- [ ] T379 Update Helm chart values.yaml for Phase V
- [ ] T380 Add Kafka deployment to Helm chart
- [ ] T381 Add Dapr components to Helm chart
- [ ] T382 Update backend deployment with Dapr annotations
- [ ] T383 Update backend environment variables for Dapr
- [ ] T384 Update frontend deployment for WebSocket support
- [ ] T385 Run database migrations (005_add_advanced_features)
- [ ] T386 Deploy Phase V via Helm: helm upgrade --install todo-app ./helm-charts/todo-advanced
- [ ] T387 Verify Kafka pods are running
- [ ] T388 Verify Dapr sidecars are injected
- [ ] T389 Verify Dapr components are configured
- [ ] T390 Verify backend pods are running
- [ ] T391 Verify frontend pods are running
- [ ] T392 Run smoke tests (create task, verify Kafka event)
- [ ] T393 Test recurring task creation
- [ ] T394 Test reminder scheduling and triggering
- [ ] T395 Test real-time updates via WebSocket
- [ ] T396 Verify health checks for all services
- [ ] T397 Monitor metrics and logs for 15 minutes
- [ ] T398 Create deployment script (scripts/deploy-phase5.sh)
- [ ] T399 Update API documentation (Swagger/OpenAPI) with new endpoints
- [ ] T400 Document event schemas in specs/phase-5/event-schemas/
- [ ] T401 Document Dapr components in specs/phase-5/dapr-components/
- [ ] T402 Create architecture diagram (specs/phase-5/diagrams/architecture.png)
- [ ] T403 Create event flow diagram (specs/phase-5/diagrams/event-flow.png)
- [ ] T404 Create Kafka topics diagram (specs/phase-5/diagrams/kafka-topics.png)
- [ ] T405 Update README.md with Phase V features
- [ ] T406 Update CLAUDE.md with Phase V context
- [ ] T407 Create user guide for advanced features
- [ ] T408 Create deployment guide for Phase V
- [ ] T409 Create troubleshooting guide for common issues
- [ ] T410 Create runbooks for operational tasks (as specified in plan.md)
- [ ] T411 Create ADRs for significant architectural decisions (as suggested in plan.md)
- [ ] T412 Document rollback procedure
- [ ] T413 Final review and sign-off

## Dependencies

### User Story Completion Order
1. Phase 1 (Infrastructure Setup) must complete before any other phase
2. Phase 2 (Database Migrations) must complete before Phase 3 (Data Models)
3. Phase 3 (Data Models) must complete before Phase 6 (Backend Services)
4. Phase 4 (Kafka Event Infrastructure) must complete before Phase 11 (Event Flow Integration)
5. Phase 5 (Dapr Client Wrappers) must complete before Phase 6 (Backend Services)
6. Phase 6 (Backend Services) must complete before Phase 7 (Backend API Routes)
7. Phase 7 (Backend API Routes) must complete before Phase 9 (Frontend Components)
8. Phase 8 (MCP Tool Additions) can run in parallel with Phase 7
9. Phase 9 (Frontend Components) and Phase 10 (Frontend Services) can run in parallel
10. Phase 11 (Event Flow Integration) depends on Phase 4, 5, 6, 7 completion
11. Phase 12 (Testing) runs after all implementation phases complete
12. Phase 13 (Deployment) is the final phase

### Parallel Execution Examples

### By Layer
- Infrastructure: T001-T015 (Kafka, Dapr setup)
- Backend: T016-T311 (models, services, APIs)
- Frontend: T201-T299 (components, services, real-time)
- Integration: T300-T337 (event flow)
- Testing: T338-T375 (unit, integration, performance, security)
- Deployment: T376-T413 (build, deploy, document)

### By Feature
- Recurring Tasks: T104-T108, T145, T160-T163, T184-T185, T201-T214, T234-T236, T275-T276, T329-T331, T346
- Due Dates & Reminders: T109-T116, T151-T154, T164, T186-T188, T201-T208, T246, T261-T265, T312-T318, T347, T351
- Priorities & Tags: T117-T122, T145-T149, T189-T192, T208-T218, T237-T238, T266-T274, T348
- Search & Filter: T123-T126, T155-T156, T193, T221-T230, T241-T244, T292-T294, T349
- Sorting: T127, T156, T230-T231, T243, T350
- Event-Driven Operations: T055-T080, T300-T311, T332-T336
- Real-Time Sync: T165-T177, T279-T299, T337, T352
- Dapr Integration: T081-T103, T312-T318, T353-T355

## Implementation Strategy

### MVP First Approach
1. Complete Phase 1 (Infrastructure Setup) - Kafka and Dapr ready
2. Complete Phase 2 (Database Migrations) - Schema updated
3. Complete Phase 3 (Data Models) - Models defined
4. Complete Phase 4 (Kafka Event Infrastructure) - Event publishing/consumption ready
5. Complete Phase 5 (Dapr Client Wrappers) - Dapr integration ready
6. Complete Phase 6 (Backend Services) - Business logic implemented
7. Complete Phase 7 (Backend API Routes) - API endpoints ready
8. Complete Phase 9 (Frontend Components) - UI components ready
9. Complete Phase 10 (Frontend Services) - Frontend integration ready
10. Complete Phase 11 (Event Flow Integration) - End-to-end event flow working
11. Complete Phase 8 (MCP Tool Additions) - AI chatbot enhanced
12. Complete Phase 12 (Testing) - Quality assured
13. Complete Phase 13 (Deployment) - Deployed to Minikube

### Incremental Delivery
- After Phase 1: Kafka and Dapr infrastructure ready
- After Phase 2: Database schema updated
- After Phase 3: Data models ready
- After Phase 4-5: Event-driven infrastructure ready
- After Phase 6-7: Backend APIs with advanced features ready
- After Phase 9-10: Frontend UI with advanced features ready
- After Phase 11: End-to-end event-driven architecture working
- After Phase 8: MCP tools for AI chatbot ready
- After Phase 12: Fully tested and quality-assured
- After Phase 13: Deployed and documented, ready for production

### Risk Mitigation
- Start with Phase 1 early to identify infrastructure issues
- Test database migrations thoroughly in staging
- Test Kafka and Dapr integration early with simple examples
- Implement feature flags to enable/disable advanced features
- Plan rollback strategy for each major phase
- Monitor metrics and logs continuously during testing
- Have runbooks ready for common operational issues

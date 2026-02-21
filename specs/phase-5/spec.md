# Feature Specification: Phase V - Event-Driven Advanced Features

**Feature Branch**: `phase-5`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: "Phase V: Event-Driven Advanced Features with Kafka and Dapr Integration"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recurring Tasks Management (Priority: P1)

As a user, I want to set tasks that repeat automatically (daily, weekly, monthly), so that I don't have to manually recreate routine tasks every time they occur.

**Why this priority**: This is a high-value productivity feature that significantly enhances task management efficiency for users with recurring responsibilities.

**Independent Test**: Can be fully tested by creating a recurring task, completing it, and verifying that the next occurrence is automatically created while delivering the value of automated task management.

**Acceptance Scenarios**:

1. **Given** I am logged into the application, **When** I create a new task with recurrence pattern (daily/weekly/monthly), **Then** the task is saved with recurrence settings and the next occurrence date is calculated
2. **Given** I have a recurring task with daily recurrence, **When** I mark the current occurrence as complete, **Then** a new task instance is automatically created with the next due date
3. **Given** I have a recurring task with weekly recurrence, **When** I complete the current occurrence, **Then** the next occurrence is scheduled exactly 7 days from the completed task's due date
4. **Given** I have a recurring task with monthly recurrence, **When** I complete the current occurrence, **Then** the next occurrence is scheduled on the same day of the next month

---

### User Story 2 - Due Dates and Time Reminders (Priority: P1)

As a user, I want to set due dates and times for my tasks and receive reminders before they are due, so that I can stay on top of deadlines and avoid missing important tasks.

**Why this priority**: This is a critical productivity feature that helps users manage time-sensitive tasks effectively.

**Independent Test**: Can be fully tested by setting a due date, creating a reminder, and verifying that notifications are sent at the specified time while delivering the value of timely task reminders.

**Acceptance Scenarios**:

1. **Given** I am logged into the application, **When** I create a task with a due date and time, **Then** the due datetime is persisted and displayed in the task list
2. **Given** I have a task with a due date, **When** I set a reminder for 1 hour before the due time, **Then** the reminder is scheduled and I receive a notification at the specified time
3. **Given** I have multiple tasks with different due dates, **When** I view my task list, **Then** tasks are visually sorted and grouped by due date urgency
4. **Given** I have a task that is past its due date, **When** I view the task list, **Then** the task is marked as overdue with a visual indicator

---

### User Story 3 - Task Priorities and Tags/Categories (Priority: P2)

As a user, I want to assign priorities (High, Medium, Low) and tags/categories to my tasks, so that I can organize and prioritize my work more effectively.

**Why this priority**: This provides essential organization and prioritization capabilities that enhance task management beyond basic CRUD operations.

**Independent Test**: Can be fully tested by creating tasks with different priorities and tags, then filtering and sorting by these attributes while delivering the value of task organization.

**Acceptance Scenarios**:

1. **Given** I am logged into the application, **When** I create a task with a priority level (High/Medium/Low), **Then** the priority is saved and displayed with appropriate visual indicators (colors, icons)
2. **Given** I have tasks with different priorities, **When** I sort my task list by priority, **Then** tasks are ordered with High priority tasks at the top
3. **Given** I am creating or editing a task, **When** I add tags/categories to the task, **Then** the tags are saved and displayed in the task details
4. **Given** I have multiple tasks with various tags, **When** I filter by a specific tag, **Then** only tasks with that tag are displayed

---

### User Story 4 - Advanced Search and Filter (Priority: P2)

As a user, I want to search for tasks by keyword and filter by status, priority, due date, and tags, so that I can quickly find relevant tasks in my task list.

**Why this priority**: This significantly improves usability for users with large task lists, enabling efficient task discovery and management.

**Independent Test**: Can be fully tested by creating multiple tasks with different attributes, then applying various search and filter combinations while delivering the value of efficient task finding.

**Acceptance Scenarios**:

1. **Given** I have multiple tasks in my list, **When** I enter a search keyword, **Then** only tasks matching the keyword in title or description are displayed
2. **Given** I have tasks with various statuses, **When** I filter by "completed" status, **Then** only completed tasks are displayed
3. **Given** I have tasks with different priorities, **When** I filter by "High" priority, **Then** only high-priority tasks are displayed
4. **Given** I have tasks with various due dates, **When** I filter by a date range, **Then** only tasks with due dates within that range are displayed
5. **Given** I have applied multiple filters (status, priority, tags), **When** I perform a search, **Then** the results match all applied filter criteria

---

### User Story 5 - Task Sorting (Priority: P2)

As a user, I want to sort my tasks by due date, priority, creation date, or alphabetically, so that I can view my tasks in the most relevant order for my current needs.

**Why this priority**: This provides flexibility in task organization, allowing users to view tasks in the order that best suits their workflow.

**Independent Test**: Can be fully tested by creating multiple tasks with different attributes, then applying various sort options while delivering the value of flexible task viewing.

**Acceptance Scenarios**:

1. **Given** I have multiple tasks with different due dates, **When** I sort by due date, **Then** tasks are ordered with the earliest due dates first
2. **Given** I have tasks with different priorities, **When** I sort by priority, **Then** tasks are ordered High > Medium > Low
3. **Given** I have tasks created at different times, **When** I sort by creation date, **Then** tasks are ordered by their creation timestamps
4. **Given** I have tasks with different titles, **When** I sort alphabetically, **Then** tasks are ordered A-Z by title

---

### User Story 6 - Event-Driven Task Operations (Priority: P1)

As a system, I want all task operations to publish events to Kafka for consumption by other services, so that the system maintains an event-driven architecture for scalability and decoupling.

**Why this priority**: This is the foundational architecture for Phase V, enabling all advanced features to work in a distributed, scalable manner.

**Independent Test**: Can be fully tested by performing task operations and verifying that events are published to Kafka topics with correct schemas while delivering the value of event-driven communication.

**Acceptance Scenarios**:

1. **Given** I create a new task, **When** the operation completes, **Then** a "task-created" event is published to the "task-events" Kafka topic with complete task data
2. **Given** I update a task, **When** the operation completes, **Then** a "task-updated" event is published to the "task-events" Kafka topic with changed fields
3. **Given** I complete a task, **When** the operation completes, **Then** a "task-completed" event is published to the "task-events" Kafka topic
4. **Given** I delete a task, **When** the operation completes, **Then** a "task-deleted" event is published to the "task-events" Kafka topic
5. **Given** an event is published, **When** a consumer processes the event, **Then** the event schema is validated and the consumer handles it idempotently

---

### User Story 7 - Real-Time Client Synchronization (Priority: P1)

As a user with multiple browser tabs or devices open, I want to see task changes in real-time across all my views, so that I always have the latest task state without manual refresh.

**Why this priority**: This provides a modern, responsive user experience that is expected in contemporary web applications.

**Independent Test**: Can be fully tested by having multiple browser tabs open, making a change in one tab, and verifying the change appears in other tabs automatically while delivering the value of real-time synchronization.

**Acceptance Scenarios**:

1. **Given** I have the task list open in two browser tabs, **When** I create a task in tab 1, **Then** the new task appears in tab 2 without manual refresh
2. **Given** I have the task list open in two browser tabs, **When** I complete a task in tab 1, **Then** the task status updates in tab 2 automatically
3. **Given** I receive a reminder notification, **When** I click on the notification, **Then** I am navigated to the relevant task details
4. **Given** the WebSocket connection is interrupted, **When** it reconnects, **Then** any missed updates are fetched and applied

---

### User Story 8 - Dapr State Management for Conversation State (Priority: P2)

As the AI chatbot system, I want to use Dapr State Management to store conversation state, so that AI conversations can be maintained across service restarts and multiple instances.

**Why this priority**: This improves the AI chatbot reliability and scalability by providing persistent, distributed state management.

**Independent Test**: Can be fully tested by having a conversation, restarting the backend service, and verifying that conversation history is preserved while delivering the value of state persistence.

**Acceptance Scenarios**:

1. **Given** I am having a conversation with the AI chatbot, **When** the conversation state is saved via Dapr State Management, **Then** the state is persisted in the Dapr state store
2. **Given** I have a saved conversation state, **When** I restart the backend service, **Then** the conversation history is restored from Dapr state store
3. **Given** multiple backend instances are running, **When** I continue a conversation, **Then** any instance can retrieve and update the conversation state consistently
4. **Given** the Dapr state store becomes temporarily unavailable, **When** a state operation is attempted, **Then** the system handles the error gracefully with retry logic

---

### User Story 9 - Dapr Jobs API for Scheduled Reminders (Priority: P1)

As the reminder system, I want to use Dapr Jobs API to schedule exact-time reminders, so that reminders are triggered reliably even if the service restarts.

**Why this priority**: This provides reliable, distributed job scheduling that is more robust than in-memory or cron-based solutions.

**Independent Test**: Can be fully tested by creating a reminder for a specific future time, waiting for the time to arrive, and verifying that the reminder is triggered correctly while delivering the value of reliable scheduling.

**Acceptance Scenarios**:

1. **Given** I create a task with a due date and set a reminder for 30 minutes before, **When** the reminder time arrives, **Then** a reminder event is published to the "reminders" Kafka topic
2. **Given** a reminder job is scheduled, **When** the backend service restarts before the reminder time, **Then** the reminder is still triggered at the correct time
3. **Given** I edit a task's due date, **When** the due date changes, **Then** the associated reminder job is updated or rescheduled accordingly
4. **Given** I delete a task with an active reminder, **When** the task is deleted, **Then** the reminder job is cancelled and not triggered

---

### User Story 10 - Dapr Secrets Management (Priority: P1)

As the system administrator, I want to use Dapr Secrets Management to store sensitive configuration (API keys, database credentials, Kafka credentials), so that secrets are not hardcoded and can be managed securely.

**Why this priority**: This is a critical security requirement that prevents secrets leakage and enables proper secret management.

**Independent Test**: Can be fully tested by configuring secrets in Dapr, starting services, and verifying they access secrets correctly without hardcoding while delivering the value of secure secret management.

**Acceptance Scenarios**:

1. **Given** secrets are configured in Dapr (OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS), **When** the backend service starts, **Then** it retrieves secrets from Dapr Secrets Management
2. **Given** secrets are managed via Dapr, **When** a secret value is updated, **When** the service is restarted, **Then** it uses the updated secret value
3. **Given** secrets are stored in Dapr, **When** I inspect the service configuration, **Then** secrets are not visible in environment variables or configuration files
4. **Given** the Dapr sidecar is configured with a secret store, **When** a service requests a secret, **Then** the secret is fetched securely from the configured store

---

### User Story 11 - Dapr Service Invocation (Priority: P2)

As the frontend application, I want to call backend services via Dapr Service Invocation, so that service communication is resilient with built-in retries and observability.

**Why this priority**: This improves system resilience and observability for service-to-service communication.

**Independent Test**: Can be fully tested by making API calls through Dapr Service Invocation, simulating network failures, and verifying retry behavior while delivering the value of resilient communication.

**Acceptance Scenarios**:

1. **Given** the frontend calls backend via Dapr Service Invocation, **When** the request is successful, **Then** the response is returned with proper observability traces
2. **Given** the backend service is temporarily unavailable, **When** the frontend makes a request via Dapr, **Then** Dapr retries the request with exponential backoff
3. **Given** a request via Dapr Service Invocation fails after all retries, **When** the failure occurs, **Then** an appropriate error is returned to the frontend
4. **Given** multiple requests are made via Dapr, **When** they are executed, **Then** distributed tracing shows the request flow across services

---

## Edge Cases

- What happens when a recurring task is deleted after some occurrences have been completed?
- How does the system handle time zone conversions for due dates and reminders?
- What occurs when a reminder time is in the past when created?
- How does the system handle concurrent modifications to the same task?
- What happens when the Kafka broker is temporarily unavailable?
- How does the system handle duplicate events in Kafka (at-least-once semantics)?
- What occurs when a Dapr state store becomes unavailable?
- How does the system handle reminder scheduling for tasks with due dates that have already passed?
- What happens when a user has more than the maximum number of allowed tags?
- How does the system handle search queries with special characters or SQL injection attempts?

## Requirements *(mandatory)*

### Functional Requirements

**Recurring Tasks (FR-101 to FR-108)**
- **FR-101**: System MUST allow users to set recurrence pattern (daily, weekly, monthly) when creating tasks
- **FR-102**: System MUST calculate and store the next occurrence date for recurring tasks
- **FR-103**: System MUST automatically create a new task instance when a recurring task is completed
- **FR-104**: System MUST support editing recurrence settings of existing tasks
- **FR-105**: System MUST stop creating new occurrences when a recurring task is deleted or marked as non-recurring
- **FR-106**: System MUST track the parent-child relationship between recurring task instances
- **FR-107**: System MUST display recurrence pattern and next occurrence date in task details
- **FR-108**: System MUST allow users to skip a specific occurrence without stopping recurrence

**Due Dates & Reminders (FR-109 to FR-118)**
- **FR-109**: System MUST allow users to set due date and time for tasks
- **FR-110**: System MUST validate that due date/time is not in the past when set
- **FR-111**: System MUST allow users to set reminder times relative to due date (15min, 30min, 1hr, 1day, 1week)
- **FR-112**: System MUST use Dapr Jobs API to schedule reminder jobs
- **FR-113**: System MUST publish reminder events to Kafka when reminder time arrives
- **FR-114**: System MUST send reminder notifications to users via WebSocket/SSE
- **FR-115**: System MUST update or cancel reminder jobs when task due date changes
- **FR-116**: System MUST cancel reminder jobs when task is deleted or completed
- **FR-117**: System MUST display due date with visual indicators for upcoming, today, and overdue tasks
- **FR-118**: System MUST support time zone conversion for due dates and reminders

**Priorities & Tags (FR-119 to FR-126)**
- **FR-119**: System MUST allow users to assign priority levels (High, Medium, Low) to tasks
- **FR-120**: System MUST display priority with visual indicators (colors: red, yellow, green)
- **FR-121**: System MUST allow users to add multiple tags to a task
- **FR-122**: System MUST validate tag names (1-50 characters, alphanumeric and spaces)
- **FR-123**: System MUST store tags in a separate table with many-to-many relationship to tasks
- **FR-124**: System MUST allow users to filter tasks by tags
- **FR-125**: System MUST display all tags associated with a task in task details
- **FR-126**: System MUST allow users to remove tags from tasks

**Search & Filter (FR-127 to FR-133)**
- **FR-127**: System MUST allow users to search tasks by keyword in title and description
- **FR-128**: System MUST allow users to filter tasks by status (all, pending, completed)
- **FR-129**: System MUST allow users to filter tasks by priority (High, Medium, Low)
- **FR-130**: System MUST allow users to filter tasks by due date range
- **FR-131**: System MUST allow users to filter tasks by tags
- **FR-132**: System MUST support combining multiple filters with AND logic
- **FR-133**: System MUST display the number of filtered results

**Task Sorting (FR-134 to FR-137)**
- **FR-134**: System MUST allow users to sort tasks by due date (ascending or descending)
- **FR-135**: System MUST allow users to sort tasks by priority (High > Medium > Low)
- **FR-136**: System MUST allow users to sort tasks by creation date (newest or oldest first)
- **FR-137**: System MUST allow users to sort tasks alphabetically by title (A-Z or Z-A)

**Kafka Integration (FR-138 to FR-145)**
- **FR-138**: System MUST publish events to Kafka for all task operations (create, update, complete, delete)
- **FR-139**: System MUST define and validate event schemas for all Kafka events
- **FR-140**: System MUST configure Kafka topics: task-events, reminders, task-updates
- **FR-141**: System MUST use at-least-once delivery semantics for Kafka events
- **FR-142**: System MUST implement idempotent consumers to handle duplicate messages
- **FR-143**: System MUST configure appropriate partition counts for Kafka topics
- **FR-144**: System MUST handle Kafka broker failures with retry logic
- **FR-145**: System MUST provide dead letter queue for failed message processing

**Dapr Integration (FR-146 to FR-155)**
- **FR-146**: System MUST use Dapr Pub/Sub for publishing task events to Kafka
- **FR-147**: System MUST use Dapr State Management for storing conversation state
- **FR-148**: System MUST use Dapr Jobs API for scheduling reminder jobs
- **FR-149**: System MUST use Dapr Secrets Management for OPENAI_API_KEY, DATABASE_URL, KAFKA_CREDENTIALS
- **FR-150**: System MUST support frontend calling backend via Dapr Service Invocation
- **FR-151**: System MUST configure Dapr components in Kubernetes (Pub/Sub, State Store, Secret Store)
- **FR-152**: System MUST inject Dapr sidecar into backend and frontend pods
- **FR-153**: System MUST use Dapr HTTP API for service-to-service communication
- **FR-154**: System MUST configure Dapr resiliency policies (retries, timeouts, circuit breakers)
- **FR-155**: System MUST enable Dapr observability (tracing, metrics) for all services

**Real-Time Synchronization (FR-156 to FR-160)**
- **FR-156**: System MUST publish task updates to task-updates Kafka topic
- **FR-157**: System MUST implement WebSocket or Server-Sent Events for real-time client updates
- **FR-158**: System MUST use Dapr Pub/Sub for distributing updates to multiple clients
- **FR-159**: System MUST handle client reconnection and missed event replay
- **FR-160**: System MUST broadcast updates to all connected clients for a given user

### Non-Functional Requirements

**Performance (NFR-101 to NFR-104)**
- **NFR-101**: Task operations (create, update, delete) MUST complete within 200ms p95
- **NFR-102**: Search and filter operations MUST return results within 500ms p95
- **NFR-103**: Real-time updates MUST be delivered to clients within 1 second of event occurrence
- **NFR-104**: Reminder notifications MUST be sent within 10 seconds of scheduled time

**Reliability (NFR-105 to NFR-109)**
- **NFR-105**: System MUST maintain 99.9% uptime during normal operations
- **NFR-106**: Kafka events MUST be delivered with at-least-once guarantees
- **NFR-107**: Dapr state operations MUST have automatic retries with exponential backoff
- **NFR-108**: Reminder jobs MUST survive service restarts (persisted in Dapr Jobs API)
- **NFR-109**: System MUST gracefully handle temporary unavailability of Kafka or Dapr components

**Scalability (NFR-110 to NFR-113)**
- **NFR-110**: System MUST support horizontal scaling of backend and frontend services
- **NFR-111**: Kafka topics MUST be partitioned to support multiple concurrent consumers
- **NFR-112**: Dapr State Management MUST support distributed state across multiple instances
- **NFR-113**: System MUST support 1000+ concurrent users with <2s response time

**Security (NFR-114 to NFR-119)**
- **NFR-114**: All secrets MUST be stored in Dapr Secrets Management, never in code
- **NFR-115**: Kafka communication MUST use TLS encryption in production
- **NFR-116**: All API endpoints MUST require authentication and authorization
- **NFR-117**: User data isolation MUST be enforced across all services and event handlers
- **NFR-118**: WebSocket connections MUST be authenticated and scoped to user
- **NFR-119**: All event payloads MUST be validated against schemas

**Observability (NFR-120 to NFR-125)**
- **NFR-120**: System MUST provide distributed tracing for all service calls via Dapr
- **NFR-121**: System MUST export metrics for task operations, Kafka throughput, consumer lag
- **NFR-122**: System MUST log all task mutations with timestamps and user context
- **NFR-123**: System MUST provide health checks for all services and dependencies
- **NFR-124**: System MUST alert on consumer lag exceeding 1 minute or error rate > 1%
- **NFR-125**: System MUST track reminder job failures and retry counts

**Maintainability (NFR-126 to NFR-130)**
- **NFR-126**: Event schemas MUST be versioned and documented
- **NFR-127**: Database migrations MUST be reversible
- **NFR-128**: Dapr component configurations MUST be externalized (YAML files)
- **NFR-129**: All services MUST follow the same logging and error handling patterns
- **NFR-130**: Code MUST follow existing project conventions and style guidelines

## Key Entities *(include if feature involves data)*

- **Task**: Extended with due_datetime, priority, recurrence settings, and tags relationships
- **Tag**: Represents a category or label that can be associated with multiple tasks
- **TaskTag**: Many-to-many relationship table linking tasks and tags
- **Reminder**: Represents a scheduled reminder notification for a task
- **ActivityLog**: Records all task mutations for audit trail and activity feeds
- **ConversationState**: Stores AI conversation state in Dapr State Management
- **KafkaEvent**: Represents events published to Kafka (task-created, task-updated, etc.)

## Database Schema Updates

### New Fields for Tasks Table

```sql
ALTER TABLE tasks ADD COLUMN due_datetime TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low'));
ALTER TABLE tasks ADD COLUMN recurrence_pattern VARCHAR(20) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'none'));
ALTER TABLE tasks ADD COLUMN recurrence_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN parent_task_id INTEGER REFERENCES tasks(id);
```

### New Tables

```sql
-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Task tags many-to-many table
CREATE TABLE task_tags (
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- Reminders table
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_type VARCHAR(20) NOT NULL DEFAULT 'due_date',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Activity logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id, created_at),
    INDEX(task_id)
);
```

## API Contract Changes

### New API Endpoints

**Recurring Tasks**
- `POST /api/{user_id}/tasks` - Support recurrence_pattern in request body
- `PUT /api/{user_id}/tasks/{task_id}` - Support updating recurrence settings
- `POST /api/{user_id}/tasks/{task_id}/skip-occurrence` - Skip next occurrence of recurring task

**Due Dates & Reminders**
- `POST /api/{user_id}/tasks/{task_id}/reminder` - Create reminder for task
- `PUT /api/{user_id}/tasks/{task_id}/reminder` - Update reminder time
- `DELETE /api/{user_id}/tasks/{task_id}/reminder` - Cancel reminder
- `GET /api/{user_id}/reminders` - List all reminders

**Tags**
- `GET /api/{user_id}/tags` - List all tags for user
- `POST /api/{user_id}/tags` - Create new tag
- `PUT /api/{user_id}/tags/{tag_id}` - Update tag
- `DELETE /api/{user_id}/tags/{tag_id}` - Delete tag
- `POST /api/{user_id}/tasks/{task_id}/tags` - Add tag to task
- `DELETE /api/{user_id}/tasks/{task_id}/tags/{tag_id}` - Remove tag from task

**Search & Filter**
- `GET /api/{user_id}/tasks?search={keyword}&status={status}&priority={priority}&due_date_start={start}&due_date_end={end}&tags={tag_ids}` - Search and filter tasks

**Sorting**
- `GET /api/{user_id}/tasks?sort_by={field}&sort_order={asc|desc}` - Sort tasks

**Activity Logs**
- `GET /api/{user_id}/activity-logs?limit={limit}&offset={offset}` - Get activity feed

**Real-Time**
- `WS /api/ws/{user_id}` - WebSocket endpoint for real-time updates

### Updated Request/Response Schemas

**TaskCreate Schema**
```python
class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    due_datetime: Optional[datetime] = Field(default=None)
    priority: Literal["High", "Medium", "Low"] = Field(default="Medium")
    recurrence_pattern: Optional[Literal["daily", "weekly", "monthly"]] = Field(default=None)
    recurrence_end_date: Optional[datetime] = Field(default=None)
    tag_ids: Optional[List[int]] = Field(default=None)
```

**TaskResponse Schema**
```python
class TaskResponse(SQLModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    due_datetime: Optional[datetime]
    priority: Literal["High", "Medium", "Low"]
    recurrence_pattern: Optional[Literal["daily", "weekly", "monthly", "none"]]
    recurrence_end_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    tags: List[TagResponse]
    reminder: Optional[ReminderResponse]
```

## MCP Tool Additions

### New MCP Tools

**Recurring Task Management**
- `set_task_recurrence(user_id, task_id, pattern, end_date)` - Set recurrence pattern for a task
- `skip_task_occurrence(user_id, task_id)` - Skip next occurrence of recurring task

**Due Date & Reminder Management**
- `set_task_due_date(user_id, task_id, due_datetime)` - Set due date for task
- `create_reminder(user_id, task_id, reminder_time)` - Create reminder for task
- `list_reminders(user_id)` - List all reminders for user

**Priority & Tag Management**
- `set_task_priority(user_id, task_id, priority)` - Set priority for task
- `add_tag_to_task(user_id, task_id, tag_name)` - Add tag to task
- `remove_tag_from_task(user_id, task_id, tag_name)` - Remove tag from task
- `list_tags(user_id)` - List all tags for user

**Search & Filter**
- `search_tasks(user_id, keyword, filters, sort_by, sort_order)` - Search and filter tasks

**Activity Logs**
- `get_activity_logs(user_id, limit, offset)` - Get activity feed

## Kafka Topics and Event Schemas

### Kafka Topics

1. **task-events** - Main topic for all task mutations
   - Partitions: 3 (scalable for future growth)
   - Retention: 7 days
   - Cleanup: delete

2. **reminders** - Topic for reminder events
   - Partitions: 3
   - Retention: 24 hours
   - Cleanup: delete

3. **task-updates** - Topic for real-time client synchronization
   - Partitions: 3
   - Retention: 1 hour
   - Cleanup: delete

4. **activity-logs** - Topic for activity audit events
   - Partitions: 3
   - Retention: 30 days
   - Cleanup: delete

### Event Schemas

**task-created Event**
```json
{
  "event_type": "task-created",
  "event_id": "uuid",
  "timestamp": "2026-02-15T10:00:00Z",
  "data": {
    "task_id": 123,
    "user_id": "user-uuid",
    "title": "Task title",
    "description": "Task description",
    "due_datetime": "2026-02-20T15:00:00Z",
    "priority": "High",
    "recurrence_pattern": "weekly",
    "tags": ["work", "urgent"]
  }
}
```

**task-updated Event**
```json
{
  "event_type": "task-updated",
  "event_id": "uuid",
  "timestamp": "2026-02-15T10:00:00Z",
  "data": {
    "task_id": 123,
    "user_id": "user-uuid",
    "changed_fields": ["completed", "due_datetime"],
    "old_values": {
      "completed": false,
      "due_datetime": "2026-02-20T15:00:00Z"
    },
    "new_values": {
      "completed": true,
      "due_datetime": "2026-02-21T15:00:00Z"
    }
  }
}
```

**task-completed Event**
```json
{
  "event_type": "task-completed",
  "event_id": "uuid",
  "timestamp": "2026-02-15T10:00:00Z",
  "data": {
    "task_id": 123,
    "user_id": "user-uuid",
    "completed_at": "2026-02-15T10:00:00Z"
  }
}
```

**task-deleted Event**
```json
{
  "event_type": "task-deleted",
  "event_id": "uuid",
  "timestamp": "2026-02-15T10:00:00Z",
  "data": {
    "task_id": 123,
    "user_id": "user-uuid",
    "deleted_at": "2026-02-15T10:00:00Z"
  }
}
```

**reminder-triggered Event**
```json
{
  "event_type": "reminder-triggered",
  "event_id": "uuid",
  "timestamp": "2026-02-15T10:00:00Z",
  "data": {
    "reminder_id": 456,
    "task_id": 123,
    "user_id": "user-uuid",
    "reminder_time": "2026-02-15T10:00:00Z",
    "task_title": "Task title",
    "task_due_datetime": "2026-02-15T11:00:00Z"
  }
}
```

## Dapr Components Configuration

### Pub/Sub Component (Kafka)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: todo
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka:9092"
  - name: authRequired
    value: "true"
  - name: saslUsername
    secretKeyRef:
      name: kafka-secrets
      key: sasl-username
  - name: saslPassword
    secretKeyRef:
      name: kafka-secrets
      key: sasl-password
  - name: consumerGroup
    value: "todo-app-consumer-group"
```

### State Store Component

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: conversation-state
  namespace: todo
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: todo-secrets
      key: database-url
```

### Secret Store Component

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secrets
  namespace: todo
spec:
  type: secretstores.kubernetes
  version: v1
  metadata:
  - name: keys
    secretKeyRef:
      name: dapr-secret-keys
      key: secret-keys
```

## Testing Requirements

### Unit Tests
- All new service methods (RecurringTaskService, ReminderService, TagService)
- Event serialization/deserialization for all event schemas
- Recurrence date calculation logic
- Search and filter query builders
- Kafka producer and consumer methods
- Dapr state management wrappers

### Integration Tests
- End-to-end task operations with Kafka event publishing
- Recurring task completion and automatic instance creation
- Reminder scheduling and triggering
- Real-time WebSocket updates
- Dapr component integration (Pub/Sub, State, Jobs, Secrets)
- Database migrations and rollback

### Performance Tests
- Load test with 1000 concurrent users
- Search and filter performance with large datasets
- Kafka throughput and consumer lag
- WebSocket connection handling with multiple clients

### Security Tests
- Secret leakage in logs or environment variables
- Cross-user data isolation enforcement
- SQL injection protection in search queries
- WebSocket authentication and authorization
- Kafka TLS encryption verification

## Clarifications

### Session 2026-02-15

- Q: How should the system handle daylight saving time changes for due dates and reminders? → A: Store all datetimes in UTC and convert to user's local timezone for display; DST changes handled by timezone libraries
- Q: What should happen when a user reaches the recurrence_end_date for a recurring task? → A: Stop creating new occurrences; mark the last occurrence as completed without generating a new one
- Q: How should the system handle reminder scheduling for tasks that are already overdue when created? → A: Allow creation but do not schedule reminders for past due dates; show warning to user
- Q: What is the maximum number of tags a user can create? → A: 100 tags per user; enforce at API level with appropriate error message
- Q: How should the system handle WebSocket reconnection and missed updates? → A: Implement event replay using Kafka consumer groups with committed offsets; fetch missed events after reconnection
- Q: What happens when Kafka broker is down and task operations are attempted? → A: Implement dead letter queue; continue database operations with logging; retry Kafka publishing with exponential backoff
- Q: How should the system prioritize between multiple reminders for the same time? → A: Queue reminders and send in order of task priority (High > Medium > Low); use FIFO for same priority
- Q: Should activity logs include read operations (task viewing)? → A: No, only include mutations (create, update, delete, complete) to avoid excessive log volume
- Q: How should the system handle search queries with special characters? → A: Escape special characters; use parameterized queries; validate input before execution
- Q: What is the retention policy for Kafka topics? → A: task-events: 7 days, reminders: 24 hours, task-updates: 1 hour, activity-logs: 30 days
- Q: How should the system handle Dapr sidecar failures? → A: Implement health checks and restart policies; degrade gracefully to direct database access for critical operations
- Q: What is the maximum number of reminder jobs per user? → A: 100 active reminders per user; enforce at API level
- Q: How should the system handle concurrent task updates? → A: Use optimistic locking with version field; return conflict error on concurrent modification
- Q: Should tags be shared across users or private per user? → A: Tags are private per user; no tag sharing between users
- Q: How should the system handle timezone conversion for users with multiple browser tabs in different timezones? → A: Use user's profile timezone setting; store all datetimes in UTC; convert on display

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create recurring tasks with 95% success rate and automatic next occurrence creation
- **SC-002**: 99% of reminders are sent within 10 seconds of scheduled time
- **SC-003**: Real-time updates are delivered to clients within 1 second of event occurrence
- **SC-004**: Search and filter operations return results within 500ms p95 with 1000+ tasks per user
- **SC-005**: Kafka events are published with 99.9% success rate for all task operations
- **SC-006**: Dapr state operations maintain 99.9% success rate with automatic retries
- **SC-007**: Zero incidents of secret leakage in logs or environment variables
- **SC-008**: Reminder jobs survive 100% of service restarts without data loss
- **SC-009**: WebSocket reconnection and event replay works 100% of the time
- **SC-010**: System supports 1000+ concurrent users with <2s response time
- **SC-011**: All task mutations are logged to activity-logs topic with 100% accuracy
- **SC-012**: Recurring task instances are created correctly for 100% of completions

# Data Model: Full-Stack Todo Web Application

## Entity: User

**Description**: Represents an authenticated user with email, authentication credentials, and owned tasks

**Fields**:
- `id`: str (Primary Key, Text) - Unique identifier for the user (managed by Better-Auth)
- `email`: str (Unique, Indexed) - User's email address for authentication
- `name`: Optional[str] - User's display name
- `email_verified`: bool - Flag indicating if email has been verified
- `created_at`: datetime - Timestamp when user account was created
- `updated_at`: datetime - Timestamp when user account was last updated

**Relationships**:
- One-to-Many: User → Task (via user_id foreign key)

**Validation Rules**:
- Email must be unique across all users
- Email must follow standard email format
- Name is optional, max 100 characters if provided

## Entity: Task

**Description**: Represents a todo item with title, description, completion status, timestamps, and user ownership

**Fields**:
- `id`: Optional[int] (Primary Key) - Auto-incrementing integer identifier
- `user_id`: str (Foreign Key, Indexed) - Reference to the owning user
- `title`: str (Required, 1-200 chars) - Task title/description
- `description`: Optional[str] (0-1000 chars) - Extended task details
- `completed`: bool - Completion status (True=completed, False=not completed)
- `created_at`: datetime - Timestamp when task was created
- `updated_at`: datetime - Timestamp when task was last modified

**Validation Rules**:
- Title must be between 1-200 characters
- Description must be 0-1000 characters if provided
- user_id must reference an existing user
- Only the task owner can modify/delete the task

**State Transitions**:
- Creation: `completed = False` by default
- Update: `completed` can toggle between True/False
- Modification: `updated_at` updates on any change
- Deletion: Hard delete from database

**Indexes**:
- `idx_tasks_user_id`: For efficient user-specific queries
- `idx_tasks_completed`: For filtering by completion status
- `idx_tasks_created_at`: For chronological sorting

## Relationships

**User → Task (One-to-Many)**:
- A user can own multiple tasks
- Each task belongs to exactly one user
- Tasks are isolated by user_id for security
- Cascading delete: If user is deleted, all their tasks are removed

## Constraints

**Data Integrity**:
- Foreign key constraint ensures user_id references valid user
- Check constraint enforces title length (1-200 characters)
- Check constraint enforces description length (≤1000 characters)

**Access Control**:
- Users can only access their own tasks
- API endpoints validate user_id matches JWT token claims
- Unauthorized access attempts return 403 Forbidden

## Audit Trail

Both User and Task entities maintain creation and modification timestamps for audit purposes. The `updated_at` field is automatically updated on every modification to track changes over time.
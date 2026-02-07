# Data Model: AI-Powered Todo Chatbot

## Entities

### Tasks
- **id**: integer (primary key, auto-increment)
- **user_id**: string (foreign key to users.id, required, indexed)
- **title**: string (required, 1-200 characters)
- **description**: text (optional, max 1000 characters)
- **completed**: boolean (default: false)
- **created_at**: datetime (default: now)
- **updated_at**: datetime (default: now)

**Relationships**:
- Belongs to: User (many-to-one)
- Validation: user_id must reference existing user

**State Transitions**:
- Created with completed = false
- Can be updated to completed = true
- Cannot revert from completed to uncompleted (business rule)

### Conversations
- **id**: integer (primary key, auto-increment)
- **user_id**: string (foreign key to users.id, required, indexed)
- **created_at**: datetime (default: now)
- **updated_at**: datetime (default: now)

**Relationships**:
- Belongs to: User (many-to-one)
- Has many: Messages (one-to-many)
- Validation: user_id must reference existing user
- Cascade delete: If user deleted, conversations deleted

**State Transitions**:
- Created when user starts first chat
- updated_at updated when new messages are added

### Messages
- **id**: integer (primary key, auto-increment)
- **conversation_id**: integer (foreign key to conversations.id, required, indexed)
- **user_id**: string (foreign key to users.id, required, indexed)
- **role**: string (required, enum: 'user' | 'assistant')
- **content**: text (required, not empty)
- **created_at**: datetime (default: now)

**Relationships**:
- Belongs to: Conversation (many-to-one)
- Belongs to: User (many-to-one)
- Validation: conversation_id and user_id must reference existing records

**State Transitions**:
- Created when user or assistant sends message
- Immutable after creation

### Users
- **id**: string (primary key, from Better Auth)
- **email**: string (unique, required)
- **name**: string (optional)
- **created_at**: datetime (default: now)
- **updated_at**: datetime (default: now)

**Relationships**:
- Has many: Tasks (one-to-many)
- Has many: Conversations (one-to-many)
- Has many: Messages (one-to-many)

## Constraints

### Data Integrity
- Foreign key constraints enforced at database level
- Cascade deletes: User → Conversations → Messages
- Tasks remain independent (no cascade from user deletion)

### Validation Rules
- Messages content cannot be empty or null
- Message role must be either 'user' or 'assistant'
- Task title length: 1-200 characters
- Task description length: max 1000 characters
- Conversation and message user_id must match for the same conversation

### Indexes
- idx_tasks_user_id: For fast user task lookups
- idx_conversations_user_id: For fast user conversation lookups
- idx_messages_conversation_id: For fast conversation message retrieval
- idx_messages_user_id: For fast user message lookups
- idx_messages_created_at: For chronological message ordering
- idx_tasks_completed: For efficient task filtering by completion status
# Full-Stack Todo Web Application

A complete full-stack todo application with user authentication, task management, and responsive UI.

## Features

- **User Authentication**: Secure sign up and sign in with JWT tokens
- **Task Management**: Create, read, update, delete, and mark tasks as complete
- **Multi-User Support**: Each user has their own isolated tasks
- **Responsive UI**: Works on desktop, tablet, and mobile devices
- **Modern Tech Stack**: FastAPI backend with Next.js frontend

## Tech Stack

- **Backend**: Python, FastAPI, SQLModel, PostgreSQL
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Authentication**: JWT-based authentication
- **Database**: Neon Serverless PostgreSQL

## Project Structure

```
phase-2/
├── backend/
│   ├── src/
│   │   ├── models/          # Data models (User, Task)
│   │   ├── services/        # Business logic (auth, task services)
│   │   ├── api/             # API routers (auth, task endpoints)
│   │   └── database/        # Database connection
│   ├── requirements.txt     # Python dependencies
│   └── test_basic.py        # Basic tests
└── frontend/
    ├── src/
    │   ├── components/      # React components (AuthForm, TaskForm, etc.)
    │   ├── pages/           # Next.js pages (signup, signin, tasks)
    │   ├── services/        # API service
    │   └── app/             # Next.js app directory
    ├── package.json         # Node.js dependencies
    └── .env.local           # Environment variables
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd phase-2/backend
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables in `.env`:
```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:3000
```

4. Run the backend server:
```bash
uvicorn src.main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd phase-2/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user info

### Task Management
- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret key for JWT signing
- `CORS_ORIGIN`: Allowed origin for CORS (default: http://localhost:3000)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## Running Tests

To run backend tests:
```bash
cd phase-2/backend
python -m pytest test_basic.py -v
```

## Development

### Backend Development
```bash
cd phase-2/backend
uvicorn src.main:app --reload
```

### Frontend Development
```bash
cd phase-2/frontend
npm run dev
```

## Security Features

- JWT-based authentication
- User data isolation (users can only access their own tasks)
- Password hashing with bcrypt
- Input validation
- CSRF protection

## Database Models

### User
- `id`: Unique identifier
- `email`: User's email address (unique)
- `name`: Optional display name
- `password`: Hashed password
- `email_verified`: Email verification status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Task
- `id`: Unique identifier
- `user_id`: Reference to the owning user
- `title`: Task title (1-200 characters)
- `description`: Optional task description (up to 1000 characters)
- `completed`: Completion status (boolean)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
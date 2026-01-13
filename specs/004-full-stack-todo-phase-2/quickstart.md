# Quick Start Guide: Full-Stack Todo Web Application

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ installed
- npm or pnpm package manager
- Git for version control
- Access to Neon PostgreSQL account

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
uv init  # or use your preferred Python project initialization
pip install fastapi sqlmodel uvicorn python-jose[cryptography] better-auth psycopg2-binary
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:3000
```

#### Database Setup
1. Create a Neon PostgreSQL database
2. Run the migration SQL from the spec document
3. Verify tables are created

#### Run Backend Server
```bash
cd backend
uvicorn src.main:app --reload --port 8000
```
Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install next react react-dom typescript @types/react @types/node @types/react-dom
npm install better-auth tailwindcss postcss autoprefixer
```

#### Configure Environment
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
```

#### Initialize Tailwind CSS
```bash
cd frontend
npx tailwindcss init -p
```

#### Run Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will be available at `http://localhost:3000`

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

## Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn src.main:app --reload

# Run tests
pytest

# Format code
black .
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Format code
npm run format
```

## Testing

### Backend Tests
```bash
cd backend
pytest tests/unit/    # Unit tests
pytest tests/integration/  # Integration tests
```

### Frontend Tests
```bash
cd frontend
npm run test  # Run Jest/Vitest tests
```

## API Documentation

Interactive API documentation is available at `http://localhost:8000/docs` when the backend is running.

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify your Neon PostgreSQL connection string and credentials
2. **Authentication**: Ensure `BETTER_AUTH_SECRET` matches between backend and frontend
3. **CORS Errors**: Check that `CORS_ORIGIN` in backend matches your frontend URL
4. **JWT Expiration**: Tokens expire after 7 days by default

### Resetting Local Environment
```bash
# Clear Python cache
find . -type d -name __pycache__ -delete
find . -name "*.pyc" -delete

# Clear Node cache
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Implement the data models following the `data-model.md` specification
2. Create the API endpoints following the contract specifications in `/contracts/`
3. Build the frontend components following the UI principles
4. Implement authentication flow with Better-Auth
5. Connect frontend to backend API
6. Test user flows end-to-end
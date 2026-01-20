# API Contracts: UI/UX Transformation

## Overview
This document defines the API contracts that remain unchanged during the UI/UX transformation. All existing API endpoints and their contracts are preserved to maintain functionality while only changing the frontend presentation layer.

## Authentication Endpoints

### POST /auth/login
**Purpose**: Authenticate user and return session token
**Request**:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional)"
}
```

**Response** (200):
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string"
  },
  "success": "boolean"
}
```

**Response** (401):
```json
{
  "error": "string",
  "success": false
}
```

### POST /auth/signup
**Purpose**: Register new user account
**Request**:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "name": "string (required)",
  "confirmPassword": "string (required)"
}
```

**Response** (201):
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string"
  },
  "success": "boolean"
}
```

**Response** (400):
```json
{
  "error": "string",
  "success": false
}
```

## Todo Management Endpoints

### GET /api/todos
**Purpose**: Retrieve user's todo list
**Headers**: Authorization: Bearer {token}
**Response** (200):
```json
{
  "todos": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "priority": "string",
      "dueDate": "string (ISO date)",
      "tags": "string[]",
      "createdAt": "string (ISO datetime)",
      "updatedAt": "string (ISO datetime)"
    }
  ],
  "count": "number"
}
```

### POST /api/todos
**Purpose**: Create a new todo item
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "string (optional)",
  "dueDate": "string (optional, ISO date)",
  "tags": "string[] (optional)"
}
```

**Response** (201):
```json
{
  "todo": {
    "id": "number",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "priority": "string",
    "dueDate": "string (ISO date)",
    "tags": "string[]",
    "createdAt": "string (ISO datetime)",
    "updatedAt": "string (ISO datetime)"
  },
  "success": "boolean"
}
```

### PUT /api/todos/{id}
**Purpose**: Update existing todo item
**Headers**: Authorization: Bearer {token}
**Path Parameter**: id (number)
**Request**:
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "priority": "string (optional)",
  "dueDate": "string (optional)",
  "tags": "string[] (optional)"
}
```

**Response** (200):
```json
{
  "todo": {
    "id": "number",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "priority": "string",
    "dueDate": "string (ISO date)",
    "tags": "string[]",
    "createdAt": "string (ISO datetime)",
    "updatedAt": "string (ISO datetime)"
  },
  "success": "boolean"
}
```

### DELETE /api/todos/{id}
**Purpose**: Delete a todo item
**Headers**: Authorization: Bearer {token}
**Path Parameter**: id (number)
**Response** (200):
```json
{
  "success": "boolean",
  "message": "string"
}
```

### PATCH /api/todos/{id}/complete
**Purpose**: Mark a todo as completed/incompleted
**Headers**: Authorization: Bearer {token}
**Path Parameter**: id (number)
**Request**:
```json
{
  "completed": "boolean"
}
```

**Response** (200):
```json
{
  "todo": {
    "id": "number",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "priority": "string",
    "dueDate": "string (ISO date)",
    "tags": "string[]",
    "createdAt": "string (ISO datetime)",
    "updatedAt": "string (ISO datetime)"
  },
  "success": "boolean"
}
```

## User Profile Endpoints

### GET /api/profile
**Purpose**: Retrieve current user's profile information
**Headers**: Authorization: Bearer {token}
**Response** (200):
```json
{
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "avatar": "string (optional)",
    "createdAt": "string (ISO datetime)"
  }
}
```

### PUT /api/profile
**Purpose**: Update user's profile information
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "avatar": "string (optional)"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "avatar": "string (optional)",
    "createdAt": "string (ISO datetime)",
    "updatedAt": "string (ISO datetime)"
  },
  "success": "boolean"
}
```

## Settings Endpoints

### GET /api/settings
**Purpose**: Retrieve user's settings including theme preference
**Headers**: Authorization: Bearer {token}
**Response** (200):
```json
{
  "settings": {
    "theme": "string ('light' | 'dark')",
    "notifications": "boolean",
    "language": "string",
    "timezone": "string"
  }
}
```

### PUT /api/settings
**Purpose**: Update user's settings
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "theme": "string ('light' | 'dark')",
  "notifications": "boolean",
  "language": "string",
  "timezone": "string"
}
```

**Response** (200):
```json
{
  "settings": {
    "theme": "string ('light' | 'dark')",
    "notifications": "boolean",
    "language": "string",
    "timezone": "string"
  },
  "success": "boolean"
}
```

## Error Response Format
All error responses follow this structure:
```json
{
  "error": "string",
  "code": "string (error code)",
  "success": false
}
```

## Validation Rules
- All string fields must be trimmed of whitespace
- Email fields must follow standard email format
- Dates must be in ISO 8601 format
- Priority values must be one of: 'high', 'medium', 'low'
- Tags must be lowercase alphanumeric with hyphens allowed
- All timestamps use UTC timezone

## Rate Limiting
- Authentication endpoints: 5 attempts per minute per IP
- API endpoints: 100 requests per minute per user
- File upload endpoints: 10 requests per minute per user
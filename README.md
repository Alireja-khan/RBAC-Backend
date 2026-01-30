# RBAC Backend API

This is the backend API for the Role-Based Access Control (RBAC) Project Management System.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Monitoring & Logging](#monitoring--logging)

## Overview
The backend API provides secure authentication, role-based access control, user management, and project management functionality. Built with Node.js, Express, and TypeScript, it follows RESTful principles and implements industry-standard security practices.

## Features

### Authentication & Security
- JWT-based authentication with secure token generation
- Password hashing with bcrypt
- Role-based access control middleware
- Token validation and refresh mechanisms
- Rate limiting for abuse prevention

### User Management
- Admin-controlled user invitation system
- Role assignment (ADMIN, MANAGER, STAFF)
- User activation/deactivation
- Invite token generation with expiration
- User search and pagination

### Project Management
- CRUD operations for projects
- Soft delete implementation
- Project status management (ACTIVE, ARCHIVED, DELETED)
- Creator-based ownership tracking
- Admin-only modification permissions

### Data Management
- MongoDB with Mongoose ODM
- Data validation and sanitization
- Index optimization for performance
- Connection pooling and retry logic

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors
- **Validation**: express-validator
- **Development**: nodemon, ts-node
- **Build**: tsc (TypeScript compiler)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-backend-repo-url>
cd rbac-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables (see [Environment Variables](#environment-variables))

5. Start MongoDB (if using local instance):
```bash
mongod
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Create Initial Admin User
```bash
npm run create-admin
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/rbac-project-management
MONGO_URI_TEST=mongodb://localhost:27017/rbac-project-management-test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Application
APP_NAME=RBAC Project Management API
APP_VERSION=1.0.0
```

## Project Structure

```
src/
├── controllers/           # Request handlers
│   ├── auth.controller.ts
│   ├── project.controller.ts
│   └── user.controller.ts
├── middlewares/          # Custom middleware
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   └── validation.middleware.ts
├── models/               # Database models
│   ├── Invite.model.ts
│   ├── Project.model.ts
│   └── User.model.ts
├── routes/               # API route definitions
│   ├── auth.routes.ts
│   ├── project.routes.ts
│   └── user.routes.ts
├── scripts/              # Utility scripts
│   └── createAdmin.ts
├── types/                # TypeScript interfaces
│   └── express.d.ts
├── utils/                # Utility functions
│   ├── generateToken.ts
│   └── jwt.ts
├── app.ts               # Express application setup
└── server.ts            # Server initialization
```

## API Documentation

### Authentication Endpoints

#### POST `/auth/login`
User login with email and password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/auth/invite` (ADMIN only)
Create user invitation
```json
{
  "email": "newuser@example.com",
  "role": "STAFF"
}
```

#### GET `/auth/invite/:token`
Validate invite token

#### POST `/auth/register-via-invite`
Register using invite token
```json
{
  "token": "invite-token",
  "name": "John Doe",
  "password": "password123"
}
```

### User Management Endpoints (ADMIN only)

#### GET `/users`
Get all users with pagination
Query parameters: `page`, `limit`, `search`, `role`, `status`

#### PATCH `/users/:id/role`
Update user role
```json
{
  "role": "MANAGER"
}
```

#### PATCH `/users/:id/status`
Update user status
```json
{
  "status": "ACTIVE"
}
```

### Project Management Endpoints

#### POST `/projects`
Create new project (authenticated users)
```json
{
  "name": "Project Name",
  "description": "Project description"
}
```

#### GET `/projects`
Get all projects (authenticated users)
Query parameters: `status`, `page`, `limit`

#### PATCH `/projects/:id` (ADMIN only)
Update project
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### DELETE `/projects/:id` (ADMIN only)
Soft delete project

## Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (ADMIN | MANAGER | STAFF),
  status: String (ACTIVE | INACTIVE),
  invitedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Invite Model
```typescript
{
  _id: ObjectId,
  email: String,
  role: String,
  token: String (unique),
  expiresAt: Date,
  acceptedAt: Date,
  createdAt: Date
}
```

### Project Model
```typescript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String (ACTIVE | ARCHIVED | DELETED),
  isDeleted: Boolean,
  createdBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

### JWT Token Structure
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Role-Based Access Control
- **ADMIN**: Full access to all endpoints
- **MANAGER**: Read access to users, full access to projects
- **STAFF**: Read-only access to projects, own user data

### Middleware Implementation
- `authMiddleware`: Validates JWT token
- `roleMiddleware`: Checks user role permissions
- `validationMiddleware`: Validates request data

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `500`: Internal Server Error

## Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run create-admin # Create initial admin user
npm run lint         # Run ESLint
npm run test         # Run tests (if implemented)
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment for Production
Create a `.env.production` file with production environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
PORT=8080
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Hosting Options
- **Heroku**: Direct deployment with environment variables
- **AWS EC2**: Manual deployment with PM2 process manager
- **Google Cloud Run**: Containerized deployment
- **DigitalOcean App Platform**: Automatic deployment from GitHub

### Health Check Endpoint
`GET /health` - Returns server status and database connection info

## Monitoring & Logging

### Application Logging
- Request/response logging with Morgan
- Error logging with Winston
- Performance monitoring
- Security event logging

### Key Metrics to Monitor
- Response times
- Error rates
- Database connection status
- Memory usage
- CPU utilization
- Active user sessions

### Security Considerations
- Regular security audits
- Dependency vulnerability scanning
- Rate limiting implementation
- Input validation and sanitization
- Secure header configuration

---
id: getting-started
title: Getting Started
---

# Getting Started

Follow these steps to start using the NestJS Starter Kit.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- PostgreSQL database (optional - can run without database)

## Creating a New Project

The easiest way to get started is by using our CLI:

```bash
npx nestjs-starter-kit my-project
```

This will create a new project in the `my-project` directory with all the starter kit features pre-configured.

## Manual Installation

Alternatively, you can clone the repository:

1. Clone the repository:

```bash
git clone https://github.com/latreon/nest-starter-kit.git
cd nest-starter-kit
```

2. Install dependencies:

```bash
npm install
```

3. Configure Environment Variables:

Create a `.env` file in the root of the project based on `.env.example`:

```bash
# Application
NODE_ENV=development
PORT=3000
DATABASE_ENABLED=false  # Set to true if you want to use a database

# Database Configuration (required only if DATABASE_ENABLED=true)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=nest_starter

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRATION=7d

# Throttling
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Swagger
SWAGGER_ENABLED=true
```

4. Running Without a Database

You can run the application without a database by setting:

```
DATABASE_ENABLED=false
```

In this mode, the application will use in-memory data with a mock user:
- Email: demo@example.com
- Password: password
- API Key: demo-api-key

This is useful for quick testing and development. Note that in this mode, most write operations (create/update/delete) will be disabled.

5. Running With a Database (Optional)

If you want to use a database:

- Set `DATABASE_ENABLED=true` in your `.env` file
- Create a PostgreSQL database with the name specified in your `.env` file:

```bash
psql -U postgres
CREATE DATABASE nest_starter;
\q
```

- Run database migrations:

```bash
npm run migration:run
```

6. Starting the Application

For development:
```bash
npm run start:dev
```

For production:
```bash
npm run build
npm run start:prod
```

The API server should now be running at http://localhost:3000.

When running in development mode, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Project Structure

```
src/
├── app/                  # Application core
│   ├── common/           # Common utilities and helpers
│   └── modules/          # Feature modules
│       ├── auth/         # Authentication module
│       ├── user/         # User management module
│       └── shared/       # Shared services and utilities
├── config/               # Configuration settings
├── database/             # Database setup and migrations
└── main.ts               # Application entry point
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint             | Description                     | Protected |
|--------|----------------------|---------------------------------|-----------|
| POST   | /auth/login          | User login                      | No        |
| POST   | /auth/logout         | Logout user                     | Yes       |
| POST   | /auth/refresh        | Refresh access token            | No        |
| GET    | /auth/env            | Get authentication environment  | No        |
| POST   | /auth/2fa/enable     | Enable two-factor authentication| Yes       |
| POST   | /auth/2fa/validate   | Validate 2FA code               | Yes       |

### User Endpoints

| Method | Endpoint             | Description                     | Protected |
|--------|----------------------|---------------------------------|-----------|
| POST   | /users               | Create a new user               | Yes       |
| GET    | /users               | Get all users                   | Yes       |
| GET    | /users/{id}          | Get user by ID                  | Yes       |
| PUT    | /users/{id}          | Update user                     | Yes       |
| DELETE | /users/{id}          | Delete user                     | Yes       |
| GET    | /users/profile       | Get current user profile        | Yes       |
| PUT    | /users/profile       | Update current user profile     | Yes       |

## Next Steps

After setting up your project, check out the following sections to learn more about the features and how to use them:

- [Setup Guide](setup-guide)
- [Authentication](authentication/overview)
- [Database Configuration](database/typeorm-setup) 
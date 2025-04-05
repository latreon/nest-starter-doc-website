---
id: introduction
title: Introduction
slug: /
---

# NestJS Starter Kit

A comprehensive, production-ready starter kit for NestJS applications with built-in authentication, enhanced security, database integration, and industry best practices.

## Quick Start

You can create a new project with a single command:

```bash
npx nestjs-starter-kit my-project
```

This will create a new NestJS project with all the features and best practices already configured.

## Features

- **Advanced Authentication**
  - JWT-based authentication with refresh tokens
  - Two-factor authentication (2FA) with encrypted secrets
  - API key authentication
  
- **Security Enhancements**
  - AES-256-CBC encryption for sensitive data
  - Secure password handling with bcrypt
  - Protection against common web vulnerabilities
  - Rate limiting and throttling
  
- **Authorization**
  - Role-based access control
  - Public/private route decorators
  
- **Database Integration**
  - TypeORM with PostgreSQL
  - Entity inheritance with BaseEntity
  - Efficient pagination
  
- **API Documentation**
  - Swagger/OpenAPI with rich metadata
  - Detailed endpoint descriptions
  - Authentication examples
  
- **Environment Configuration**
  - Environment-specific configurations
  - Strong validation with Joi
  - Sensible defaults
  
- **Request Validation**
  - Comprehensive DTO validation with class-validator
  - Detailed error messages
  - Request transformation
  
- **Error Handling**
  - Global exception filters
  - Standardized error responses
  - JWT-specific error handling
  
- **Developer Experience**
  - Hot module replacement
  - SWC compiler for faster builds
  - Standardized module structure
  - Integration tests
  - Extensive documentation

## Security First Approach

This starter kit is built with security as a primary concern. We've implemented industry best practices to ensure your application is protected against common vulnerabilities.

### Encrypted 2FA Secrets

This starter kit implements industry-standard encryption for 2FA secrets, addressing a common security vulnerability. Features include:

- **AES-256-CBC Encryption**: Military-grade encryption for 2FA secrets
- **Unique Initialization Vectors**: Each secret gets a unique IV for enhanced security
- **Transparent Encryption/Decryption**: Handled automatically by the system
- **Error Handling**: Robust error handling for cryptographic operations

### Enhanced Authentication

- Multiple authentication strategies (JWT, API Key)
- Complete JWT authentication with access and refresh tokens
- Configurable token expiration
- Protection against common authentication attacks

### Data Protection

- All sensitive data is properly encrypted or hashed
- Passwords are hashed using bcrypt with proper salt rounds
- Personal information is protected according to best practices
- Refresh tokens are securely stored with hashing

## SWC Compiler Support

This starter kit utilizes SWC for faster compilation:

- Significantly faster build times compared to TypeScript compiler
- Same type-checking capabilities when using `typeCheck: true`
- Compatible with all NestJS features
- Configured for optimal performance

## Project Structure

The project follows a standardized modular structure:

```
src/
├── app/                  # Application core
│   ├── common/           # Common utilities and helpers
│   │   ├── decorators/   # Custom decorators
│   │   ├── docs/         # API documentation
│   │   ├── entities/     # Base entities
│   │   ├── dto/          # Common DTOs
│   │   ├── services/     # Common services like encryption
│   │   └── exception/    # Exception filters
│   └── modules/          # Feature modules
│       ├── auth/         # Authentication module
│       │   ├── controllers/ # Auth controllers
│       │   ├── dto/      # Auth-specific DTOs
│       │   ├── entities/ # Auth-related entities
│       │   ├── guards/   # Auth guards
│       │   ├── services/ # Auth services
│       │   ├── strategies/ # Passport strategies
│       │   └── types/    # Auth type definitions
│       ├── user/         # User management module
│       │   ├── controllers/ # User controllers
│       │   ├── dto/      # User-specific DTOs
│       │   ├── entities/ # User entities
│       │   └── services/ # User services
│       └── shared/       # Shared services and utilities
├── config/               # Configuration settings
├── database/             # Database setup and migrations
└── main.ts               # Application entry point
```

Each feature module follows the same standardized structure, matching the organization of the common module.

## Authentication Flow

The starter kit provides several authentication methods:

1. **JWT Authentication with Refresh Tokens**
   - Login with email/password to receive access and refresh tokens
   - Use access token for authenticated requests
   - When access token expires, use refresh token to get a new pair of tokens
   - Logout to invalidate refresh tokens

2. **Two-Factor Authentication (2FA)**
   - Enable 2FA for enhanced security
   - 2FA secrets are securely encrypted in the database
   - TOTP-based verification (compatible with apps like Google Authenticator)

3. **API Key Authentication**
   - Alternative authentication for service-to-service communication
   - Unique per-user API keys with fine-grained permissions

## Refresh Token Implementation

This starter kit implements a secure refresh token mechanism:

1. **How it works:**
   - After successful login, both access and refresh tokens are issued
   - Access tokens have a shorter lifespan (default 15 minutes)
   - Refresh tokens have a longer lifespan (default 7 days)
   - When the access token expires, the refresh token can be used to get a new pair of tokens
   - Refresh tokens are stored securely in the database using bcrypt hashing

2. **Endpoints:**
   - `/auth/login` - Returns access and refresh tokens
   - `/auth/refresh` - Uses refresh token to issue new tokens
   - `/auth/logout` - Invalidates the refresh token

3. **Security considerations:**
   - Different secrets for access and refresh tokens
   - Refresh tokens are hashed before storage
   - One-time use - each refresh operation invalidates the old token

## Why Use This Starter Kit?

This starter kit saves you time by providing a solid foundation for your NestJS applications. It implements best practices and common patterns that you would otherwise need to set up yourself.

- **Production-Ready**: Follows industry best practices for security and performance
- **Time-Saving**: Skip weeks of boilerplate setup and focus on your business logic
- **Maintainable**: Well-structured codebase that's easy to extend and customize
- **Secure by Default**: Security best practices baked in from the start 
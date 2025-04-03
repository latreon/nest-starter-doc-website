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
  - Well-organized project structure
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
- Automatic token refresh mechanism
- Configurable token expiration
- Protection against common authentication attacks

### Data Protection

- All sensitive data is properly encrypted or hashed
- Passwords are hashed using bcrypt with proper salt rounds
- Personal information is protected according to best practices

## Project Structure

The starter kit follows a well-organized structure that adheres to NestJS best practices:

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
│       ├── user/         # User management module
│       └── shared/       # Shared services and utilities
├── config/               # Configuration settings
├── database/             # Database setup and migrations
└── main.ts               # Application entry point
```

## Authentication Flow

The starter kit provides several authentication methods:

1. **JWT Authentication**
   - Login with email/password to receive JWT token
   - Use token for subsequent authenticated requests
   - Automatic handling of token expiration and refresh

2. **Two-Factor Authentication (2FA)**
   - Enable 2FA for enhanced security
   - 2FA secrets are securely encrypted in the database
   - TOTP-based verification (compatible with apps like Google Authenticator)

3. **API Key Authentication**
   - Alternative authentication for service-to-service communication
   - Unique per-user API keys with fine-grained permissions

## Why Use This Starter Kit?

This starter kit saves you time by providing a solid foundation for your NestJS applications. It implements best practices and common patterns that you would otherwise need to set up yourself.

- **Production-Ready**: Follows industry best practices for security and performance
- **Time-Saving**: Skip weeks of boilerplate setup and focus on your business logic
- **Maintainable**: Well-structured codebase that's easy to extend and customize
- **Secure by Default**: Security best practices baked in from the start 
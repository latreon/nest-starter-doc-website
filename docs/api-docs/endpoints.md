---
id: endpoints
title: API Endpoints
sidebar_label: Endpoints
---

# API Endpoints

## Overview

This document provides a comprehensive overview of all API endpoints available in the starter kit. It covers request/response formats, authentication requirements, and examples for each endpoint.

## Authentication Endpoints

### Register User

Creates a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:

```json
{
  "email": "user@example.com",
  "password": "StrongP@ss123",
  "firstName": "John",
  "lastName": "Doe"
}
```

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": false,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

- **Error Response**:
  - **Code**: `400 Bad Request`
  - **Content**:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password is too weak"],
  "error": "Bad Request"
}
```

### Login

Authenticates a user and returns a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:

```json
{
  "email": "user@example.com",
  "password": "StrongP@ss123"
}
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

- **Error Response**:
  - **Code**: `401 Unauthorized`
  - **Content**:

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### Refresh Token

Refreshes the access token using a refresh token.

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error Response**:
  - **Code**: `401 Unauthorized`
  - **Content**:

```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

### Logout

Invalidates the refresh token.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "message": "Logged out successfully"
}
```

## User Endpoints

### Get Current User Profile

Returns the profile of the authenticated user.

- **URL**: `/users/me`
- **Method**: `GET`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

- **Error Response**:
  - **Code**: `401 Unauthorized`
  - **Content**:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Update User Profile

Updates the profile of the authenticated user.

- **URL**: `/users/me`
- **Method**: `PATCH`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Request Body**:

```json
{
  "firstName": "Updated",
  "lastName": "Name"
}
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Change Password

Changes the password of the authenticated user.

- **URL**: `/users/me/password`
- **Method**: `PATCH`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Request Body**:

```json
{
  "currentPassword": "OldP@ssw0rd",
  "newPassword": "NewStrongP@ss123"
}
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "message": "Password changed successfully"
}
```

- **Error Response**:
  - **Code**: `400 Bad Request`
  - **Content**:

```json
{
  "statusCode": 400,
  "message": "Current password is incorrect",
  "error": "Bad Request"
}
```

## Admin Endpoints

### Get All Users

Returns a list of all users (admin only).

- **URL**: `/admin/users`
- **Method**: `GET`
- **Authentication**: Bearer token (Admin role required)
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Query Parameters**:
  - `limit` (optional): Number of items per page (default: 10)
  - `offset` (optional): Number of items to skip (default: 0)
  - `sortBy` (optional): Field to sort by (default: createdAt)
  - `sortOrder` (optional): Sort order, 'ASC' or 'DESC' (default: DESC)
  - `search` (optional): Search term for email, firstName, or lastName
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user1@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "role": "user",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174000",
      "email": "user2@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "isActive": true,
      "role": "user",
      "createdAt": "2023-01-02T00:00:00Z",
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```

### Get User by ID

Returns a specific user by ID (admin only).

- **URL**: `/admin/users/:id`
- **Method**: `GET`
- **Authentication**: Bearer token (Admin role required)
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "role": "user",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

- **Error Response**:
  - **Code**: `404 Not Found`
  - **Content**:

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### Update User

Updates a specific user (admin only).

- **URL**: `/admin/users/:id`
- **Method**: `PATCH`
- **Authentication**: Bearer token (Admin role required)
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Request Body**:

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "isActive": false,
  "role": "admin"
}
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "isActive": false,
  "role": "admin",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Delete User

Deletes a user (admin only).

- **URL**: `/admin/users/:id`
- **Method**: `DELETE`
- **Authentication**: Bearer token (Admin role required)
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Success Response**:
  - **Code**: `204 No Content`
- **Error Response**:
  - **Code**: `404 Not Found`
  - **Content**:

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## API Key Endpoints

### Create API Key

Creates a new API key for the authenticated user.

- **URL**: `/api-keys`
- **Method**: `POST`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Request Body**:

```json
{
  "name": "My API Key",
  "expiresAt": "2024-01-01T00:00:00Z",
  "scopes": ["read:users", "write:users"]
}
```

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "My API Key",
  "key": "sk_live_1234567890abcdefghijklmnopqrstuvwxyz", // Only returned once
  "scopes": ["read:users", "write:users"],
  "expiresAt": "2024-01-01T00:00:00Z",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### List API Keys

Returns a list of all API keys for the authenticated user.

- **URL**: `/api-keys`
- **Method**: `GET`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My API Key",
    "scopes": ["read:users", "write:users"],
    "expiresAt": "2024-01-01T00:00:00Z",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174000",
    "name": "Another API Key",
    "scopes": ["read:users"],
    "expiresAt": null,
    "createdAt": "2023-01-02T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
]
```

### Revoke API Key

Revokes (deletes) an API key.

- **URL**: `/api-keys/:id`
- **Method**: `DELETE`
- **Authentication**: Bearer token
- **Request Headers**:
  - `Authorization: Bearer {accessToken}`
- **Success Response**:
  - **Code**: `204 No Content`
- **Error Response**:
  - **Code**: `404 Not Found`
  - **Content**:

```json
{
  "statusCode": 404,
  "message": "API key not found",
  "error": "Not Found"
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "statusCode": 400,
  "message": "Error message or validation errors",
  "error": "Error type"
}
```

### Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `204 No Content`: Request succeeded with no content to return
- `400 Bad Request`: Invalid request parameters or validation error
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authentication succeeded but the user lacks permission
- `404 Not Found`: Requested resource not found
- `422 Unprocessable Entity`: Request validation failed
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## API Versioning

The API supports versioning through URL path:

- **V1**: `/api/v1/[endpoint]`

When a breaking change is introduced, a new version is created while maintaining support for the older version for a deprecation period.

## Rate Limiting

API requests are subject to rate limiting:

- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 60 requests per minute per user
- **Admin endpoints**: 120 requests per minute per user

When a rate limit is exceeded, the API returns a `429 Too Many Requests` response with headers indicating the limit and when it resets:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1619012345
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Alternatively, API key authentication can be used for service-to-service communication:

```
X-API-Key: sk_live_1234567890abcdefghijklmnopqrstuvwxyz
```

## Request/Response Format

- All request and response bodies use JSON format
- Dates are formatted as ISO 8601 strings (e.g., `2023-01-01T00:00:00Z`)
- Boolean values are represented as `true` or `false`
- Numbers are represented without quotes
- Strings are enclosed in double quotes
- Arrays are enclosed in square brackets `[]`
- Objects are enclosed in curly braces `{}` 
---
id: environment
title: Environment Configuration
sidebar_label: Environment
---

# Environment Configuration

## Overview

The starter kit uses environment variables for configuration, following the twelve-factor app methodology. This approach keeps configuration separate from code, allowing the same codebase to be deployed in different environments without modification.

## Environment Files

### Structure

The starter kit uses the following files for environment configuration:

- `.env`: Default environment file (not committed to version control)
- `.env.example`: Example environment file with required variables (committed)
- `.env.development`: Development-specific environment (optional)
- `.env.test`: Test-specific environment (optional)
- `.env.production`: Production-specific environment (optional)

### Loading Order

Environment variables are loaded in the following order, with later values overriding earlier ones:

1. Default values defined in code
2. `.env` file
3. Environment-specific file (`.env.development`, `.env.test`, or `.env.production`)
4. System environment variables

## Configuration Module

The starter kit uses NestJS's `ConfigModule` for loading and accessing environment variables:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        // Database
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('1d'),
        // ... other validations
      }),
    }),
    // Other modules...
  ],
})
export class AppModule {}
```

## Configuration Files

The starter kit uses a modular approach to configuration, separating variables by domain:

### App Configuration

```typescript
// config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'NestJS Starter',
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || '0.0.0.0',
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || 'v1',
  corsEnabled: process.env.CORS_ENABLED === 'true',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  throttleTtl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
}));
```

### Database Configuration

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nest_starter',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true',
  autoLoadEntities: true,
}));
```

### Authentication Configuration

```typescript
// config/auth.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
}));
```

## Using Configuration

### Accessing Configuration in Services

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getAppInfo() {
    const name = this.configService.get<string>('app.name');
    const version = this.configService.get<string>('app.apiVersion');
    
    return {
      name,
      version,
      environment: this.configService.get<string>('app.nodeEnv'),
    };
  }
}
```

### Accessing Namespaced Configuration

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  getJwtConfig() {
    // Access configuration from the 'auth' namespace
    const secret = this.configService.get<string>('auth.jwtSecret');
    const expiration = this.configService.get<string>('auth.jwtExpiration');
    
    return { secret, expiration };
  }
}
```

## Environment Variables Reference

### Application Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | HTTP port | `3000` |
| `HOST` | HTTP host | `0.0.0.0` |
| `APP_NAME` | Application name | `NestJS Starter` |
| `API_PREFIX` | API URL prefix | `api` |
| `API_VERSION` | API version | `v1` |
| `CORS_ENABLED` | Enable CORS | `true` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `*` |
| `THROTTLE_TTL` | Rate limiting time window (seconds) | `60` |
| `THROTTLE_LIMIT` | Rate limiting max requests per window | `10` |

### Database Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_TYPE` | Database type | `postgres` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_DATABASE` | Database name | `nest_starter` |
| `DB_SYNCHRONIZE` | Auto-synchronize database schema | `false` |
| `DB_LOGGING` | Enable database query logging | `true` |
| `DB_SSL` | Use SSL for database connection | `false` |

### Authentication Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | (Required) |
| `JWT_EXPIRATION` | JWT expiration time | `1d` |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiration | `7d` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt password hashing rounds | `12` |

### Email Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MAIL_HOST` | SMTP mail host | `smtp.example.com` |
| `MAIL_PORT` | SMTP mail port | `587` |
| `MAIL_USER` | SMTP username | (Required) |
| `MAIL_PASSWORD` | SMTP password | (Required) |
| `MAIL_FROM` | Default sender email | `noreply@example.com` |
| `MAIL_SECURE` | Use TLS | `false` |

### Redis Variables (if used)

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | `` |
| `REDIS_DB` | Redis database number | `0` |

## Environment Example

Here's a sample `.env.example` file from the starter kit:

```dotenv
# Application
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
APP_NAME=NestJS Starter Kit
API_PREFIX=api
API_VERSION=v1
CORS_ENABLED=true
CORS_ORIGINS=http://localhost:3000,http://localhost:4200

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_starter
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_SSL=false

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d
REFRESH_TOKEN_EXPIRATION=7d
BCRYPT_SALT_ROUNDS=12

# Email
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=user@example.com
MAIL_PASSWORD=password
MAIL_FROM=noreply@example.com
MAIL_SECURE=false

# Redis (if used)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Best Practices

1. **Never commit `.env` files to version control**: These files may contain sensitive information such as database passwords and secret keys.

2. **Always include a `.env.example` file**: This serves as documentation and helps other developers set up the project.

3. **Use validation**: Validate environment variables to catch configuration errors early.

4. **Set reasonable defaults**: Provide sensible default values for non-critical variables.

5. **Group related variables**: Use namespaces to organize related configuration variables.

6. **Use environment-specific files**: Maintain separate environment files for development, testing, and production.

7. **Securely manage secrets in production**: Consider using a secrets management solution in production environments instead of `.env` files.

## Secrets Management in Production

For production environments, consider these approaches instead of `.env` files:

1. **Environment Variables**: Set environment variables directly in your deployment platform.

2. **Kubernetes Secrets**: If using Kubernetes, use Kubernetes Secrets.

3. **Managed Services**: Use AWS Secrets Manager, GCP Secret Manager, or Azure Key Vault.

4. **Vault**: Use HashiCorp Vault for secrets management.

The starter kit's `ConfigModule` can work with any of these approaches without code changes, as it falls back to system environment variables when files are not present. 
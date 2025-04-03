---
id: validation
title: Configuration Validation
sidebar_label: Validation
---

# Configuration Validation

## Overview

The starter kit implements robust configuration validation to ensure that your application has all the required environment variables and that they are of the correct type. This helps catch configuration errors early, preventing runtime issues caused by missing or incorrect configuration.

## Validation with Joi

The starter kit uses [Joi](https://joi.dev/) for validating environment variables. Joi is a powerful schema description language and data validator for JavaScript.

### Basic Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        // More validations...
      }),
      validationOptions: {
        abortEarly: false, // Report all validation errors, not just the first one
        allowUnknown: true, // Allow unknown environment variables
      },
    }),
    // Other modules...
  ],
})
export class AppModule {}
```

## Comprehensive Validation Schema

The starter kit includes a comprehensive validation schema that covers all required environment variables:

```typescript
// validation/config.validation.ts
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('0.0.0.0'),
  APP_NAME: Joi.string().default('NestJS Starter'),
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('v1'),
  CORS_ENABLED: Joi.boolean().default(true),
  CORS_ORIGINS: Joi.string().default('*'),
  
  // Database
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(true),
  DB_SSL: Joi.boolean().default(false),
  
  // Authentication
  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRATION: Joi.string().default('1d'),
  REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  
  // Email
  MAIL_HOST: Joi.string().when('MAIL_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  MAIL_PORT: Joi.number().when('MAIL_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  MAIL_USER: Joi.string().when('MAIL_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  MAIL_PASSWORD: Joi.string().when('MAIL_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  MAIL_FROM: Joi.string().when('MAIL_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  MAIL_ENABLED: Joi.boolean().default(false),
  
  // Rate limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
  
  // Redis
  REDIS_ENABLED: Joi.boolean().default(false),
  REDIS_HOST: Joi.string().when('REDIS_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  REDIS_PORT: Joi.number().when('REDIS_ENABLED', {
    is: true,
    then: Joi.required(),
  }),
  REDIS_PASSWORD: Joi.string().allow('').when('REDIS_ENABLED', {
    is: true,
    then: Joi.optional(),
  }),
  REDIS_DB: Joi.number().when('REDIS_ENABLED', {
    is: true,
    then: Joi.default(0),
  }),
});
```

### Using the Validation Schema

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './validation/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
    // Other modules...
  ],
})
export class AppModule {}
```

## Conditional Validation

Some environment variables are only required under certain conditions. For example, email configuration variables are only required when email functionality is enabled:

```typescript
// Conditional validation example
MAIL_HOST: Joi.string().when('MAIL_ENABLED', {
  is: true,
  then: Joi.required(),
}),
```

## Environment-Specific Validation

You can also have different validation rules for different environments:

```typescript
const developmentSchema = Joi.object({
  // Development-specific validations
  DB_SYNCHRONIZE: Joi.boolean().default(true),
  DB_LOGGING: Joi.boolean().default(true),
});

const productionSchema = Joi.object({
  // Production-specific validations
  DB_SYNCHRONIZE: Joi.boolean().valid(false).default(false),
  SSL_ENABLED: Joi.boolean().valid(true).required(),
});

const baseSchema = Joi.object({
  // Common validations
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  // Other validations...
});

export const getValidationSchema = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return baseSchema.concat(productionSchema);
  }
  
  return baseSchema.concat(developmentSchema);
};
```

Then use it in your module:

```typescript
ConfigModule.forRoot({
  validationSchema: getValidationSchema(),
  // Other options...
})
```

## Type Transformation

Joi can also transform values to the correct type. For example, converting string values to numbers or booleans:

```typescript
PORT: Joi.number().default(3000), // Converts '3000' to 3000
DB_SYNCHRONIZE: Joi.boolean().default(false), // Converts 'true' to true
```

## Custom Error Messages

You can provide custom error messages for better clarity:

```typescript
JWT_SECRET: Joi.string()
  .required()
  .min(32)
  .messages({
    'string.min': 'JWT_SECRET should be at least 32 characters long for security',
    'any.required': 'JWT_SECRET is required for authentication to work',
  }),
```

## Validation in Action

When the application starts, the `ConfigModule` validates all environment variables against the schema. If validation fails, the application will not start, and an error is displayed:

```
Error: Config validation error: "DB_HOST" is required. "DB_USERNAME" is required. "JWT_SECRET" is required and must be at least 32 characters long for security
```

## Beyond Environment Variables

The validation approach can be extended to other configuration sources:

### JSON Configuration Files

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          const configPath = `${process.cwd()}/config/${process.env.NODE_ENV || 'development'}.json`;
          const config = require(configPath);
          return config;
        },
      ],
      validate: (config: Record<string, unknown>) => {
        const validatedConfig = configValidationSchema.validate(config, {
          allowUnknown: true,
          abortEarly: false,
        });
        
        if (validatedConfig.error) {
          throw new Error(`Config validation error: ${validatedConfig.error.message}`);
        }
        
        return validatedConfig.value;
      },
    }),
  ],
})
export class AppModule {}
```

### Runtime Configuration Validation

You can also validate configuration at runtime when accessing it:

```typescript
@Injectable()
export class ConfigValidator {
  constructor(private configService: ConfigService) {}

  validateDatabaseConfig(): void {
    const dbConfig = {
      type: this.configService.get('database.type'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
    };
    
    const schema = Joi.object({
      type: Joi.string().required(),
      host: Joi.string().required(),
      port: Joi.number().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      database: Joi.string().required(),
    });
    
    const { error } = schema.validate(dbConfig);
    
    if (error) {
      throw new Error(`Database config validation error: ${error.message}`);
    }
  }
}
```

## Best Practices

1. **Validate All Required Variables**: Ensure all required environment variables are included in the validation schema.

2. **Provide Sensible Defaults**: Where appropriate, provide default values for non-critical configuration.

3. **Use Strong Types**: Validate that variables are of the correct type (string, number, boolean, etc.).

4. **Validate Formats**: For variables with specific format requirements (e.g., emails, URLs), use Joi's format validation.

5. **Group Related Variables**: Organize validation by feature or module for better maintainability.

6. **Fail Fast**: Validate configuration at application startup to catch issues early.

7. **Custom Error Messages**: Provide clear error messages that explain what's wrong and how to fix it.

8. **Document Requirements**: Alongside validation, maintain documentation (like `.env.example`) to explain required variables.

## Validation and Security

Configuration validation is also a security measure:

1. **Prevent Weak Secrets**: Validate that secrets (like JWT_SECRET) meet minimum length and complexity requirements.

2. **Disallow Insecure Configurations**: In production, enforce secure configurations (like disabling DB_SYNCHRONIZE).

3. **Type Safety**: Ensure numeric values aren't accidentally treated as strings, which could lead to security issues.

## Troubleshooting

If your application fails to start due to configuration validation:

1. Check the error message to identify missing or invalid variables.
2. Refer to the `.env.example` file for the expected format.
3. Ensure all required variables are set for your environment.
4. Verify that variables match the expected types (numbers, booleans, etc.).
5. For conditional validations, make sure related variables are properly set. 
---
id: swagger
title: Swagger Documentation
sidebar_label: Swagger
---

# Swagger Documentation

## Overview

The starter kit integrates Swagger (OpenAPI) to provide interactive API documentation that's always in sync with your codebase. This makes it easier for developers to understand, test, and consume your APIs.

## Swagger Setup

The starter kit configures Swagger using the `@nestjs/swagger` package:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter API')
    .setDescription('API documentation for the NestJS Starter Kit')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(3000);
}
bootstrap();
```

## Accessing Swagger UI

Once your application is running, you can access the Swagger UI at:

```
http://localhost:3000/api-docs
```

This provides an interactive interface where you can:
- Browse all available endpoints
- View request/response schemas
- Execute API calls directly from the browser
- View authentication requirements

## Documenting Controllers and DTOs

### Controller Documentation

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User has been successfully created',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all users',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.usersService.findAll();
  }
}
```

### DTO Documentation

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'The password of the user',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user is active',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### Entity Documentation

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: false,
    description: 'Whether the user is active',
  })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The date when the user was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The date when the user was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Note: Password field is excluded from Swagger docs for security
  @Column()
  password: string;
}
```

## Authentication Documentation

### Configuring Authentication in Swagger

```typescript
// Add Bearer Authentication support
const config = new DocumentBuilder()
  // ... other configuration
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'access-token', // This is a reference name used to tag endpoints
  )
  .build();
```

### Securing Endpoints in Swagger

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiOperation({ summary: 'Get user profile' })
@ApiResponse({ 
  status: 200, 
  description: 'Returns the user profile',
  type: User,
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
getProfile(@Request() req) {
  return req.user;
}
```

## Advanced Swagger Configuration

### Custom Response Schema

```typescript
export class PaginatedUsersResponse {
  @ApiProperty({ type: [User] })
  data: User[];

  @ApiProperty({
    type: 'object',
    example: {
      total: 100,
      limit: 10,
      offset: 0,
    },
  })
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

@Get()
@ApiResponse({
  status: 200,
  description: 'Returns paginated users',
  type: PaginatedUsersResponse,
})
async findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedUsersResponse> {
  // Implementation
}
```

### Grouping Endpoints

```typescript
// Group endpoints by functionality
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  // Authentication endpoints
}

@ApiTags('user-management')
@Controller('users')
export class UsersController {
  // User management endpoints
}

@ApiTags('user-management')
@Controller('roles')
export class RolesController {
  // Roles management endpoints (same tag for grouping)
}
```

### Swagger Plugin

You can also enable the Swagger plugin in your `nest-cli.json` for automatic documentation:

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "classValidatorShim": true,
          "introspectComments": true
        }
      }
    ]
  }
}
```

## Security Considerations

### Securing Swagger UI in Production

For production environments, you might want to secure the Swagger UI:

```typescript
if (process.env.NODE_ENV !== 'production') {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
} else {
  // In production, add password protection or disable Swagger
  const document = SwaggerModule.createDocument(app, config);
  
  // Option 1: Password protection
  app.use('/api-docs', (req, res, next) => {
    const auth = { login: process.env.SWAGGER_USER, password: process.env.SWAGGER_PASSWORD };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    
    if (login && password && login === auth.login && password === auth.password) {
      return next();
    }
    
    res.set('WWW-Authenticate', 'Basic realm="Swagger Documentation"');
    res.status(401).send('Authentication required.');
  });
  
  SwaggerModule.setup('api-docs', app, document);
  
  // Option 2: Disable Swagger completely
  // Do nothing, which makes Swagger unavailable
}
```

### Hiding Sensitive Information

Use the `@ApiHideProperty()` decorator to hide sensitive fields from the Swagger documentation:

```typescript
import { ApiHideProperty } from '@nestjs/swagger';

export class User {
  // Visible fields...
  
  @ApiHideProperty()
  @Column()
  password: string;
  
  @ApiHideProperty()
  @Column({ nullable: true })
  refreshToken: string;
}
```

## Best Practices

1. **Keep Documentation Updated**: Update Swagger annotations when you change your API
2. **Use Tags Consistently**: Organize endpoints with consistent tagging
3. **Document Error Responses**: Include all possible response status codes
4. **Add Examples**: Include example values for better understanding
5. **Document Authentication**: Clearly indicate which endpoints require authentication
6. **Use Operation IDs**: Add unique operation IDs for easier API client generation
7. **Include Descriptions**: Add detailed descriptions to complex endpoints and parameters 
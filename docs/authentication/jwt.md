---
id: jwt
title: JWT Authentication
sidebar_label: JWT Authentication
---

# JWT Authentication

## Overview

JSON Web Tokens (JWT) provide a stateless authentication mechanism for your NestJS application. The starter kit comes with a fully implemented JWT authentication system that handles user registration, login, and protected route access.

## Configuration

JWT authentication is configured in the `.env` file:

```env
# JWT Settings
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=1d
```

- `JWT_SECRET`: A secure random string used to sign the JWT tokens
- `JWT_EXPIRATION`: Token expiration time (1d = one day)

## Implementation Details

### Auth Module

The authentication logic is contained in the `auth` module:

```typescript
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    // Other imports...
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### JWT Strategy

The JWT strategy is implemented using Passport.js:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

## Usage

### Login

```typescript
// POST /auth/login
@Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(loginDto.email, loginDto.password);
  
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  return this.authService.generateToken(user);
}
```

### Protecting Routes

Use the `@UseGuards(JwtAuthGuard)` decorator to protect your routes:

```typescript
// Get user profile (protected route)
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req) {
  return req.user;
}
```

## Token Refresh

The starter kit includes a token refresh mechanism to maintain user sessions:

```typescript
@Post('refresh')
@UseGuards(JwtRefreshGuard)
async refreshToken(@Request() req) {
  return this.authService.refreshToken(req.user);
}
```

## Best Practices

1. **Store tokens securely**: On the client-side, store tokens in secure HTTP-only cookies or secure storage mechanisms.
2. **Set appropriate expiration**: Balance security and user experience when setting token expiration times.
3. **Use HTTPS**: Always serve your API over HTTPS to prevent token interception.
4. **Implement token revocation**: Consider implementing a token blacklist for critical applications. 
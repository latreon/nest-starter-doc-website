---
id: rate-limiting
title: Rate Limiting
sidebar_label: Rate Limiting
---

# Rate Limiting

## Overview

Rate limiting is a crucial security feature that protects your API from abuse, brute force attacks, and denial of service attacks. The starter kit includes a configurable rate limiting system based on the `@nestjs/throttler` package.

## Configuration

Configure rate limiting in your `.env` file:

```env
# Rate limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

- `THROTTLE_TTL`: Time window in seconds (60 seconds = 1 minute)
- `THROTTLE_LIMIT`: Maximum number of requests allowed in the time window

## Implementation

### Global Rate Limiting

The starter kit configures rate limiting at the application level:

```typescript
// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL', 60),
        limit: config.get<number>('THROTTLE_LIMIT', 10),
      }),
    }),
    // Other imports...
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Other providers...
  ],
})
export class AppModule {}
```

### Custom Storage

The starter kit includes a Redis-based storage for rate limiting in distributed environments:

```typescript
// redis-throttler.storage.ts
@Injectable()
export class RedisThrottlerStorage extends ThrottlerStorage {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {
    super();
  }

  async increment(key: string, ttl: number): Promise<number> {
    const multi = this.redisClient.multi();
    multi.incr(key);
    multi.expire(key, ttl);
    const results = await multi.exec();
    return results[0][1];
  }

  async get(key: string): Promise<number> {
    const value = await this.redisClient.get(key);
    return value ? parseInt(value, 10) : 0;
  }
}
```

To use Redis storage, update your ThrottlerModule configuration:

```typescript
ThrottlerModule.forRootAsync({
  imports: [ConfigModule, RedisModule],
  inject: [ConfigService, 'REDIS_CLIENT'],
  useFactory: (config: ConfigService, redisClient: Redis) => ({
    ttl: config.get<number>('THROTTLE_TTL', 60),
    limit: config.get<number>('THROTTLE_LIMIT', 10),
    storage: new RedisThrottlerStorage(redisClient),
  }),
}),
```

## Route-Specific Rate Limiting

### Customize Rate Limits for Specific Routes

```typescript
@Controller('auth')
export class AuthController {
  // More restrictive rate limiting for login attempts
  @Post('login')
  @Throttle(5, 60) // 5 requests per minute
  async login(@Body() loginDto: LoginDto) {
    // Login logic...
  }

  // Regular rate limiting inherited from global config
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Registration logic...
  }
}
```

### Exclude Routes from Rate Limiting

```typescript
@Controller('public')
@SkipThrottle()
export class PublicController {
  // These routes will not be rate limited
  @Get('health')
  health() {
    return { status: 'UP' };
  }
  
  // Override for a specific route
  @Post('feedback')
  @Throttle(2, 60)
  submitFeedback(@Body() feedbackDto: FeedbackDto) {
    // Rate limited to 2 requests per minute
  }
}
```

## Custom Rate Limiting Strategies

The starter kit supports different rate limiting strategies:

### IP-Based Rate Limiting (Default)

```typescript
@Injectable()
export class IpThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    return req.ip;
  }
}
```

### User-Based Rate Limiting

```typescript
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    // Rate limit by user ID if authenticated, fall back to IP
    return req.user?.id || req.ip;
  }
}
```

### Endpoint-Based Rate Limiting

```typescript
@Injectable()
export class EndpointThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    // Rate limit by endpoint and IP
    return `${req.method}-${req.url}-${req.ip}`;
  }
}
```

## Response Handling

The starter kit customizes the rate limit response:

```typescript
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(context: ExecutionContext): void {
    const request = context.switchToHttp().getRequest();
    const ttl = this.getTimeToLive(request);
    
    throw new ThrottlerException({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: 'Rate limit exceeded',
      retryAfter: ttl,
    });
  }
}
```

## Headers

Rate limit information is included in response headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed in the time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current time window
- `X-RateLimit-Reset`: Time when the rate limit resets (in seconds)

## Best Practices

1. **Set Different Limits for Different Endpoints**: Apply stricter limits on sensitive operations like authentication
2. **Use Redis for Distributed Environments**: Ensure consistent rate limiting across multiple application instances
3. **Monitor Rate Limit Events**: Log when rate limits are reached to identify potential attacks
4. **Combine with Other Security Measures**: Use rate limiting alongside other security features like CAPTCHA for login attempts
5. **Consider User Experience**: Set reasonable limits that don't impact legitimate users
6. **Implement Backoff Strategy**: Inform clients how long to wait before retrying via the `Retry-After` header

## Example: Progressive Rate Limiting

For better user experience, the starter kit also supports progressive rate limiting:

```typescript
@Injectable()
export class ProgressiveThrottlerService {
  private readonly failedAttempts = new Map<string, number>();

  getLimit(key: string): number {
    const attempts = this.failedAttempts.get(key) || 0;
    
    // Progressively reduce limit based on failed attempts
    if (attempts > 10) return 1;  // 1 request per minute
    if (attempts > 5) return 3;   // 3 requests per minute
    return 10;                    // 10 requests per minute
  }

  incrementFailedAttempts(key: string): void {
    const current = this.failedAttempts.get(key) || 0;
    this.failedAttempts.set(key, current + 1);
  }

  resetFailedAttempts(key: string): void {
    this.failedAttempts.delete(key);
  }
}
``` 
---
id: api-key
title: API Key Authentication
sidebar_label: API Key Authentication
---

# API Key Authentication

## Overview

API key authentication provides a simple way to secure machine-to-machine or service-to-service communications. The starter kit includes a complete API key authentication system for non-user API access.

## Features

- Generate secure, random API keys
- Assign scopes and permissions to API keys
- Automatic key rotation and expiration
- Rate limiting per API key
- Detailed usage tracking

## Implementation

### API Key Entity

```typescript
@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  key: string;

  @Column({ type: 'json' })
  scopes: string[];

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => User, user => user.apiKeys)
  user: User;
}
```

### API Key Service

```typescript
@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
    private configService: ConfigService,
  ) {}

  generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }

  async createApiKey(
    userId: string,
    createApiKeyDto: CreateApiKeyDto,
  ): Promise<ApiKey> {
    const key = this.generateApiKey();
    
    const apiKey = this.apiKeyRepository.create({
      name: createApiKeyDto.name,
      key: await this.hashApiKey(key),
      scopes: createApiKeyDto.scopes,
      expiresAt: createApiKeyDto.expiresAt,
      user: { id: userId },
    });
    
    await this.apiKeyRepository.save(apiKey);
    
    // Return the plaintext key (only time it's available)
    apiKey.key = key;
    return apiKey;
  }

  async validateApiKey(key: string): Promise<ApiKey | null> {
    const hashedKey = await this.hashApiKey(key);
    
    const apiKey = await this.apiKeyRepository.findOne({
      where: {
        key: hashedKey,
        isActive: true,
      },
      relations: ['user'],
    });
    
    if (!apiKey) {
      return null;
    }
    
    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return null;
    }
    
    return apiKey;
  }

  private async hashApiKey(key: string): Promise<string> {
    // Using a simple hash for demo purposes
    // In production, consider a more secure hashing method
    return createHash('sha256').update(key).digest('hex');
  }
}
```

## Usage

### API Key Guard

```typescript
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private apiKeyService: ApiKeyService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);
    
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }
    
    const validApiKey = await this.apiKeyService.validateApiKey(apiKey);
    
    if (!validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    // Check required scopes
    const requiredScopes = this.reflector.get<string[]>(
      'scopes',
      context.getHandler(),
    );
    
    if (requiredScopes && !this.hasRequiredScopes(validApiKey.scopes, requiredScopes)) {
      throw new ForbiddenException('Insufficient API key permissions');
    }
    
    // Attach API key and associated user to request
    request.apiKey = validApiKey;
    request.user = validApiKey.user;
    
    return true;
  }

  private extractApiKey(request: Request): string | undefined {
    const apiKey = request.headers['x-api-key'] as string;
    return apiKey;
  }

  private hasRequiredScopes(
    apiKeyScopes: string[],
    requiredScopes: string[],
  ): boolean {
    return requiredScopes.every(scope => apiKeyScopes.includes(scope));
  }
}
```

### Protecting Routes with API Key

```typescript
@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiKeyScopeRequired(['data:read'])
  async getData() {
    return this.dataService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiKeyScopeRequired(['data:write'])
  async createData(@Body() createDataDto: CreateDataDto) {
    return this.dataService.create(createDataDto);
  }
}
```

## Managing API Keys

### Creating API Keys

```typescript
@Post('api-keys')
@UseGuards(JwtAuthGuard)
async createApiKey(
  @Request() req,
  @Body() createApiKeyDto: CreateApiKeyDto,
) {
  const apiKey = await this.apiKeyService.createApiKey(
    req.user.id,
    createApiKeyDto,
  );
  
  return apiKey;
}
```

### Revoking API Keys

```typescript
@Delete('api-keys/:id')
@UseGuards(JwtAuthGuard)
async revokeApiKey(
  @Request() req,
  @Param('id') id: string,
) {
  return this.apiKeyService.revokeApiKey(req.user.id, id);
}
```

## Best Practices

1. **Store API keys securely**: Never store plaintext API keys in your code or version control
2. **Set appropriate scopes**: Follow the principle of least privilege
3. **Implement key rotation**: Encourage regular API key rotation
4. **Add rate limiting**: Protect your API from abuse
5. **Track usage**: Monitor API key usage for security and billing purposes 
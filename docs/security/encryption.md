---
id: encryption
title: Encryption
sidebar_label: Encryption
---

# Encryption

## Overview

The starter kit provides built-in encryption capabilities to secure sensitive data both at rest and in transit. This documentation covers the encryption techniques and utilities implemented in the starter kit.

## Configuration

Configure encryption settings in your `.env` file:

```env
# Encryption settings
ENCRYPTION_KEY=your_32_character_encryption_key
ENCRYPTION_IV=your_16_character_initialization_vector
```

## Encryption Service

The `EncryptionService` provides methods for encrypting and decrypting data using AES-256-CBC encryption.

```typescript
@Injectable()
export class EncryptionService {
  constructor(private configService: ConfigService) {}

  private getEncryptionKey(): Buffer {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key || key.length !== 32) {
      throw new Error('Invalid encryption key');
    }
    return Buffer.from(key);
  }

  private getEncryptionIv(): Buffer {
    const iv = this.configService.get<string>('ENCRYPTION_IV');
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid encryption IV');
    }
    return Buffer.from(iv);
  }

  encrypt(text: string): string {
    const cipher = createCipheriv(
      'aes-256-cbc',
      this.getEncryptionKey(),
      this.getEncryptionIv(),
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      this.getEncryptionKey(),
      this.getEncryptionIv(),
    );
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## TypeORM Encryption Transformer

The starter kit includes a custom TypeORM transformer to automatically encrypt/decrypt entity fields:

```typescript
export class EncryptionTransformer {
  constructor(private encryptionService: EncryptionService) {}

  to(value: string): string {
    if (value === null || value === undefined) {
      return value;
    }
    return this.encryptionService.encrypt(value);
  }

  from(value: string): string {
    if (value === null || value === undefined) {
      return value;
    }
    return this.encryptionService.decrypt(value);
  }
}
```

## Usage

### Encrypting Entity Fields

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  // Automatically encrypted in the database
  @Column({
    transformer: new EncryptionTransformer(Container.get(EncryptionService)),
  })
  ssn: string;

  // Other fields...
}
```

### Manual Encryption

```typescript
@Injectable()
export class UserService {
  constructor(private encryptionService: EncryptionService) {}

  async storeSecureData(userId: string, data: string): Promise<void> {
    const encryptedData = this.encryptionService.encrypt(data);
    // Store encrypted data...
  }

  async getSecureData(userId: string): Promise<string> {
    // Retrieve encrypted data...
    const encryptedData = '...';
    return this.encryptionService.decrypt(encryptedData);
  }
}
```

## Security Best Practices

1. **Key Management**:
   - Never hardcode encryption keys in your source code
   - Use environment variables or a secure key management service
   - Rotate keys periodically

2. **Securing Environment Variables**:
   - Use `.env` files only for development
   - For production, use secure environment variable management
   - Consider using a secrets manager like AWS Secrets Manager, HashiCorp Vault, etc.

3. **Transport Layer Security**:
   - Always deploy your application with HTTPS
   - Use appropriate SSL/TLS configurations
   - Consider using HSTS (HTTP Strict Transport Security)

4. **Data Access Controls**:
   - Implement proper authorization before accessing encrypted data
   - Log all encryption/decryption operations for audit purposes
   - Implement monitoring for suspicious decryption activities

## Key Rotation

The starter kit includes utilities to help with encryption key rotation:

```typescript
@Injectable()
export class KeyRotationService {
  constructor(
    private oldEncryptionService: EncryptionService,
    private newEncryptionService: EncryptionService,
    private dataRepository: Repository<EncryptedData>,
  ) {}

  async rotateKeys(): Promise<void> {
    const encryptedData = await this.dataRepository.find();
    
    for (const data of encryptedData) {
      const decrypted = this.oldEncryptionService.decrypt(data.value);
      const reEncrypted = this.newEncryptionService.encrypt(decrypted);
      
      data.value = reEncrypted;
      await this.dataRepository.save(data);
    }
  }
}
```

## Testing Encryption

The starter kit includes testing utilities for verifying encryption:

```typescript
describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'ENCRYPTION_KEY') return 'a'.repeat(32);
              if (key === 'ENCRYPTION_IV') return 'b'.repeat(16);
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should encrypt and decrypt data correctly', () => {
    const data = 'sensitive information';
    const encrypted = service.encrypt(data);
    
    expect(encrypted).not.toEqual(data);
    expect(service.decrypt(encrypted)).toEqual(data);
  });
});
``` 
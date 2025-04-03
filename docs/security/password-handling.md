---
id: password-handling
title: Password Handling
sidebar_label: Password Handling
---

# Password Handling

## Overview

The starter kit implements secure password handling using industry best practices. This includes secure storage, validation, and recovery mechanisms.

## Password Hashing

Passwords are hashed using bcrypt with a configurable work factor:

```typescript
@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  private get saltRounds(): number {
    return this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12);
  }

  async hash(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
```

### Configuration

Set the bcrypt salt rounds in your `.env` file:

```env
BCRYPT_SALT_ROUNDS=12
```

Higher values provide better security but slower performance.

## Implementation in User Entity

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Password reset fields
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  // Method to validate password
  async validatePassword(password: string): Promise<boolean> {
    const passwordService = Container.get(PasswordService);
    return passwordService.compare(password, this.password);
  }
}
```

## Password Policy Enforcement

The starter kit includes a customizable password policy:

```typescript
@Injectable()
export class PasswordPolicyService {
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters long',
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one number',
      };
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one special character',
      };
    }

    return { valid: true };
  }
}
```

## Password Validation Pipe

The starter kit includes a validation pipe for password fields:

```typescript
@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  constructor(private passwordPolicyService: PasswordPolicyService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.data === 'password') {
      const validation = this.passwordPolicyService.validatePassword(value);
      
      if (!validation.valid) {
        throw new BadRequestException(validation.message);
      }
    }
    
    return value;
  }
}
```

## Password Reset Flow

### 1. Generate Reset Token

```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private mailerService: MailerService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return; // Don't reveal if email exists or not
    }
    
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiration
    
    await this.usersService.setResetPasswordToken(
      user.id,
      resetToken,
      resetExpires,
    );
    
    // Send email with reset link
    await this.mailerService.sendPasswordResetEmail(
      user.email,
      resetToken,
    );
  }
}
```

### 2. Validate Reset Token

```typescript
async validateResetToken(token: string): Promise<User | null> {
  const user = await this.usersService.findByResetToken(token);
  
  if (!user) {
    return null;
  }
  
  // Check if token is expired
  if (new Date() > user.resetPasswordExpires) {
    return null;
  }
  
  return user;
}
```

### 3. Reset Password

```typescript
async resetPassword(token: string, newPassword: string): Promise<boolean> {
  const user = await this.validateResetToken(token);
  
  if (!user) {
    return false;
  }
  
  const hashedPassword = await this.passwordService.hash(newPassword);
  
  await this.usersService.updatePassword(
    user.id,
    hashedPassword,
    null, // Clear reset token
    null, // Clear reset expiration
  );
  
  return true;
}
```

## Password Change

```typescript
async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const user = await this.usersService.findById(userId);
  
  if (!user) {
    return false;
  }
  
  const isPasswordValid = await user.validatePassword(currentPassword);
  
  if (!isPasswordValid) {
    return false;
  }
  
  const hashedNewPassword = await this.passwordService.hash(newPassword);
  
  await this.usersService.updatePassword(
    userId,
    hashedNewPassword,
    null,
    null,
  );
  
  return true;
}
```

## Password History

For additional security, the starter kit can track password history to prevent reuse:

```typescript
@Entity('password_history')
export class PasswordHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### Preventing Password Reuse

```typescript
async isPasswordReused(
  userId: string,
  newPassword: string,
): Promise<boolean> {
  const history = await this.passwordHistoryRepository.find({
    where: { user: { id: userId } },
    order: { createdAt: 'DESC' },
    take: 5, // Check against last 5 passwords
  });
  
  for (const entry of history) {
    const isMatch = await this.passwordService.compare(
      newPassword,
      entry.password,
    );
    
    if (isMatch) {
      return true;
    }
  }
  
  return false;
}
```

## Security Best Practices

1. **Never store plaintext passwords**: Always hash passwords with bcrypt.
2. **Use strong salt values**: The default salt rounds (12) provide a good balance of security and performance.
3. **Implement account lockout**: Lock accounts after multiple failed login attempts.
4. **Avoid leaking information**: Don't reveal if an email exists in password reset flows.
5. **Rate limit password attempts**: Prevent brute force attacks by rate limiting login and reset attempts.
6. **Force password rotation**: For sensitive applications, force password changes periodically.
7. **Check against common passwords**: Prevent users from using well-known weak passwords.
8. **Use multi-factor authentication**: For additional security, implement 2FA as described in the authentication section. 
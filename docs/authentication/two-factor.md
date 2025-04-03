---
id: two-factor
title: Two-Factor Authentication
sidebar_label: Two-Factor Authentication
---

# Two-Factor Authentication

## Overview

Two-Factor Authentication (2FA) adds an extra layer of security to your application by requiring a second verification step beyond just a password. The starter kit implements 2FA using Time-based One-Time Passwords (TOTP).

## Features

- QR code generation for easy setup with authenticator apps
- Secret key backup options for recovery
- Toggle 2FA on/off per user
- Remember-device functionality (optional)

## Implementation

The 2FA implementation uses the `otplib` package which provides TOTP generation compatible with Google Authenticator, Authy, and other authenticator apps.

### Dependencies

```json
{
  "dependencies": {
    "otplib": "^12.0.1",
    "qrcode": "^1.5.0"
  }
}
```

### Two-Factor Service

```typescript
@Injectable()
export class TwoFactorService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async generateTwoFactorSecret(user: User) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.get<string>('APP_NAME');
    
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      appName,
      secret,
    );
    
    await this.usersService.setTwoFactorSecret(user.id, secret);
    
    return {
      secret,
      otpAuthUrl,
    };
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  verifyTwoFactorCode(twoFactorCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: user.twoFactorSecret,
    });
  }
}
```

## Usage Flow

### Step 1: Enable 2FA

```typescript
@Post('2fa/enable')
@UseGuards(JwtAuthGuard)
async enableTwoFactor(@Request() req) {
  const { secret, otpAuthUrl } = await this.twoFactorService
    .generateTwoFactorSecret(req.user);
    
  const qrCodeDataURL = await this.twoFactorService
    .generateQrCodeDataURL(otpAuthUrl);
    
  return {
    secret,
    qrCodeDataURL,
  };
}
```

### Step 2: Verify and Activate

```typescript
@Post('2fa/verify')
@UseGuards(JwtAuthGuard)
async verifyAndActivate(
  @Request() req,
  @Body() body: { twoFactorCode: string },
) {
  const isValid = this.twoFactorService.verifyTwoFactorCode(
    body.twoFactorCode,
    req.user,
  );
  
  if (!isValid) {
    throw new UnauthorizedException('Invalid two-factor code');
  }
  
  await this.usersService.enableTwoFactor(req.user.id);
  
  return { message: 'Two-factor authentication has been enabled' };
}
```

### Step 3: Login with 2FA

```typescript
@Post('2fa/authenticate')
@UseGuards(JwtTwoFactorGuard)
async authenticate(
  @Request() req,
  @Body() body: { twoFactorCode: string },
) {
  const isValid = this.twoFactorService.verifyTwoFactorCode(
    body.twoFactorCode,
    req.user,
  );
  
  if (!isValid) {
    throw new UnauthorizedException('Invalid two-factor code');
  }
  
  return this.authService.generateTwoFactorToken(req.user);
}
```

## Security Considerations

1. **Secret Storage**: Store 2FA secrets securely using encryption in your database
2. **Account Recovery**: Implement backup codes or alternate recovery methods
3. **Rate Limiting**: Limit 2FA verification attempts to prevent brute-force attacks
4. **Trusted Devices**: Consider adding "remember this device" functionality for better UX

## User Experience Tips

- Provide clear setup instructions with both QR code and manual entry options
- Explain the importance of saving backup codes
- Confirm the user has set up 2FA correctly before fully enabling it
- Offer support for multiple authenticator apps 
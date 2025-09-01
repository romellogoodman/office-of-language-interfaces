# API Security & Middleware

This document explains the security implementation for API routes in the Oli website.

## Overview

The API security system provides rate limiting, origin validation, request validation, and logging through reusable middleware components.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Request   │───▶│  API Middleware  │───▶│  Route Handler  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Security Checks │
                    │                  │
                    │ • Origin         │
                    │ • Rate Limiting  │
                    │ • Validation     │
                    │ • Logging        │
                    └──────────────────┘
```

## Components

### 1. API Middleware (`src/lib/api-middleware.ts`)

The core middleware system that wraps API routes with security checks.

#### Functions

- **`withApiMiddleware(request, handler, options)`** - Configurable middleware
- **`withFullProtection(request, handler)`** - Full security suite
- **`withRateLimitOnly(request, handler)`** - Rate limiting only

#### Options

```typescript
interface MiddlewareOptions {
  requireOriginValidation?: boolean;  // Check allowed origins
  requireRateLimit?: boolean;         // Apply rate limits
  logErrors?: boolean;                // Log errors and violations
}
```

### 2. Rate Limiting (`src/lib/rate-limiter.ts`)

In-memory rate limiting with IP and global limits.

#### Configuration

- **Global Limit**: 100 requests/minute across all users
- **Per-IP Limit**: 20 requests/minute per IP address
- **Window**: 60 seconds (1 minute)
- **Cleanup**: Automatic cleanup every 5 minutes

#### API

```typescript
const result = ipRateLimiter.check(clientIP);
// Returns: { allowed: boolean, remaining: number, resetTime: number }
```

### 3. Origin Validation (`src/lib/origin-validator.ts`)

Whitelist-based origin validation to prevent unauthorized access.

#### Allowed Origins

- `http://localhost:3000` (development)
- `https://localhost:3000` (development SSL)  
- `https://oli.software` (production)
- `https://www.oli.software` (www subdomain)

#### Behavior

- Checks both `Origin` and `Referer` headers
- Allows requests with no origin/referer (for server-to-server)
- Logs blocked attempts for monitoring

### 4. Request Validation (`src/lib/request-validator.ts`)

Content validation and sanitization for Claude API requests.

#### Validation Rules

- **Prompt Length**: 1-4000 characters
- **Allowed Models**: Specific Claude model whitelist
- **Blocked Patterns**: Anti-jailbreak and harmful content detection
- **Sanitization**: Trim and clean input

#### Blocked Patterns

- Jailbreak attempts (`jailbreak`, `ignore instructions`)
- Role-playing attacks (`you are now`, `pretend you are`)
- Malicious requests (`generate malware`, `create virus`)

## Usage Examples

### Full Protection (Claude API)

```typescript
import { withFullProtection } from '@/lib/api-middleware';

export async function POST(request: NextRequest) {
  return withFullProtection(request, async ({ clientIP, body }) => {
    // Your secure route logic here
    const { prompt, model } = body;
    
    // Validation, rate limiting, and origin checking are automatic
    const response = await callClaudeAPI(prompt, model);
    
    return NextResponse.json({ response });
  });
}
```

### Rate Limiting Only (Internal APIs)

```typescript
import { withRateLimitOnly } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRateLimitOnly(request, async () => {
    // Internal API logic - no origin validation needed
    const data = await getInternalData();
    
    return NextResponse.json(data);
  });
}
```

### Custom Configuration

```typescript
import { withApiMiddleware } from '@/lib/api-middleware';

export async function POST(request: NextRequest) {
  return withApiMiddleware(request, async ({ clientIP, body }) => {
    // Custom logic
  }, {
    requireOriginValidation: false,  // Skip origin check
    requireRateLimit: true,          // Keep rate limiting
    logErrors: false                 // Disable error logging
  });
}
```

## Security Features

### ✅ Protection Against

- **Rate Limiting**: Prevents API abuse and excessive usage
- **Origin Validation**: Blocks unauthorized domains
- **Content Filtering**: Prevents jailbreak and malicious prompts
- **Input Validation**: Ensures proper request format and limits

### ⚠️ Limitations

- **In-Memory Storage**: Rate limits reset on server restart
- **Bypassable Origins**: Determined attackers can spoof headers
- **Pattern Matching**: Basic content filtering may miss sophisticated attempts

### 📊 Monitoring

- **Error Logging**: Failed requests and security violations
- **Rate Limit Headers**: `retryAfter` in 429 responses  
- **IP Tracking**: Request counts per IP address
- **Pattern Detection**: Blocked content attempts

## Response Formats

### Success Response
```json
{
  "response": "API response data",
  "remaining": 15
}
```

### Rate Limit Exceeded
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

### Origin Blocked
```json
{
  "error": "Unauthorized origin"
}
```

### Validation Failed
```json
{
  "error": "Prompt exceeds maximum length of 4000 characters"
}
```

## Best Practices

1. **Use `withFullProtection`** for public APIs that access external services
2. **Use `withRateLimitOnly`** for internal APIs that don't need origin validation
3. **Monitor logs** for security violations and adjust limits as needed
4. **Update allowed origins** when deploying to new domains
5. **Review blocked patterns** periodically to catch new attack vectors

## Deployment Notes

- Set `ANTHROPIC_API_KEY` environment variable
- Monitor API usage costs through rate limiting logs  
- Consider upgrading to Redis-based rate limiting for production scale
- Update allowed origins list for new deployment domains
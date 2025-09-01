import { NextRequest, NextResponse } from 'next/server';
import { globalRateLimiter, ipRateLimiter, getClientIP } from '@/lib/rate-limiter';
import { validateOrigin } from '@/lib/origin-validator';
import { logRequest } from '@/lib/request-validator';

export interface MiddlewareContext {
  clientIP: string;
  body: Record<string, unknown>;
}

export interface MiddlewareOptions {
  requireOriginValidation?: boolean;
  requireRateLimit?: boolean;
  logErrors?: boolean;
}

export async function withApiMiddleware(
  request: NextRequest,
  handler: (context: MiddlewareContext) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
): Promise<NextResponse> {
  const {
    requireOriginValidation = true,
    requireRateLimit = true,
    logErrors = true,
  } = options;

  const clientIP = getClientIP(request);
  let body: Record<string, unknown> = {};

  try {
    // Parse request body
    try {
      body = await request.json();
    } catch {
      // Allow routes without JSON body
      body = {};
    }

    // Validate origin if required
    if (requireOriginValidation && !validateOrigin(request)) {
      console.warn('Blocked request from unauthorized origin:', 
        request.headers.get('origin') || request.headers.get('referer'));
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    // Check rate limits if required
    if (requireRateLimit) {
      // Check global rate limit
      const globalLimit = globalRateLimiter.check('global');
      if (!globalLimit.allowed) {
        return NextResponse.json(
          {
            error: 'Service temporarily unavailable. Please try again later.',
            retryAfter: Math.ceil((globalLimit.resetTime - Date.now()) / 1000)
          },
          { status: 429 }
        );
      }

      // Check per-IP rate limit
      const ipLimit = ipRateLimiter.check(clientIP);
      if (!ipLimit.allowed) {
        return NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((ipLimit.resetTime - Date.now()) / 1000)
          },
          { status: 429 }
        );
      }
    }

    // Call the actual handler
    return await handler({ clientIP, body });

  } catch (error) {
    console.error('API middleware error:', error);
    
    if (logErrors) {
      logRequest(
        clientIP, 
        JSON.stringify(body), 
        'unknown', 
        false, 
        error instanceof Error ? error.message : 'Unknown middleware error'
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Convenience wrapper for routes that need full protection
export function withFullProtection(
  request: NextRequest,
  handler: (context: MiddlewareContext) => Promise<NextResponse>
) {
  return withApiMiddleware(request, handler, {
    requireOriginValidation: true,
    requireRateLimit: true,
    logErrors: true,
  });
}

// Convenience wrapper for internal routes that don't need origin validation
export function withRateLimitOnly(
  request: NextRequest,
  handler: (context: MiddlewareContext) => Promise<NextResponse>
) {
  return withApiMiddleware(request, handler, {
    requireOriginValidation: false,
    requireRateLimit: true,
    logErrors: true,
  });
}
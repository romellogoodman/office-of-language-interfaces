import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/claude';
import { validateRequest, logRequest } from '@/lib/request-validator';
import { withFullProtection } from '@/lib/api-middleware';
import { ipRateLimiter } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  return withFullProtection(request, async ({ clientIP, body }) => {
    const prompt = body.prompt || '';
    const model = body.model || '';

    // Validate request
    const validation = validateRequest(prompt, model);
    if (!validation.isValid) {
      // Only log blocked/invalid requests for security monitoring
      logRequest(clientIP, prompt, model, false, validation.error);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    try {
      // Make API call with sanitized data
      const response = await sendMessage({
        prompt: validation.sanitizedPrompt!,
        model: validation.sanitizedModel
      });

      // Get remaining requests for this IP
      const ipLimit = ipRateLimiter.check(clientIP);

      return NextResponse.json({
        response,
        remaining: ipLimit.remaining
      });

    } catch (error) {
      console.error('Error calling Claude API:', error);
      // Only log errors for debugging
      logRequest(clientIP, prompt, model, false, error instanceof Error ? error.message : 'Unknown error');

      return NextResponse.json(
        { error: 'Failed to get response from Claude' },
        { status: 500 }
      );
    }
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await sendMessage({ prompt, model });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
}
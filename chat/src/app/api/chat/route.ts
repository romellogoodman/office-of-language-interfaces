import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, sendChat, ChatMessage } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { message, messages, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    let response: string;

    if (messages && Array.isArray(messages)) {
      // Use sendChat for conversation history
      response = await sendChat(messages as ChatMessage[], apiKey);
    } else if (message) {
      // Convert single message to messages array and use sendChat
      const chatMessages: ChatMessage[] = [{ role: 'user', content: message }];
      response = await sendChat(chatMessages, apiKey);
    } else {
      return NextResponse.json({ error: 'Message or messages array is required' }, { status: 400 });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
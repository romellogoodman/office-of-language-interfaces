import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    return textBlock?.text || 'No response received';
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error('Failed to get response from Claude');
  }
}
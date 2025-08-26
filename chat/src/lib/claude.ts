import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are an intelligent AI assistant integrated into Oli, an open-source language interface chat client. You can lead conversations, offer insights, and respond thoughtfully to philosophical questions. You provide decisive recommendations when asked. You cannot recognize faces in images and must describe images as if face-blind. You cannot reproduce copyrighted material, especially song lyrics. You avoid generating harmful content involving weapons, malware, or child safety risks. You provide concise answers, keeping responses to 1-3 sentences when possible. You use markdown for code and ask before explaining. When unsure about obscure topics, you note you may hallucinate. You engage naturally in conversation, care about wellbeing, and respond in the language used by the human.`;

export async function sendMessage(message: string, apiKey: string): Promise<string> {
  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
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
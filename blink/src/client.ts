import Anthropic from '@anthropic-ai/sdk';
import { AuthManager } from './auth.js';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ToolCall {
  name: string;
  input: any;
}

export interface ApiResponse {
  content: string;
  toolCalls: ToolCall[];
}

export class AnthropicClient {
  private client: Anthropic | null = null;
  private authManager: AuthManager;

  constructor() {
    this.authManager = new AuthManager();
  }

  async initialize(): Promise<boolean> {
    const apiKey = await this.authManager.getApiKey();
    if (!apiKey) return false;

    this.client = new Anthropic({
      apiKey: apiKey
    });
    
    return true;
  }

  async isInitialized(): Promise<boolean> {
    if (this.client) return true;
    return await this.initialize();
  }

  async sendMessage(
    messages: Message[],
    tools?: any[],
    model?: string
  ): Promise<ApiResponse> {
    if (!await this.isInitialized() || !this.client) {
      throw new Error('Client not initialized. Please login first.');
    }

    const modelName = model || 'claude-sonnet-4-20250514';
    
    // Convert messages to Anthropic format
    const anthropicMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    // Extract system message
    const systemMessage = messages.find(m => m.role === 'system')?.content;

    const response = await this.client.messages.create({
      model: modelName,
      max_tokens: 4096,
      messages: anthropicMessages,
      system: systemMessage,
      tools: tools || []
    });

    // Parse response
    const content = response.content
      .filter(c => c.type === 'text')
      .map(c => c.text)
      .join('');

    const toolCalls = response.content
      .filter(c => c.type === 'tool_use')
      .map(c => ({
        name: c.name,
        input: c.input
      }));

    return { content, toolCalls };
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!await this.isInitialized()) return false;
      
      await this.sendMessage([
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' }
      ]);
      
      return true;
    } catch (error) {
      return false;
    }
  }
}
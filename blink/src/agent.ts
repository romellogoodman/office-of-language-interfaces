import { AnthropicClient, Message, ApiResponse } from './client.js';
import { ToolRegistry } from './tools.js';
import { AuthManager } from './auth.js';
import { ModelManager } from './models.js';

export interface AgentConfig {
  mode: 'regular' | 'autopilot' | 'planning';
  model?: string;
}

export class Agent {
  private client: AnthropicClient;
  private tools: ToolRegistry;
  private auth: AuthManager;
  private models: ModelManager;
  private messages: Message[] = [];
  private config: AgentConfig;

  constructor(config: AgentConfig = { mode: 'regular' }) {
    this.client = new AnthropicClient();
    this.tools = new ToolRegistry();
    this.auth = new AuthManager();
    this.models = new ModelManager();
    this.config = config;
    this.initializeSystemPrompt();
  }

  private initializeSystemPrompt(): void {
    const systemPrompt = this.getSystemPrompt();
    this.messages = [
      { role: 'system', content: systemPrompt }
    ];
  }

  private getSystemPrompt(): string {
    const mode = this.config.mode;
    
    const basePrompt = `You are Blink, an AI coding assistant. You help users with software engineering tasks.

IMPORTANT GUIDELINES:
- Always use tools to interact with the file system and execute commands
- Be concise and direct in your responses
- Ask for clarification when tasks are unclear
- Follow best practices for code and file operations

AVAILABLE TOOLS:
${this.tools.getToolDefinitions().map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}`;

    const modeSpecificPrompt = {
      regular: `
REGULAR MODE:
- Interactive assistance with user confirmation for potentially destructive operations
- Explain your actions and ask for permission when needed
- Focus on helping the user understand what you're doing`,

      autopilot: `
AUTOPILOT MODE:
- Execute tasks autonomously without asking for permission
- Still explain what you're doing but proceed automatically
- Use your best judgment for file operations and commands`,

      planning: `
PLANNING MODE:
- Focus on discussion and planning without executing tools
- Create detailed plans and implementation strategies
- Break down complex tasks into actionable steps
- Do not execute any file operations or commands in this mode`
    };

    return basePrompt + '\n' + modeSpecificPrompt[mode];
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.auth.isAuthenticated();
  }

  async processInput(input: string): Promise<string> {
    // Handle slash commands
    if (input.startsWith('/')) {
      return await this.handleSlashCommand(input);
    }

    // Check authentication
    if (!await this.isAuthenticated()) {
      return 'Please login first using /login <api-key>';
    }

    // Add user message
    this.messages.push({ role: 'user', content: input });

    try {
      // Get response from API
      const toolDefinitions = this.config.mode === 'planning' ? [] : this.tools.getToolDefinitions();
      const response = await this.client.sendMessage(this.messages, toolDefinitions);

      // Add assistant response
      if (response.content) {
        this.messages.push({ role: 'assistant', content: response.content });
      }

      // Execute any requested tools
      if (response.toolCalls.length > 0 && this.config.mode !== 'planning') {
        for (const toolCall of response.toolCalls) {
          const toolResult = await this.executeTool(toolCall.name, toolCall.input);
          
          // Add tool result to messages
          this.messages.push({
            role: 'user',
            content: `Tool ${toolCall.name} result: ${toolResult}`
          });
        }

        // Get final response after tool execution
        const finalResponse = await this.client.sendMessage(this.messages, toolDefinitions);
        if (finalResponse.content) {
          this.messages.push({ role: 'assistant', content: finalResponse.content });
          return finalResponse.content;
        }
      }

      return response.content || 'I understand, but I don\'t have a response.';

    } catch (error: any) {
      const errorMessage = `Error: ${error.message}`;
      this.messages.push({ role: 'assistant', content: errorMessage });
      return errorMessage;
    }
  }

  private async executeTool(toolName: string, input: any): Promise<string> {
    // In regular mode, check if tool requires approval
    if (this.config.mode === 'regular' && this.tools.requiresApproval(toolName)) {
      // For MVP, we'll just proceed (in full implementation, this would prompt user)
      console.log(`Tool ${toolName} requires approval - executing in MVP mode`);
    }

    try {
      return await this.tools.executeTool(toolName, input);
    } catch (error: any) {
      return `Tool execution failed: ${error.message}`;
    }
  }

  private async handleSlashCommand(command: string): Promise<string> {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case '/login':
        if (args.length === 0) {
          return 'Usage: /login <api-key> [model]';
        }
        try {
          const apiKey = args[0];
          const model = args[1];
          await this.auth.login(apiKey, model);
          await this.client.initialize();
          return 'Successfully logged in!';
        } catch (error: any) {
          return `Login failed: ${error.message}`;
        }

      case '/logout':
        await this.auth.logout();
        return 'Successfully logged out!';

      case '/model':
        if (args.length === 0) {
          const currentModel = await this.auth.getCurrentModel();
          const modelInfo = this.models.getModelByName(currentModel);
          return `Current model: ${modelInfo?.displayName || currentModel}\n\nAvailable models:\n${this.models.formatModelList()}`;
        } else {
          const modelName = args.join(' ');
          // Try to find model by display name or actual name
          const model = this.models.getAvailableModels().find(m => 
            m.name === modelName || m.displayName === modelName || 
            modelName === (this.models.getAvailableModels().indexOf(m) + 1).toString()
          );
          
          if (model) {
            await this.auth.updateModel(model.name);
            return `Model changed to: ${model.displayName}`;
          } else {
            return `Invalid model. Available models:\n${this.models.formatModelList()}`;
          }
        }

      case '/clear':
        this.messages = [this.messages[0]]; // Keep system prompt
        return 'Conversation cleared!';

      case '/help':
        return `Available commands:
/login <api-key> [model] - Login with Anthropic API key
/logout - Logout from current account
/model [name] - View or change the current model
/clear - Clear conversation history
/help - Show this help message

Current mode: ${this.config.mode}
Use Shift+Tab to cycle between modes (not implemented yet)`;

      default:
        return `Unknown command: ${cmd}. Type /help for available commands.`;
    }
  }

  setMode(mode: 'regular' | 'autopilot' | 'planning'): void {
    this.config.mode = mode;
    this.initializeSystemPrompt();
  }

  getMode(): string {
    return this.config.mode;
  }

  getMessageCount(): number {
    return this.messages.length;
  }

  async getCurrentModel(): Promise<string> {
    return await this.auth.getCurrentModel();
  }
}
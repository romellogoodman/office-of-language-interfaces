import { AnthropicClient, Message, ApiResponse } from './client.js';
import { ToolRegistry } from './tools.js';
import { AuthManager } from './auth.js';
import { ModelManager } from './models.js';
import { AgentsManager } from './agents.js';

export interface AgentConfig {
  mode: 'regular' | 'autopilot' | 'planning';
  model?: string;
}

export class Agent {
  private client: AnthropicClient;
  private tools: ToolRegistry;
  private auth: AuthManager;
  private models: ModelManager;
  private agentsManager: AgentsManager;
  private messages: Message[] = [];
  private config: AgentConfig;
  private currentModel: string;

  constructor(config: AgentConfig = { mode: 'regular' }) {
    this.client = new AnthropicClient();
    this.tools = new ToolRegistry();
    this.auth = new AuthManager();
    this.models = new ModelManager();
    this.agentsManager = new AgentsManager();
    this.config = config;
    this.currentModel = this.models.getDefaultModel().name;
    this.initializeSystemPrompt();
  }

  private async initializeSystemPrompt(): Promise<void> {
    const systemPrompt = await this.getSystemPrompt();
    this.messages = [
      { role: 'system', content: systemPrompt }
    ];
  }

  private async getSystemPrompt(): Promise<string> {
    const mode = this.config.mode;
    
    // Load AGENTS.md instructions if available
    const agentsInstructions = await this.agentsManager.getSystemInstructions();
    
    const basePrompt = `You are Blink, an AI coding assistant. You help users with software engineering tasks.

IMPORTANT GUIDELINES:
- Always use tools to interact with the file system and execute commands
- Be concise and direct in your responses
- Ask for clarification when tasks are unclear
- Follow best practices for code and file operations

AVAILABLE TOOLS:
${this.tools.getToolDefinitions().map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}`;

    // Add AGENTS.md instructions if available
    const agentsSection = agentsInstructions ? `

PROJECT-SPECIFIC INSTRUCTIONS:
${agentsInstructions}` : '';

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

    return basePrompt + agentsSection + '\n' + modeSpecificPrompt[mode];
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
      const response = await this.client.sendMessage(this.messages, toolDefinitions, this.currentModel);

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
        const finalResponse = await this.client.sendMessage(this.messages, toolDefinitions, this.currentModel);
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
          return 'Usage: /login <api-key>';
        }
        try {
          const apiKey = args[0];
          await this.auth.login(apiKey);
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
          const modelInfo = this.models.getModelByName(this.currentModel);
          return `Current model: ${modelInfo?.displayName || this.currentModel}\n\nAvailable models:\n${this.models.formatModelList()}`;
        } else {
          const modelName = args.join(' ');
          // Try to find model by display name or actual name
          const model = this.models.getAvailableModels().find(m => 
            m.name === modelName || m.displayName === modelName || 
            modelName === (this.models.getAvailableModels().indexOf(m) + 1).toString()
          );
          
          if (model) {
            this.currentModel = model.name;
            return `Model changed to: ${model.displayName}`;
          } else {
            return `Invalid model. Available models:\n${this.models.formatModelList()}`;
          }
        }

      case '/clear':
        this.messages = [this.messages[0]]; // Keep system prompt
        return 'Conversation cleared!';

      case '/init':
        try {
          await this.agentsManager.initializeAgentsFile();
          return 'Created AGENTS.md file in current directory. Edit it to add project-specific instructions.';
        } catch (error: any) {
          return `Error: ${error.message}`;
        }

      case '/help':
        return `Available commands:
/login <api-key> - Login with Anthropic API key
/logout - Logout from current account
/model [name] - View or change the current model
/clear - Clear conversation history
/init - Initialize AGENTS.md file in current directory
/help - Show this help message

Current mode: ${this.config.mode}
${await this.agentsManager.hasAgentsFile() ? '✅ AGENTS.md detected and loaded' : '💡 Use /init to create AGENTS.md for project-specific instructions'}`;

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
    return this.currentModel;
  }
}
import { AnthropicClient, Message, ApiResponse } from './client.js';
import { ToolRegistry } from './tools.js';
import { AuthManager } from './auth.js';
import { ModelManager } from './models.js';
import { AgentsManager } from './agents.js';
import { ContextManager } from './context.js';
import { CommandManager } from './commands.js';
import { PermissionManager } from './permissions.js';
import { COMMANDS } from './constants.js';

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
  private contextManager: ContextManager;
  private commandManager: CommandManager;
  private permissionManager: PermissionManager;
  private messages: Message[] = [];
  private config: AgentConfig;
  private currentModel: string;
  private conversationCallback?: (message: string) => void;

  constructor(config: AgentConfig = { mode: 'regular' }) {
    this.client = new AnthropicClient();
    this.tools = new ToolRegistry();
    this.auth = new AuthManager();
    this.models = new ModelManager();
    this.agentsManager = new AgentsManager();
    this.contextManager = new ContextManager();
    this.commandManager = new CommandManager();
    this.permissionManager = new PermissionManager();
    this.config = config;
    this.currentModel = this.models.getDefaultModel().name;
    this.initializeSystemPrompt();
    this.loadCustomCommands();
  }

  private async initializeSystemPrompt(): Promise<void> {
    const systemPrompt = await this.getSystemPrompt();
    this.messages = [
      { role: 'system', content: systemPrompt }
    ];
  }

  private async loadCustomCommands(): Promise<void> {
    try {
      await this.commandManager.loadCustomCommands();
    } catch (error) {
      console.warn('Failed to load custom commands:', error);
    }
  }

  private async generateCustomCommand(name: string, description: string): Promise<string> {
    if (!await this.isAuthenticated()) {
      return 'Please login first using /login <api-key>';
    }

    const prompt = `Generate a custom command script for a CLI tool. 

Command name: ${name}
Description: ${description}

Requirements:
- Create a Node.js script that can be executed
- Add proper metadata comments at the top (// @name, // @description, // @usage)
- Include error handling
- Make it practical and useful
- Use modern JavaScript/Node.js features
- Include helpful console output

Generate ONLY the JavaScript code, no explanation:`;

    try {
      // Create a temporary message for the generation request
      const tempMessages: Message[] = [
        { role: 'system', content: 'You are a helpful coding assistant that generates clean, practical Node.js scripts.' },
        { role: 'user', content: prompt }
      ];

      const response = await this.client.sendMessage(tempMessages, [], this.currentModel);

      if (!response.content) {
        return 'Failed to generate command script.';
      }

      // Create the commands directory if it doesn't exist
      await this.commandManager.createCommandsDirectory();

      // Save the generated command
      const fs = await import('fs/promises');
      const path = await import('path');

      const commandsDir = path.join(process.cwd(), '.agent/commands');
      const filePath = path.join(commandsDir, `${name}.js`);

      await fs.writeFile(filePath, response.content, 'utf-8');

      // Reload commands to include the new one
      await this.loadCustomCommands();

      return `Generated custom command '${name}' and saved to .agent/commands/${name}.js\n\nGenerated code:\n\`\`\`javascript\n${response.content}\n\`\`\`\n\nYou can now use /${name} in your commands!`;

    } catch (error: any) {
      return `Failed to generate command: ${error.message}`;
    }
  }

  private async getSystemPrompt(): Promise<string> {
    const mode = this.config.mode;

    // Load base system prompt from file
    let basePrompt: string;
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const promptPath = path.join(import.meta.dirname, 'SYSTEM_PROMPT.md');
      basePrompt = await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      // Fallback to inline prompt if file not found
      basePrompt = `You are Blink, an AI coding assistant. You help users with software engineering tasks.

IMPORTANT GUIDELINES:
- Always use tools to interact with the file system and execute commands
- Be concise and direct in your responses
- Ask for clarification when tasks are unclear
- Follow best practices for code and file operations`;
    }

    // Add available tools section
    const toolsSection = `

AVAILABLE TOOLS:
${this.tools.getToolDefinitions().map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}`;

    // Load AGENTS.md instructions if available
    const agentsInstructions = await this.agentsManager.getSystemInstructions();
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

    return basePrompt + toolsSection + agentsSection + modeSpecificPrompt[mode];
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
    this.contextManager.addMessage(input);

    try {
      // Check if context compaction is needed
      if (this.contextManager.shouldCompact()) {
        this.messages = this.contextManager.compactMessages(this.messages);
      }

      // Get response from API
      const toolDefinitions = this.config.mode === 'planning' ? [] : this.tools.getToolDefinitions();
      const response = await this.client.sendMessage(this.messages, toolDefinitions, this.currentModel);

      // Add assistant response
      if (response.content) {
        this.messages.push({ role: 'assistant', content: response.content });
        this.contextManager.addMessage(response.content);
      }

      // Execute any requested tools  
      if (response.toolCalls.length > 0 && this.config.mode !== 'planning') {
        // Store initial response to return
        const initialResponse = response.content || '';
        
        const toolResults: string[] = [];

        for (const toolCall of response.toolCalls) {
          // Add tool call to conversation transcript
          const toolCallMessage = `🔧 ${toolCall.name}(${Object.entries(toolCall.input).map(([k, v]) => `${k}: "${v}"`).join(', ')})`;
          this.addToConversation(toolCallMessage);

          const toolResult = await this.executeTool(toolCall.name, toolCall.input);
          toolResults.push(`${toolCall.name}: ${toolResult}`);

          // Add tool result to conversation transcript
          this.addToConversation(`✅ ${toolResult}`);

          // Add tool result to messages for AI context
          this.messages.push({
            role: 'user',
            content: `Tool ${toolCall.name} result: ${toolResult}`
          });
        }

        // Get final response after tool execution
        const finalResponse = await this.client.sendMessage(this.messages, toolDefinitions, this.currentModel);
        if (finalResponse.content) {
          this.messages.push({ role: 'assistant', content: finalResponse.content });
          this.contextManager.addMessage(finalResponse.content);
          return initialResponse ? `${initialResponse}\n\n${finalResponse.content}` : finalResponse.content;
        } else {
          // Return initial response if available, otherwise show tools executed
          return initialResponse || `Tools executed successfully:\n${toolResults.map(result => `✅ ${result}`).join('\n')}`;
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
    // Check permissions first
    const permission = await this.permissionManager.checkPermission(toolName);

    if (permission === 'deny') {
      return `Tool ${toolName} is blocked by permissions. Use /permissions to manage tool permissions.`;
    }

    if (permission === 'ask' && this.config.mode === 'regular') {
      // Auto-approve first use and save permission for this project
      await this.permissionManager.setPermission(toolName, 'always');
      return `🔒 First use of ${toolName} - auto-approved and saved to .agent/permissions.json\n\n${await this.tools.executeTool(toolName, input)}`;
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

    // Check for custom commands first
    if (this.commandManager.hasCommand(cmd)) {
      try {
        return await this.commandManager.executeCustomCommand(cmd, args);
      } catch (error: any) {
        return `Error executing custom command: ${error.message}`;
      }
    }

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

      case '/command':
        if (args.length < 2) {
          return 'Usage: /command <name> <description>\nExample: /command deploy "Deploy the current project to production"';
        }

        const commandName = args[0];
        const commandDescription = args.slice(1).join(' ');

        try {
          return await this.generateCustomCommand(commandName, commandDescription);
        } catch (error: any) {
          return `Error generating command: ${error.message}`;
        }

      case '/permissions':
        if (args.length === 0 || args[0] === 'list') {
          return this.permissionManager.getPermissionSummary();

        } else if (args[0] === 'allow' && args.length > 1) {
          const toolName = args[1];
          await this.permissionManager.setPermission(toolName, 'always');
          return `Tool '${toolName}' is now always allowed for this project.`;

        } else if (args[0] === 'block' && args.length > 1) {
          const toolName = args[1];
          await this.permissionManager.setPermission(toolName, 'never');
          return `Tool '${toolName}' is now blocked for this project.`;

        } else if (args[0] === 'reset') {
          // Reset all permissions to defaults
          const permissions = new PermissionManager();
          this.permissionManager = permissions;
          return 'All permissions reset to defaults.';

        } else {
          return 'Usage: /permissions [list | allow <tool> | block <tool> | reset]';
        }

      case '/help':
        const customCommands = this.commandManager.getCustomCommands();
        const customCommandsText = customCommands.length > 0
          ? `\n\nCustom Commands:\n${customCommands.map(cmd => `${cmd.usage} - ${cmd.description}`).join('\n')}`
          : '\n💡 Use /command <name> <description> to generate custom commands';

        const builtinCommandsText = COMMANDS.map(cmd => `${cmd.usage} - ${cmd.description}`).join('\n');

        return `Available commands:
${builtinCommandsText}${customCommandsText}

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

  getContextManager(): ContextManager {
    return this.contextManager;
  }

  setConversationCallback(callback: (message: string) => void): void {
    this.conversationCallback = callback;
  }

  private addToConversation(message: string): void {
    if (this.conversationCallback) {
      this.conversationCallback(message);
    }
  }

  getAllCommands(): Array<{ name: string; description: string; usage: string }> {
    const builtinCommands = COMMANDS;

    const customCommands = this.commandManager.getCustomCommands().map(cmd => ({
      name: cmd.name,
      description: cmd.description,
      usage: cmd.usage
    }));

    const allCommands = [...builtinCommands, ...customCommands];

    // Sort alphabetically by command name
    return allCommands.sort((a, b) => a.name.localeCompare(b.name));
  }
}
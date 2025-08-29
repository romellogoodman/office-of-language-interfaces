import fs from 'fs/promises';
import path from 'path';

export interface CustomCommand {
  name: string;
  description: string;
  usage: string;
  script: string;
}

export class CommandManager {
  private customCommands: Map<string, CustomCommand> = new Map();
  private commandsDir = '.agent/commands';

  async loadCustomCommands(): Promise<void> {
    try {
      // Find .agent/commands directory starting from current directory
      const commandsPath = await this.findCommandsDirectory();
      if (!commandsPath) return;

      const files = await fs.readdir(commandsPath);
      
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
          await this.loadCommand(path.join(commandsPath, file));
        }
      }
    } catch (error) {
      // Commands directory doesn't exist or isn't readable - that's ok
    }
  }

  private async findCommandsDirectory(): Promise<string | null> {
    let currentDir = process.cwd();
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
      const commandsPath = path.join(currentDir, this.commandsDir);
      try {
        const stat = await fs.stat(commandsPath);
        if (stat.isDirectory()) {
          return commandsPath;
        }
      } catch {
        // Directory doesn't exist, continue searching
      }
      
      currentDir = path.dirname(currentDir);
    }

    return null;
  }

  private async loadCommand(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const command = this.parseCommand(content, filePath);
      if (command) {
        this.customCommands.set(command.name, command);
      }
    } catch (error) {
      console.warn(`Failed to load command from ${filePath}:`, error);
    }
  }

  private parseCommand(content: string, filePath: string): CustomCommand | null {
    // Look for command metadata in comments at the top of the file
    const lines = content.split('\n');
    const metadata: any = {};
    let foundMetadata = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for // @name, // @description, // @usage
      if (trimmed.startsWith('// @name ')) {
        metadata.name = trimmed.substring('// @name '.length);
        foundMetadata = true;
      } else if (trimmed.startsWith('// @description ')) {
        metadata.description = trimmed.substring('// @description '.length);
        foundMetadata = true;
      } else if (trimmed.startsWith('// @usage ')) {
        metadata.usage = trimmed.substring('// @usage '.length);
        foundMetadata = true;
      }
      
      // Stop at first non-comment line
      if (!trimmed.startsWith('//') && trimmed.length > 0) break;
    }

    if (!foundMetadata || !metadata.name) {
      // Fallback: use filename as command name
      const filename = path.basename(filePath, path.extname(filePath));
      metadata.name = `/${filename}`;
      metadata.description = `Custom command from ${filename}`;
      metadata.usage = metadata.name;
    }

    return {
      name: metadata.name.startsWith('/') ? metadata.name : `/${metadata.name}`,
      description: metadata.description || 'Custom command',
      usage: metadata.usage || metadata.name,
      script: content
    };
  }

  getCustomCommands(): CustomCommand[] {
    return Array.from(this.customCommands.values());
  }

  hasCommand(name: string): boolean {
    return this.customCommands.has(name);
  }

  async executeCustomCommand(name: string, args: string[]): Promise<string> {
    const command = this.customCommands.get(name);
    if (!command) {
      throw new Error(`Custom command ${name} not found`);
    }

    // For now, we'll simulate command execution
    // In a full implementation, this would execute the script with proper sandboxing
    return `Custom command ${name} executed with args: ${args.join(' ')}\n\nScript content:\n${command.script}`;
  }

  async createCommandsDirectory(): Promise<void> {
    const commandsPath = path.join(process.cwd(), this.commandsDir);
    await fs.mkdir(commandsPath, { recursive: true });
    
    // Create example command
    const exampleCommand = `// @name deploy
// @description Deploy the current project
// @usage /deploy [environment]

console.log('Deploying to:', process.argv[2] || 'production');

// Your deployment logic here
// This script has access to the current directory
// and can execute any commands needed`;

    await fs.writeFile(
      path.join(commandsPath, 'deploy.js'),
      exampleCommand,
      'utf-8'
    );
  }
}
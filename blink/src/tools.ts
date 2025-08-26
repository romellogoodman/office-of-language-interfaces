import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execAsync = promisify(exec);

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolMetadata {
  category: 'file' | 'shell' | 'search' | 'edit';
  requiresApproval: boolean;
  streaming: boolean;
  timeout?: number;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition & ToolMetadata & { 
    execute: (input: any) => Promise<string> 
  }> = new Map();

  constructor() {
    this.registerEssentialTools();
  }

  private registerEssentialTools(): void {
    // read_file tool
    this.register({
      name: 'read_file',
      description: 'Read the contents of a file',
      input_schema: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'The path to the file to read'
          }
        },
        required: ['file_path']
      },
      category: 'file',
      requiresApproval: false,
      streaming: false,
      execute: async (input: { file_path: string }) => {
        try {
          const content = await fs.readFile(input.file_path, 'utf-8');
          return content;
        } catch (error: any) {
          return `Error reading file: ${error.message}`;
        }
      }
    });

    // write_file tool
    this.register({
      name: 'write_file',
      description: 'Create or overwrite a file with the given content',
      input_schema: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'The path to the file to write'
          },
          content: {
            type: 'string',
            description: 'The content to write to the file'
          }
        },
        required: ['file_path', 'content']
      },
      category: 'file',
      requiresApproval: true,
      streaming: false,
      execute: async (input: { file_path: string; content: string }) => {
        try {
          await fs.writeFile(input.file_path, input.content, 'utf-8');
          return `File written successfully: ${input.file_path}`;
        } catch (error: any) {
          return `Error writing file: ${error.message}`;
        }
      }
    });

    // list_files tool
    this.register({
      name: 'list_files',
      description: 'List files and directories in a given path',
      input_schema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The directory path to list (defaults to current directory)'
          }
        }
      },
      category: 'file',
      requiresApproval: false,
      streaming: false,
      execute: async (input: { path?: string }) => {
        try {
          const path = input.path || '.';
          const entries = await fs.readdir(path, { withFileTypes: true });
          const result = entries.map(entry => {
            const type = entry.isDirectory() ? 'DIR' : 'FILE';
            return `${type}: ${entry.name}`;
          }).join('\n');
          return result || 'Directory is empty';
        } catch (error: any) {
          return `Error listing files: ${error.message}`;
        }
      }
    });

    // execute_command tool
    this.register({
      name: 'execute_command',
      description: 'Execute a shell command',
      input_schema: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'The shell command to execute'
          }
        },
        required: ['command']
      },
      category: 'shell',
      requiresApproval: true,
      streaming: false,
      timeout: 30000,
      execute: async (input: { command: string }) => {
        try {
          const { stdout, stderr } = await execAsync(input.command, {
            timeout: 30000
          });
          const result = stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
          return result || 'Command executed successfully (no output)';
        } catch (error: any) {
          return `Error executing command: ${error.message}`;
        }
      }
    });

    // edit_file tool (simplified version for MVP)
    this.register({
      name: 'edit_file',
      description: 'Edit a file by replacing specific content',
      input_schema: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'The path to the file to edit'
          },
          old_content: {
            type: 'string',
            description: 'The content to replace'
          },
          new_content: {
            type: 'string',
            description: 'The new content to insert'
          }
        },
        required: ['file_path', 'old_content', 'new_content']
      },
      category: 'edit',
      requiresApproval: true,
      streaming: false,
      execute: async (input: { file_path: string; old_content: string; new_content: string }) => {
        try {
          const content = await fs.readFile(input.file_path, 'utf-8');
          const newContent = content.replace(input.old_content, input.new_content);
          
          if (content === newContent) {
            return `No changes made - old content not found in ${input.file_path}`;
          }
          
          await fs.writeFile(input.file_path, newContent, 'utf-8');
          return `File edited successfully: ${input.file_path}`;
        } catch (error: any) {
          return `Error editing file: ${error.message}`;
        }
      }
    });
  }

  register(tool: ToolDefinition & ToolMetadata & { execute: (input: any) => Promise<string> }): void {
    this.tools.set(tool.name, tool);
  }

  async executeTool(name: string, input: any): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    
    return await tool.execute(input);
  }

  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.input_schema
    }));
  }

  requiresApproval(toolName: string): boolean {
    const tool = this.tools.get(toolName);
    return tool?.requiresApproval || false;
  }

  getToolsByCategory(category: string): ToolDefinition[] {
    return Array.from(this.tools.values())
      .filter(tool => tool.category === category)
      .map(tool => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.input_schema
      }));
  }
}
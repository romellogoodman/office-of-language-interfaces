import { promises as fs } from 'fs';
import { join, dirname } from 'path';

export interface AgentsConfig {
  instructions: string;
  context: string;
  filePath: string;
}

export class AgentsManager {
  private cachedConfig: AgentsConfig | null = null;
  private lastFilePath: string | null = null;

  /**
   * Discover AGENTS.md files from current directory up to root
   * Returns the nearest (most specific) AGENTS.md file
   */
  async discoverAgentsFile(startPath: string = process.cwd()): Promise<string | null> {
    let currentPath = startPath;
    const root = '/'; // Unix root, could be enhanced for Windows

    while (currentPath !== root) {
      const agentsPath = join(currentPath, 'AGENTS.md');
      
      try {
        await fs.access(agentsPath);
        return agentsPath;
      } catch {
        // File doesn't exist, continue up the directory tree
      }

      const parentPath = dirname(currentPath);
      if (parentPath === currentPath) break; // Reached root
      currentPath = parentPath;
    }

    return null;
  }

  /**
   * Parse AGENTS.md file content
   * Extracts instructions and context from markdown
   */
  async parseAgentsFile(filePath: string): Promise<AgentsConfig> {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Simple markdown parsing - could be enhanced with a proper parser
    const lines = content.split('\n');
    let instructions = '';
    let context = '';
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect sections based on common headers
      if (trimmed.toLowerCase().includes('instruction') || 
          trimmed.toLowerCase().includes('prompt') ||
          trimmed.toLowerCase().includes('system')) {
        currentSection = 'instructions';
        continue;
      }
      
      if (trimmed.toLowerCase().includes('context') ||
          trimmed.toLowerCase().includes('background')) {
        currentSection = 'context';
        continue;
      }
      
      // Skip markdown headers
      if (trimmed.startsWith('#')) {
        continue;
      }
      
      // Add content to appropriate section
      if (currentSection === 'instructions') {
        instructions += line + '\n';
      } else if (currentSection === 'context') {
        context += line + '\n';
      } else if (!currentSection && trimmed) {
        // If no section defined, treat as instructions by default
        instructions += line + '\n';
      }
    }

    return {
      instructions: instructions.trim(),
      context: context.trim(),
      filePath
    };
  }

  /**
   * Load AGENTS.md configuration with caching
   */
  async loadAgentsConfig(): Promise<AgentsConfig | null> {
    const agentsPath = await this.discoverAgentsFile();
    
    if (!agentsPath) {
      this.cachedConfig = null;
      this.lastFilePath = null;
      return null;
    }

    // Return cached config if file hasn't changed
    if (this.cachedConfig && this.lastFilePath === agentsPath) {
      return this.cachedConfig;
    }

    try {
      this.cachedConfig = await this.parseAgentsFile(agentsPath);
      this.lastFilePath = agentsPath;
      return this.cachedConfig;
    } catch (error) {
      console.error(`Error parsing AGENTS.md at ${agentsPath}:`, error);
      return null;
    }
  }

  /**
   * Get combined system instructions from AGENTS.md
   */
  async getSystemInstructions(): Promise<string | null> {
    const config = await this.loadAgentsConfig();
    if (!config) return null;

    let systemPrompt = '';
    
    if (config.context) {
      systemPrompt += `Context:\n${config.context}\n\n`;
    }
    
    if (config.instructions) {
      systemPrompt += `Instructions:\n${config.instructions}`;
    }

    return systemPrompt.trim() || null;
  }

  /**
   * Check if AGENTS.md exists in current project
   */
  async hasAgentsFile(): Promise<boolean> {
    const agentsPath = await this.discoverAgentsFile();
    return agentsPath !== null;
  }

  /**
   * Initialize a new AGENTS.md file in current directory
   */
  async initializeAgentsFile(): Promise<void> {
    const agentsPath = join(process.cwd(), 'AGENTS.md');
    
    // Check if file already exists
    try {
      await fs.access(agentsPath);
      throw new Error('AGENTS.md already exists in this directory');
    } catch {
      // File doesn't exist, we can create it
    }

    const template = `# Project Agent Instructions

## Instructions

You are an AI assistant helping with this specific project. 

Key guidelines:
- Follow the project's coding conventions
- Be helpful and concise
- Ask clarifying questions when needed

## Context

This project is located at: ${process.cwd()}

Add any relevant project context here:
- Project purpose
- Key technologies used  
- Important conventions
- Specific requirements

## Notes

This AGENTS.md file provides project-specific instructions to AI assistants.
It will be automatically discovered and loaded by compatible tools.
`;

    await fs.writeFile(agentsPath, template, 'utf-8');
  }
}
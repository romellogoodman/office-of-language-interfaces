import fs from 'fs/promises';
import path from 'path';

export type PermissionAction = 'always' | 'ask' | 'never';

export interface ToolPermission {
  tool: string;
  action: PermissionAction;
}

export interface PermissionsConfig {
  version: number;
  permissions: ToolPermission[];
  timestamp: string;
}

export class PermissionManager {
  private permissions: Map<string, PermissionAction> = new Map();
  private permissionsFile = '.agent/permissions.json';
  
  // Default permission categories
  private readonly alwaysAllowed = new Set([
    'read_file',
    'list_files', 
    'grep',
    'glob'
  ]);
  
  private readonly askByDefault = new Set([
    'write_file',
    'edit_file',
    'execute_command',
    'bash',
    'create_directory'
  ]);
  
  private readonly alwaysAsk = new Set([
    'delete_file',
    'remove_directory',
    'format_disk' // Obviously always ask for destructive operations
  ]);

  constructor() {
    this.loadPermissions();
  }

  async checkPermission(toolName: string): Promise<'allow' | 'deny' | 'ask'> {
    // Check if we have a saved permission
    const savedPermission = this.permissions.get(toolName);
    if (savedPermission) {
      switch (savedPermission) {
        case 'always': return 'allow';
        case 'never': return 'deny';
        case 'ask': return 'ask';
      }
    }

    // Apply default rules
    if (this.alwaysAllowed.has(toolName)) {
      return 'allow';
    }
    
    if (this.alwaysAsk.has(toolName)) {
      return 'ask';
    }
    
    if (this.askByDefault.has(toolName)) {
      return 'ask';
    }

    // Unknown tool - ask by default
    return 'ask';
  }

  async setPermission(toolName: string, action: PermissionAction): Promise<void> {
    this.permissions.set(toolName, action);
    await this.savePermissions();
  }

  async requiresApproval(toolName: string): Promise<boolean> {
    const permission = await this.checkPermission(toolName);
    return permission === 'ask';
  }

  private async loadPermissions(): Promise<void> {
    try {
      const permissionsPath = path.join(process.cwd(), this.permissionsFile);
      const data = await fs.readFile(permissionsPath, 'utf-8');
      const config: PermissionsConfig = JSON.parse(data);
      
      config.permissions.forEach((p: ToolPermission) => {
        this.permissions.set(p.tool, p.action);
      });
    } catch (error) {
      // Permissions file doesn't exist or is corrupted - use defaults
    }
  }

  private async savePermissions(): Promise<void> {
    const permissions = Array.from(this.permissions.entries()).map(
      ([tool, action]) => ({ tool, action })
    );
    
    const config: PermissionsConfig = {
      version: 1,
      permissions,
      timestamp: new Date().toISOString()
    };

    // Ensure .agent directory exists
    const agentDir = path.join(process.cwd(), '.agent');
    try {
      await fs.mkdir(agentDir, { recursive: true });
    } catch {
      // Directory already exists or creation failed
    }

    const permissionsPath = path.join(process.cwd(), this.permissionsFile);
    await fs.writeFile(permissionsPath, JSON.stringify(config, null, 2));
  }

  getPermissionSummary(): string {
    const allowed = Array.from(this.permissions.entries())
      .filter(([_, action]) => action === 'always')
      .map(([tool, _]) => tool);
    
    const blocked = Array.from(this.permissions.entries())
      .filter(([_, action]) => action === 'never')
      .map(([tool, _]) => tool);

    let summary = 'Permission Summary:\n';
    
    if (allowed.length > 0) {
      summary += `Always allowed: ${allowed.join(', ')}\n`;
    }
    
    if (blocked.length > 0) {
      summary += `Blocked: ${blocked.join(', ')}\n`;
    }
    
    summary += `\nDefault rules:\n- Always allowed: ${Array.from(this.alwaysAllowed).join(', ')}\n- Ask by default: ${Array.from(this.askByDefault).join(', ')}\n- Always ask: ${Array.from(this.alwaysAsk).join(', ')}`;
    
    return summary;
  }
}
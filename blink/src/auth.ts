import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

export interface AuthConfig {
  apiKey: string;
  timestamp: string;
}

export class AuthManager {
  private configPath: string;
  private config: AuthConfig | null = null;

  constructor() {
    this.configPath = join(homedir(), '.agent', 'auth.json');
  }

  async ensureConfigDir(): Promise<void> {
    const dir = dirname(this.configPath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error
    }
  }

  async login(apiKey: string): Promise<void> {
    await this.ensureConfigDir();
    
    const config: AuthConfig = {
      apiKey,
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    this.config = config;
  }

  async logout(): Promise<void> {
    try {
      await fs.unlink(this.configPath);
      this.config = null;
    } catch (error) {
      // File doesn't exist or other error
    }
  }

  async loadConfig(): Promise<AuthConfig | null> {
    if (this.config) return this.config;

    try {
      const data = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(data);
      return this.config;
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const config = await this.loadConfig();
    return config !== null && config.apiKey.length > 0;
  }

  async getApiKey(): Promise<string | null> {
    const config = await this.loadConfig();
    return config?.apiKey || null;
  }

}
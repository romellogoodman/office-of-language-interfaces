export interface ContextUsage {
  used: number;
  total: number;
  percentage: number;
}

export class ContextManager {
  private readonly MAX_TOKENS = 200000; // Claude 4 context limit
  private currentUsage = 0;
  private listeners: Array<(usage: ContextUsage) => void> = [];

  // Rough token estimation (4 chars ≈ 1 token)
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  addMessage(content: string): void {
    const tokens = this.estimateTokens(content);
    this.currentUsage += tokens;
    this.notifyListeners();
  }

  setUsage(tokens: number): void {
    this.currentUsage = tokens;
    this.notifyListeners();
  }

  getUsage(): ContextUsage {
    const percentage = Math.round((this.currentUsage / this.MAX_TOKENS) * 100);
    return {
      used: this.currentUsage,
      total: this.MAX_TOKENS,
      percentage: Math.min(percentage, 100)
    };
  }

  shouldCompact(): boolean {
    return this.getUsage().percentage >= 80;
  }

  compactMessages(messages: any[]): any[] {
    // Simple compaction: keep system prompt + last 10 messages
    if (messages.length <= 11) return messages;
    
    const systemPrompt = messages[0];
    const recentMessages = messages.slice(-10);
    const compacted = [systemPrompt, ...recentMessages];
    
    // Recalculate usage after compaction
    const totalText = compacted.map(m => m.content).join(' ');
    this.setUsage(this.estimateTokens(totalText));
    
    return compacted;
  }

  onUpdate(listener: (usage: ContextUsage) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const usage = this.getUsage();
    this.listeners.forEach(listener => listener(usage));
  }
}
export interface ModelConfig {
  name: string;
  displayName: string;
  contextWindow: number;
  description: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    name: 'claude-opus-4-1-20250805',
    displayName: 'Claude Opus 4.1',
    contextWindow: 200000,
    description: 'Most advanced and capable model'
  },
  {
    name: 'claude-opus-4-20250514',
    displayName: 'Claude Opus 4',
    contextWindow: 200000,
    description: 'Highly capable model for complex tasks'
  },
  {
    name: 'claude-sonnet-4-20250514',
    displayName: 'Claude Sonnet 4',
    contextWindow: 200000,
    description: 'Latest Sonnet model with balanced performance and speed'
  },
  {
    name: 'claude-3-7-sonnet-20250219',
    displayName: 'Claude Sonnet 3.7',
    contextWindow: 200000,
    description: 'Enhanced Sonnet model'
  },
  {
    name: 'claude-3-5-haiku-20241022',
    displayName: 'Claude Haiku 3.5',
    contextWindow: 200000,
    description: 'Fast and efficient model'
  },
  {
    name: 'claude-3-haiku-20240307',
    displayName: 'Claude Haiku 3',
    contextWindow: 200000,
    description: 'Fastest model for simple tasks'
  }
];

export class ModelManager {
  getAvailableModels(): ModelConfig[] {
    return AVAILABLE_MODELS;
  }

  getModelByName(name: string): ModelConfig | null {
    return AVAILABLE_MODELS.find(model => model.name === name) || null;
  }

  isValidModel(name: string): boolean {
    return AVAILABLE_MODELS.some(model => model.name === name);
  }

  getDefaultModel(): ModelConfig {
    return AVAILABLE_MODELS.find(m => m.name === 'claude-sonnet-4-20250514')!;
  }

  formatModelList(): string {
    return AVAILABLE_MODELS.map((model, index) => 
      `${index + 1}. ${model.displayName} (${model.name})\n   ${model.description}`
    ).join('\n\n');
  }
}
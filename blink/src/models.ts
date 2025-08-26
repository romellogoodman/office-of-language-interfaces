export interface ModelConfig {
  name: string;
  displayName: string;
  contextWindow: number;
  description: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    name: 'claude-3-opus-20240229',
    displayName: 'Claude 3 Opus',
    contextWindow: 200000,
    description: 'Most capable model for complex tasks'
  },
  {
    name: 'claude-3-sonnet-20240229',
    displayName: 'Claude 3 Sonnet',
    contextWindow: 200000,
    description: 'Balanced performance and speed'
  },
  {
    name: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku',
    contextWindow: 200000,
    description: 'Fastest model for simple tasks'
  },
  {
    name: 'claude-3-5-sonnet-20241022',
    displayName: 'Claude 3.5 Sonnet',
    contextWindow: 200000,
    description: 'Latest and most capable Sonnet model'
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
    return AVAILABLE_MODELS.find(m => m.name === 'claude-3-sonnet-20240229')!;
  }

  formatModelList(): string {
    return AVAILABLE_MODELS.map((model, index) => 
      `${index + 1}. ${model.displayName} (${model.name})\n   ${model.description}`
    ).join('\n\n');
  }
}
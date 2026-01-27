import { AIAdapter } from './ai-adapter.interface.js';
import { ClaudeAdapter } from './claude-adapter.js';
import { OpenAIAdapter } from './openai-adapter.js';
import { GeminiAdapter } from './gemini-adapter.js';

export type AIProvider = 'claude' | 'openai' | 'gemini';

export interface AdapterConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export class AdapterFactory {
  static createAdapter(config: AdapterConfig): AIAdapter {
    const { provider, apiKey, model } = config;

    switch (provider) {
      case 'claude':
        return new ClaudeAdapter(apiKey, model);

      case 'openai':
        return new OpenAIAdapter(apiKey, model);

      case 'gemini':
        return new GeminiAdapter(apiKey, model);

      default:
        throw new Error(
          `Unsupported AI provider: ${provider}. Supported providers: claude, openai, gemini`
        );
    }
  }

  static getSupportedProviders(): AIProvider[] {
    return ['claude', 'openai', 'gemini'];
  }

  static getDefaultModel(provider: AIProvider): string {
    switch (provider) {
      case 'claude':
        return 'claude-sonnet-4-20250514';
      case 'openai':
        return 'gpt-4-turbo';
      case 'gemini':
        return 'gemini-2.0-flash';
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  static validateConfig(config: AdapterConfig): void {
    if (!config.provider) {
      throw new Error('Provider is required');
    }

    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error('API key is required');
    }

    if (!this.getSupportedProviders().includes(config.provider)) {
      throw new Error(
        `Unsupported provider: ${config.provider}. Supported: ${this.getSupportedProviders().join(', ')}`
      );
    }
  }
}

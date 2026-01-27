import Anthropic from '@anthropic-ai/sdk';
import { AIAdapter } from './ai-adapter.interface.js';

export class ClaudeAdapter implements AIAdapter {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-sonnet-4-20250514') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateText(prompt: string, maxTokens: number): Promise<string> {
    try {
      const result = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });

      return result.content[0].type === 'text' ? result.content[0].text : '';
    } catch (error: any) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  getModelName(): string {
    return this.model;
  }

  getProviderName(): string {
    return 'claude';
  }
}

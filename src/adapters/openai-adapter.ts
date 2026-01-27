import OpenAI from 'openai';
import { AIAdapter } from './ai-adapter.interface.js';

export class OpenAIAdapter implements AIAdapter {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4-turbo') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateText(prompt: string, maxTokens: number): Promise<string> {
    try {
      const result = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      return result.choices[0].message.content || '';
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  getModelName(): string {
    return this.model;
  }

  getProviderName(): string {
    return 'openai';
  }
}

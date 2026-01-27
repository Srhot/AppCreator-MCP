import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAdapter } from './ai-adapter.interface.js';

export class GeminiAdapter implements AIAdapter {
  private client: GoogleGenerativeAI;
  private model: any;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash') {
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.model = this.client.getGenerativeModel({ model: modelName });
  }

  async generateText(prompt: string, maxTokens: number): Promise<string> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
      });

      return result.response.text();
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  getModelName(): string {
    return this.modelName;
  }

  getProviderName(): string {
    return 'gemini';
  }
}

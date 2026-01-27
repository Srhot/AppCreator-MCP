export interface AIAdapter {
  /**
   * Generate text using the AI model
   * @param prompt - The prompt to send to the AI
   * @param maxTokens - Maximum tokens to generate
   * @returns Generated text
   */
  generateText(prompt: string, maxTokens: number): Promise<string>;

  /**
   * Get the model name being used
   * @returns Model name (e.g., 'claude-sonnet-4', 'gpt-4-turbo', 'gemini-pro')
   */
  getModelName(): string;

  /**
   * Get the provider name
   * @returns Provider name (e.g., 'claude', 'openai', 'gemini')
   */
  getProviderName(): string;
}

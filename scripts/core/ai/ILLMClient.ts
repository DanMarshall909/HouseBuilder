/**
 * Abstraction over any LLM backend.
 * Implementations live in separate packages (e.g. ai-langchain/).
 * Core code depends only on this interface — never on a specific library.
 */
export interface ILLMClient {
  /**
   * Send a system prompt and a user message, and return the model's text response.
   * @param systemPrompt - Instructions that define the model's behaviour
   * @param userMessage  - The user's input
   * @returns The model's raw text response
   */
  complete(systemPrompt: string, userMessage: string): Promise<string>;
}

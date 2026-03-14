import { ChatOpenAI } from "@langchain/openai";
import { ILLMClient } from "../core/ai/ILLMClient";

/**
 * LangChain/OpenAI implementation of ILLMClient.
 *
 * This is the only file in the project that imports from LangChain or OpenAI.
 * Swap this class out to use a different LLM provider without touching any
 * core or Minecraft code.
 */
export class LangChainLLMClient implements ILLMClient {
  private readonly llm: ChatOpenAI;

  constructor(apiKey?: string, modelName: string = "gpt-4") {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey ?? process.env.OPENAI_API_KEY,
      modelName,
      temperature: 0.7,
    });
  }

  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await this.llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ]);

    return typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);
  }
}

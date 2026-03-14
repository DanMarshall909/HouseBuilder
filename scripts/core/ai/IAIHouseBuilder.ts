import { HouseConfig } from "../../config/HouseConfig";
import { BlockBuffer } from "../../io/BlockBuffer";
import { VisualizationMode } from "../../visualization/HouseVisualizer";

/**
 * Abstraction over any AI-powered house builder.
 * Concrete implementations inject an ILLMClient and are kept separate.
 */
export interface IAIHouseBuilder {
  /** Build a house in a BlockBuffer from a natural-language prompt. */
  buildFromPrompt(prompt: string): Promise<BlockBuffer>;

  /** Return the raw HouseConfig produced by the AI without building it. */
  generateHouseConfig(prompt: string): Promise<HouseConfig>;

  /** Validate a HouseConfig, returning any structural errors. */
  validateConfig(config: HouseConfig): { valid: boolean; errors: string[] };

  /** Render a visualisation of the config into a BlockBuffer. */
  visualizeHouse(config: HouseConfig, mode?: VisualizationMode): BlockBuffer;

  /** Produce an ASCII art summary of the config for console output. */
  generateASCIIPreview(config: HouseConfig): string;

  /** Calculate the axis-aligned bounding box of an entire house config. */
  getBoundingBox(config: HouseConfig): {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    dimensions: { width: number; height: number; depth: number };
  };

  /** Generate a house and a visualisation preview in one call. */
  buildWithPreview(
    prompt: string,
    visualizationMode?: VisualizationMode
  ): Promise<{
    config: HouseConfig;
    house: BlockBuffer;
    preview: BlockBuffer;
    ascii: string;
  }>;
}

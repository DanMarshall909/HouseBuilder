import { BlockType } from "./Blocks";

/**
 * Represents the dimensions of a window
 */
export interface WindowDimensions {
  /** Width of the window in blocks */
  width: number;
  /** Height of the window in blocks */
  height: number;
}

/**
 * Configuration options for creating a window
 */
export interface WindowOptions {
  /** The dimensions of the window. Defaults to 2x2 */
  size?: WindowDimensions;
  /** The type of block to use for the window. Defaults to glass pane */
  blockType?: BlockType;
}

import { Point } from "./geometry/Point";
import { Block, BlockType } from "./types/Blocks";

// Interface for abstract block operations
export interface IBlockBuffer {
  // Overload to accept Block type
  put(position: Point, blockType: Block): void;

  get(position: Point): Block | undefined;
}

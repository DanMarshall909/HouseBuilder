import { Block, BlockType } from "./Types/Blocks";
import Point from "./Types/Position";

// Interface for abstract block operations
export interface IBlockIO {
  // Overload to accept Block type
  put(position: Point, blockType: Block): void;

  get(position: Point): Block | undefined;
}

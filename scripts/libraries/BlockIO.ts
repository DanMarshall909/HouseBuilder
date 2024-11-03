import { Block, Blocks } from "./Types/Blocks";
import Point from "./Types/Position";

// Interface for abstract block operations
export interface BlockIO {
  // Overload to accept Block type
  put(position: Point, blockType: Block): void;

  // Overload to accept Blocks enum directly
  put(position: Point, blockType: Blocks): void;

  get(position: Point): Block | undefined;
}

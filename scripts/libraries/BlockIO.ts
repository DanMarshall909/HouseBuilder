import { Block } from "./Types/Blocks";
import Point from "./Types/Position";

// BlockManager class to centralize Minecraft API interactions.

export interface BlockIO {
  put(position: Point, blockType: Block): void;
  get(position: Point): Block | undefined;
}

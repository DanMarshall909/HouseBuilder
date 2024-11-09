import { Point } from "./geometry/Point";
import { Block, BlockType } from "./types/Blocks";

export interface IBlockBuffer {
  put(position: Point, blockType: Block): void;

  get(position: Point): Block | undefined;
}

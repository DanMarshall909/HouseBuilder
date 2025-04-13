import { Point, Orientation } from "../geometry/Point";
import { BlockType } from "../types/Blocks";

/**
 * Function type for placing blocks in the world
 * @param orientation - The orientation at which to place the block
 * @param position - The relative position from the orientation point
 * @param blockType - The type of block to place
 */
export type PutFunc = (orientation: Orientation, position: Point, blockType: BlockType) => void;

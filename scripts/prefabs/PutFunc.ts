import { Point, Orientation } from "../geometry/Point";
import { BlockType } from "../types/Blocks";

export type PutFunc = (orientation: Orientation, position: Point, blockType: BlockType) => void;

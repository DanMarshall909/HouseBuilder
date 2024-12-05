import {Point, Vector} from "../geometry/Point";
import {BlockType} from "../types/Blocks";


export type PutFunc = (orientation: Vector, position: Point, blockType: BlockType) => void;
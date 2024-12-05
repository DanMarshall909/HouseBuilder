import {Point} from "../geometry/Point";
import {Block} from "../types/Block";

export interface IBlockIO {
  put(position: Point, blockType: Block): void;

  get(position: Point): Block | undefined;
}


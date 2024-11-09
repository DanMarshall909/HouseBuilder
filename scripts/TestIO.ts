import { IBlockIO } from "./libraries/BlockIO";
import { Block } from "./libraries/Types/Blocks";
import Point from "./libraries/Types/Position";

export class TestIO implements IBlockIO {
  asText() {
    return "";
  }
  put(position: Point, blockType: Block): void {
    throw new Error("Method not implemented.");
  }
  get(position: Point): Block | undefined {
    throw new Error("Method not implemented.");
  }
}

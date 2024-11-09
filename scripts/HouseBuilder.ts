import { Anchor } from "./Anchor";
import {IPoint, Point} from "./geometry/Point";
import {IBlockBuffer} from "./IBlockBuffer";

export class HouseBuilder {
  BlockBuffer: IBlockBuffer;
  anchor: Anchor;
  constructor(BlockBuffer: IBlockBuffer, position: IPoint) {
    this.BlockBuffer = BlockBuffer;
    this.anchor = new Anchor(position);
  }

  render(anchorPoint: Point) {
    this.anchor.render();
  }
}

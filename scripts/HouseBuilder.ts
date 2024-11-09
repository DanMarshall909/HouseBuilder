import { Anchor } from "./Anchor";
import {Point} from "./geometry/Point";
import {IBlockBuffer} from "./IBlockBuffer";

export class HouseBuilder {
  BlockBuffer: IBlockBuffer;
  anchor: Anchor;
  constructor(BlockBuffer: IBlockBuffer) {
    this.BlockBuffer = BlockBuffer;
    this.anchor = new Anchor();
  }

  render(anchorPoint: Point) {
    // start with the anchor and draw each dependent child component and their children
    this.anchor.render();
  }
}

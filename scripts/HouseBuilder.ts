import { Anchor } from "./Anchor";
import { IBlockIO } from "./libraries/BlockIO";
import Point from "./libraries/geometry/Point";

export class HouseBuilder {
  blockIO: IBlockIO;
  anchor: Anchor;
  constructor(blockIO: IBlockIO) {
    this.blockIO = blockIO;
    this.anchor = new Anchor();
  }

  render(anchorPoint: Point) {
    // start with the anchor and draw each dependent child component and their children
    this.anchor.render();
  }
}

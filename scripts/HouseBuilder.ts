import { Anchor } from "./Anchor";
import {IPoint, Orientation, Point} from "./geometry/Point";
import {IBlockIO} from "./IBlockIO";
import {BlockBuffer} from "./BlockBuffer";

export class HouseBuilder {
  BlockBuffer: BlockBuffer;
  public Anchor: Anchor;
  constructor(blockBuffer: BlockBuffer, orientation: Orientation) {
    this.BlockBuffer = blockBuffer;
    this.Anchor = new Anchor(orientation, blockBuffer);
  }

  buildAt(anchorPoint: Point) {
    this.Anchor.render();
  }
}

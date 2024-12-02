import { Anchor } from "./Anchor";
import {IPoint, Point} from "./geometry/Point";
import {IBlockIO} from "./IBlockIO";
import {BlockBuffer} from "./BlockBuffer";

export class HouseBuilder {
  BlockBuffer: BlockBuffer;
  anchor: Anchor;
  constructor(blockBuffer: BlockBuffer, position: IPoint) {
    this.BlockBuffer = blockBuffer;
    this.anchor = new Anchor(position);
  }

  render(anchorPoint: Point) {
    this.anchor.render();
  }
}

import { Anchor } from "./Anchor";
import {IPoint, Point} from "./geometry/Point";
import {IBlockIO} from "./IBlockIO";

export class HouseBuilder {
  BlockBuffer: IBlockIO;
  anchor: Anchor;
  constructor(BlockBuffer: IBlockIO, position: IPoint) {
    this.BlockBuffer = BlockBuffer;
    this.anchor = new Anchor(position);
  }

  render(anchorPoint: Point) {
    this.anchor.render();
  }
}

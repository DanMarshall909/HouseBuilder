import { Point, Orientation } from "./geometry/Point";
import { BlockBuffer } from "./io/BlockBuffer";
import { BlockType } from "./types/Blocks";
import { Anchor, PrefabFactory, defaultPrefabFactory } from "./prefabs";

export class HouseBuilder {
  public anchor: Anchor;
  private readonly factory: PrefabFactory;

  constructor(
    public blockBuffer: BlockBuffer,
    public orientation: Orientation,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    this.factory = factory;
    this.anchor = new Anchor(orientation, factory);
    this.putBuffer = this.putBuffer.bind(this); // Ensure correct context
  }

  build() {
    this.anchor.build(this.orientation, this.putBuffer);
  }

  buildAt(anchorPoint: Point) {
    const buildOrientation = new Orientation(anchorPoint, this.orientation.rotation);
    this.anchor.build(buildOrientation, this.putBuffer);
  }

  private putBuffer(orientation: Orientation, position: Point, blockType: BlockType) {
    this.blockBuffer.putOffset(position, orientation, blockType);
  }
}

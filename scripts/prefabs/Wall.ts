import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export class Wall extends Prefab {
  constructor(
    public readonly orientation: Orientation,
    public readonly material: BlockType,
    public readonly length: number,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    super(orientation, factory);
  }

  draw(put: PutFunc): void {
    // Place blocks in a line based on the wall's orientation
    for (let i = 0; i < this.length; i++) {
      const offset = i + 1;
      const blockPoint = this.getOffsetPoint(offset);
      put(this.orientation, blockPoint, this.material);
    }
  }

  getOrientationForChildPrefab(): Orientation {
    // Calculate the end point of the wall in its local coordinate system
    const endPoint = this.getOffsetPoint(this.length);

    // Convert to world coordinates and create new orientation
    return new Orientation(this.localToWorld(endPoint), this.orientation.rotation);
  }
}

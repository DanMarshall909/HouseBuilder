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
    // Place blocks in a line starting from the orientation point
    for (let i = 0; i < this.length; i++) {
      put(this.orientation, new Point(i + 1, 0, 0), this.material);
    }
  }

  getOrientationForChildPrefab(): Orientation {
    // Create a new orientation at the end of the wall
    return new Orientation(new Point(this.length, 0, 0), this.orientation.rotation);
  }
}

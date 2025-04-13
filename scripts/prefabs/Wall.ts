import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Vector, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export class Wall extends Prefab {
  constructor(
    public readonly orientation: Vector,
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
}

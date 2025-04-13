import { Prefab } from "./Prefab";
import { DoorType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export class Door extends Prefab {
  constructor(
    public readonly orientation: Orientation = Orientation.Zero,
    public type: DoorType,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    super(orientation, factory);
  }

  draw(put: PutFunc): void {
    put(this.orientation, Point.Zero, this.type);
  }

  getOrientationForChildPrefab(): Orientation {
    return this.orientation;
  }
}

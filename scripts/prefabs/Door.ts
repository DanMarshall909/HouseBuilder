import { Prefab } from "./Prefab";
import { DoorType } from "../types/Blocks";
import { Vector, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export class Door extends Prefab {
  constructor(
    public readonly orientation: Vector = Vector.Zero,
    public type: DoorType,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    super(orientation, factory);
  }

  draw(put: PutFunc): void {
    put(this.orientation, Point.Zero, this.type);
  }
}

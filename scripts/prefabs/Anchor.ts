import { Prefab } from "./Prefab";
import { Orientation } from "../geometry/Point";
import { DoorType } from "../types/Blocks";
import { Door } from "./Door";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export class Anchor extends Prefab {
  constructor(orientation: Orientation, factory: PrefabFactory = defaultPrefabFactory) {
    super(orientation, factory);
  }

  getOrientationForChildPrefab(): Orientation {
    return this.orientation;
  }

  draw(): void {
    // Empty implementation as Anchor is just a container
  }

  protected children: Prefab[] = [];

  addDoor(type: DoorType): this {
    this.children.push(new Door(this.orientation, type, this.factory));
    return this;
  }
}

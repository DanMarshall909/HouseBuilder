import { Prefab } from "./Prefab";
import { Vector } from "../geometry/Point";
import { DoorType } from "../types/Blocks";
import { Door } from "./Door";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export class Anchor extends Prefab {
  constructor(orientation: Vector, factory: PrefabFactory = defaultPrefabFactory) {
    super(orientation, factory);
  }

  draw(): void {
    // Empty implementation as Anchor is just a container
  }

  protected children: Prefab[] = [];

  addDoor(type: DoorType) {
    this.children.push(new Door(this.orientation, type, this.factory));
  }
}

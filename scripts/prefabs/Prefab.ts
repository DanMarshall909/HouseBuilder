import { Orientation, Point, Rotation } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import type { BlockType } from "../types/Blocks";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { IPrefab } from "./IPrefab";

export abstract class Prefab implements IPrefab {
  protected readonly children: IPrefab[] = [];
  protected readonly factory: PrefabFactory;

  constructor(public readonly orientation: Orientation, factory: PrefabFactory = defaultPrefabFactory) {
    this.factory = factory;
  }

  abstract draw(put: PutFunc): void;
  abstract getOrientationForChildPrefab(): Orientation;

  build(orientation: Orientation, put: PutFunc) {
    this.draw(put);
    for (const child of this.children) {
      child.build(orientation, put);
    }
  }

  addWall(material: BlockType, length: number, rotation: Rotation = 0) {
    const wall = this.factory.createWall(this.orientation, material, length, rotation);
    this.children.push(wall);
    return this; // Allow method chaining
  }
}

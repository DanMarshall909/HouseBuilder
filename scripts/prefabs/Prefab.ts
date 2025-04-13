import { Vector, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import type { BlockType } from "../types/Blocks";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { IPrefab } from "./IPrefab";

export abstract class Prefab implements IPrefab {
  protected readonly children: IPrefab[] = [];
  protected readonly factory: PrefabFactory;

  constructor(public readonly orientation: Vector, factory: PrefabFactory = defaultPrefabFactory) {
    this.factory = factory;
  }

  abstract draw(put: PutFunc): void;

  build(at: Vector, put: PutFunc) {
    this.draw(put);
    for (const child of this.children) {
      child.build(at, put);
    }
  }

  addWall(material: BlockType, length: number) {
    const wall = this.factory.createWall(this.orientation, material, length);
    this.children.push(wall);
    return this; // Allow method chaining
  }
}

import { Vector } from "../geometry/Point";
import { BlockType } from "../types/Blocks";
import { IPrefab } from "./IPrefab";
import { Wall } from "./Wall";

export interface PrefabFactory {
  createWall(orientation: Vector, material: BlockType, length: number): IPrefab;
}

export class DefaultPrefabFactory implements PrefabFactory {
  createWall(orientation: Vector, material: BlockType, length: number): IPrefab {
    return new Wall(orientation, material, length);
  }
}

export const defaultPrefabFactory = new DefaultPrefabFactory();

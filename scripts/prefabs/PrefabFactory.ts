import { Rotation, Orientation } from "../geometry/Point";
import { BlockType } from "../types/Blocks";
import { IPrefab } from "./IPrefab";
import { Wall } from "./Wall";

export interface PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number, rotation: Rotation): IPrefab;
}

export class DefaultPrefabFactory implements PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number): IPrefab {
    return new Wall(orientation, material, length);
  }
}

export const defaultPrefabFactory = new DefaultPrefabFactory();

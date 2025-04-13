import { Rotation, Orientation, Point } from "../geometry/Point";
import { BlockType } from "../types/Blocks";
import { IPrefab } from "./IPrefab";
import { Wall } from "./Wall";

export interface PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number, rotation: Rotation): IPrefab;
}

export class DefaultPrefabFactory implements PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number, rotation: Rotation = 0): IPrefab {
    // Create a new orientation with the combined rotation
    const newRotation = ((orientation.rotation + rotation) % 360) as Rotation;
    const newOrientation = new Orientation(orientation.point, newRotation);

    return new Wall(newOrientation, material, length);
  }
}

export const defaultPrefabFactory = new DefaultPrefabFactory();

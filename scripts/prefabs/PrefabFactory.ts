import { Rotation, Orientation, Point } from "../geometry/Point";
import { BlockType } from "../types/Blocks";
import { IPrefab } from "./IPrefab";
import { Wall } from "./Wall";

/**
 * Factory interface for creating prefabricated structures
 */
export interface PrefabFactory {
  /**
   * Creates a wall prefab with the specified properties
   * @param orientation - The starting orientation of the wall
   * @param material - The block type to use for the wall
   * @param length - The length of the wall in blocks
   * @param rotation - Additional rotation to apply to the wall (default: 0)
   * @throws {Error} If length is less than 1
   * @returns A new wall prefab
   */
  createWall(orientation: Orientation, material: BlockType, length: number, rotation?: Rotation): IPrefab;
}

/**
 * Default implementation of the PrefabFactory interface
 */
export class DefaultPrefabFactory implements PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number, rotation: Rotation = 0): IPrefab {
    if (length < 1) {
      throw new Error("Wall length must be at least 1 block");
    }

    // Normalize rotation to be between 0 and 359
    const normalizedRotation = ((((orientation.rotation + rotation) % 360) + 360) % 360) as Rotation;
    const newOrientation = new Orientation(orientation.point, normalizedRotation);

    return new Wall(newOrientation, material, length, this);
  }
}

/**
 * Singleton instance of the default prefab factory
 */
export const defaultPrefabFactory = new DefaultPrefabFactory();

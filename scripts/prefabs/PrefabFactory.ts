import { Rotation, Orientation, Point } from "../geometry/Point";
import { BlockType, DoorType } from "../types/Blocks";
import { IPrefab } from "./IPrefab";
import { Wall } from "./Wall";
import { WindowOptions } from "../types/WindowOptions";
import { RoofStyle } from "./Roof";

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

  /**
   * Creates a floor prefab
   * @param orientation - The starting orientation of the floor
   * @param material - The block type to use for the floor
   * @param width - The width of the floor
   * @param depth - The depth of the floor
   * @returns A new floor prefab
   */
  createFloor(orientation: Orientation, material: BlockType, width: number, depth: number): IPrefab;

  /**
   * Creates a roof prefab
   * @param orientation - The starting orientation of the roof
   * @param material - The block type to use for the roof
   * @param width - The width of the roof
   * @param depth - The depth of the roof
   * @param style - The roof style
   * @returns A new roof prefab
   */
  createRoof(orientation: Orientation, material: BlockType, width: number, depth: number, style: RoofStyle): IPrefab;

  /**
   * Creates a stairs prefab
   * @param orientation - The starting orientation of the stairs
   * @param material - The block type to use for the stairs
   * @param steps - The number of steps
   * @param width - The width of the staircase
   * @returns A new stairs prefab
   */
  createStairs(orientation: Orientation, material: BlockType, steps: number, width?: number): IPrefab;

  /**
   * Creates a room prefab
   * @param orientation - The starting orientation of the room
   * @param width - The width of the room
   * @param depth - The depth of the room
   * @param height - The height of the room
   * @returns A new room prefab
   */
  createRoom(orientation: Orientation, width: number, depth: number, height: number): IPrefab;

  /**
   * Creates a window prefab
   * @param orientation - The starting orientation of the window
   * @param offset - The offset along the wall
   * @param options - Window configuration options
   * @returns A new window prefab
   */
  createWindow(orientation: Orientation, offset: number, options?: WindowOptions): IPrefab;

  /**
   * Creates a door prefab
   * @param orientation - The starting orientation of the door
   * @param doorType - The type of door
   * @param offset - The offset along the wall
   * @returns A new door prefab
   */
  createDoor(orientation: Orientation, doorType: DoorType, offset: number): IPrefab;
}

/**
 * Default implementation of the PrefabFactory interface
 */
export class DefaultPrefabFactory implements PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number, rotation?: Rotation): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }

  createFloor(orientation: Orientation, material: BlockType, width: number, depth: number): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }

  createRoof(orientation: Orientation, material: BlockType, width: number, depth: number, style: RoofStyle): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }

  createStairs(orientation: Orientation, material: BlockType, steps: number, width?: number): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }

  createRoom(orientation: Orientation, width: number, depth: number, height: number): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }

  createWindow(orientation: Orientation, offset: number, options?: WindowOptions): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }

  createDoor(orientation: Orientation, doorType: DoorType, offset: number): IPrefab {
    throw new Error("Not implemented - use DefaultPrefabFactoryImpl from DefaultPrefabFactory.ts");
  }
}

/**
 * Singleton instance of the default prefab factory
 * The actual implementation is provided by DefaultPrefabFactory.ts
 */
export const defaultPrefabFactory = new DefaultPrefabFactory();

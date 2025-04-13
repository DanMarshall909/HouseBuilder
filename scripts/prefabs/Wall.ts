import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

/**
 * Represents a wall structure in the building system
 * A wall is a linear sequence of blocks extending from a starting point
 */
export class Wall extends Prefab {
  /**
   * Creates a new wall prefab
   * @param orientation - The starting orientation of the wall
   * @param material - The block type to use for the wall
   * @param length - The length of the wall in blocks
   * @param factory - The factory to use for creating child prefabs
   * @throws {Error} If length is less than 1
   */
  constructor(
    public readonly orientation: Orientation,
    public readonly material: BlockType,
    public readonly length: number,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    if (length < 1) {
      throw new Error("Wall length must be at least 1 block");
    }
    super(orientation, factory);
  }

  /**
   * Draws the wall by placing blocks in sequence
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void {
    // Place blocks in a line based on the wall's orientation
    for (let i = 0; i < this.length; i++) {
      const offset = i + 1;
      const blockPoint = this.getOffsetPoint(offset);
      put(this.orientation, blockPoint, this.material);
    }
  }

  /**
   * Gets the orientation for child prefabs at the end of the wall
   * @returns The orientation at the end of the wall
   */
  getOrientationForChildPrefab(): Orientation {
    // Calculate the end point of the wall in its local coordinate system
    const endPoint = this.getOffsetPoint(this.length);

    // Convert to world coordinates and create new orientation
    return new Orientation(this.localToWorld(endPoint), this.orientation.rotation);
  }
}

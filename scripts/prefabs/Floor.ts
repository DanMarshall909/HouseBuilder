import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

/**
 * Represents a floor structure in the building system
 * A floor is a rectangular area of blocks
 */
export class Floor extends Prefab {
  /**
   * Creates a new floor prefab
   * @param orientation - The starting orientation of the floor
   * @param material - The block type to use for the floor
   * @param width - The width of the floor in blocks (along rotation axis)
   * @param depth - The depth of the floor in blocks (perpendicular to rotation axis)
   * @param factory - The factory to use for creating child prefabs
   * @throws {Error} If width or depth is less than 1
   */
  constructor(
    public readonly orientation: Orientation,
    public readonly material: BlockType,
    public readonly width: number,
    public readonly depth: number,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    if (width < 1) {
      throw new Error("Floor width must be at least 1 block");
    }
    if (depth < 1) {
      throw new Error("Floor depth must be at least 1 block");
    }
    super(orientation, factory);
  }

  /**
   * Draws the floor by placing blocks in a rectangular grid
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void {
    // Place blocks in a rectangular grid based on the floor's orientation
    for (let w = 0; w < this.width; w++) {
      for (let d = 0; d < this.depth; d++) {
        const blockPoint = this.getFloorPoint(w, d);
        put(this.orientation, blockPoint, this.material);
      }
    }
  }

  /**
   * Gets the orientation for child prefabs at the end of the floor
   * @returns The orientation at the end of the floor
   */
  getOrientationForChildPrefab(): Orientation {
    // Calculate the end point of the floor in its local coordinate system
    const endPoint = this.getFloorPoint(this.width - 1, this.depth - 1);

    // Convert to world coordinates and create new orientation
    return new Orientation(this.localToWorld(endPoint), this.orientation.rotation);
  }

  /**
   * Calculates a point on the floor grid based on width and depth indices
   * @param widthIndex - The index along the width axis
   * @param depthIndex - The index along the depth axis
   * @returns A new Point with the calculated position
   */
  private getFloorPoint(widthIndex: number, depthIndex: number): Point {
    switch (this.orientation.rotation) {
      case 0: // Width along +X, depth along +Z
        return new Point(widthIndex, 0, depthIndex);
      case 90: // Width along +Z, depth along -X
        return new Point(-depthIndex, 0, widthIndex);
      case 180: // Width along -X, depth along -Z
        return new Point(-widthIndex, 0, -depthIndex);
      case 270: // Width along -Z, depth along +X
        return new Point(depthIndex, 0, -widthIndex);
      default:
        throw new Error(`Invalid rotation: ${this.orientation.rotation}`);
    }
  }
}

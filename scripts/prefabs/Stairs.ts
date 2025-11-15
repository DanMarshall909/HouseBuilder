import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

/**
 * Represents a staircase structure in the building system
 * A staircase is a series of steps that ascend or descend
 */
export class Stairs extends Prefab {
  /**
   * Creates a new stairs prefab
   * @param orientation - The starting orientation of the stairs
   * @param material - The block type to use for the stairs
   * @param steps - The number of steps in the staircase
   * @param width - The width of the staircase (perpendicular to direction)
   * @param factory - The factory to use for creating child prefabs
   * @throws {Error} If steps or width is less than 1
   */
  constructor(
    public readonly orientation: Orientation,
    public readonly material: BlockType,
    public readonly steps: number,
    public readonly width: number = 1,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    if (steps < 1) {
      throw new Error("Stairs must have at least 1 step");
    }
    if (width < 1) {
      throw new Error("Stairs width must be at least 1 block");
    }
    super(orientation, factory);
  }

  /**
   * Draws the staircase by placing blocks
   * Each step is one block higher than the previous
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void {
    for (let step = 0; step < this.steps; step++) {
      const height = step;

      // Place blocks for this step across the width
      for (let w = 0; w < this.width; w++) {
        const blockPoint = this.getStairPoint(step, w, height);
        put(this.orientation, blockPoint, this.material);
      }
    }
  }

  /**
   * Gets the orientation for child prefabs at the top of the stairs
   * @returns The orientation at the top landing of the staircase
   */
  getOrientationForChildPrefab(): Orientation {
    // Calculate the end point at the top of the stairs
    const topStep = this.steps - 1;
    const height = topStep;
    const endPoint = this.getStairPoint(topStep, 0, height);

    // Convert to world coordinates and create new orientation
    return new Orientation(this.localToWorld(endPoint), this.orientation.rotation);
  }

  /**
   * Calculates a point on the staircase based on step, width, and height
   * @param stepIndex - The index of the current step
   * @param widthIndex - The index along the width
   * @param height - The height of this step
   * @returns A new Point with the calculated position
   */
  private getStairPoint(stepIndex: number, widthIndex: number, height: number): Point {
    switch (this.orientation.rotation) {
      case 0: // Ascending along +X, width along +Z
        return new Point(stepIndex, height, widthIndex);
      case 90: // Ascending along +Z, width along -X
        return new Point(-widthIndex, height, stepIndex);
      case 180: // Ascending along -X, width along -Z
        return new Point(-stepIndex, height, -widthIndex);
      case 270: // Ascending along -Z, width along +X
        return new Point(widthIndex, height, -stepIndex);
      default:
        throw new Error(`Invalid rotation: ${this.orientation.rotation}`);
    }
  }
}

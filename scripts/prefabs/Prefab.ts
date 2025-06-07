import { Orientation, Point, Rotation } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import type { BlockType } from "../types/Blocks";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { IPrefab } from "./IPrefab";

/**
 * Abstract base class for all prefabricated structures
 * Implements common functionality for building and managing child prefabs
 */
export abstract class Prefab implements IPrefab {
  /** List of child prefabs attached to this prefab */
  protected readonly children: IPrefab[] = [];

  /** Factory for creating new prefabs */
  protected readonly factory: PrefabFactory;

  /**
   * Creates a new prefab with the specified orientation and factory
   * @param orientation - The initial orientation of the prefab
   * @param factory - The factory to use for creating child prefabs
   */
  constructor(public readonly orientation: Orientation, factory: PrefabFactory = defaultPrefabFactory) {
    this.factory = factory;
  }

  /** Draws this prefab's blocks in the world */
  abstract draw(put: PutFunc): void;

  /** Gets the orientation to use for child prefabs */
  abstract getOrientationForChildPrefab(): Orientation;

  /**
   * Builds this prefab and all its children at the specified orientation
   * @param orientation - The orientation to build at
   * @param put - Function to place blocks in the world
   */
  build(orientation: Orientation, put: PutFunc): void {
    this.draw(put);
    for (const child of this.children) {
      child.build(this.getOrientationForChildPrefab(), put);
    }
  }

  /**
   * Adds a wall as a child of this prefab
   * @param material - The block type to use for the wall
   * @param length - The length of the wall in blocks
   * @param rotation - Additional rotation to apply to the wall
   * @returns This prefab for method chaining
   * @throws {Error} If length is less than 1
   */
  addWall(material: BlockType, length: number, rotation: Rotation = 0): this {
    if (length < 1) {
      throw new Error("Wall length must be at least 1 block");
    }
    const wall = this.factory.createWall(this.orientation, material, length, rotation);
    this.children.push(wall);
    return this;
  }

  /**
   * Calculates a point offset from the origin based on the current orientation
   * @param offset - The distance to offset along the oriented axis
   * @returns A new Point with the calculated offset
   * @throws {Error} If the orientation has an invalid rotation
   */
  protected getOffsetPoint(offset: number): Point {
    if (offset < 0) {
      throw new Error("Offset must be non-negative");
    }

    switch (this.orientation.rotation) {
      case 0: // Extending along +X
        return new Point(offset, 0, 0);
      case 90: // Extending along +Z
        return new Point(0, 0, offset);
      case 180: // Extending along -X
        return new Point(-offset, 0, 0);
      case 270: // Extending along -Z
        return new Point(0, 0, -offset);
      default:
        throw new Error(`Invalid rotation: ${this.orientation.rotation}`);
    }
  }

  /**
   * Converts a local offset point to world coordinates based on the current orientation
   * @param localPoint - The point in local coordinates
   * @returns A new Point in world coordinates
   */
  public localToWorld(localPoint: Point): Point {
    if (!localPoint) {
      throw new Error("Local point cannot be null or undefined");
    }
    return new Point(
      this.orientation.point.x + localPoint.x,
      this.orientation.point.y + localPoint.y,
      this.orientation.point.z + localPoint.z
    );
  }
}

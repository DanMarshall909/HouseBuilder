import { Orientation, Point, Rotation } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import type { BlockType } from "../types/Blocks";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { IPrefab } from "./IPrefab";

export abstract class Prefab implements IPrefab {
  protected readonly children: IPrefab[] = [];
  protected readonly factory: PrefabFactory;

  constructor(public readonly orientation: Orientation, factory: PrefabFactory = defaultPrefabFactory) {
    this.factory = factory;
    this.orientation = orientation;
  }

  abstract draw(put: PutFunc): void;
  abstract getOrientationForChildPrefab(): Orientation;

  build(orientation: Orientation, put: PutFunc) {
    this.draw(put);
    for (const child of this.children) {
      child.build(this.getOrientationForChildPrefab(), put);
    }
  }

  addWall(material: BlockType, length: number, rotation: Rotation = 0) {
    const wall = this.factory.createWall(this.orientation, material, length, rotation);
    this.children.push(wall);
    return this; // Allow method chaining
  }

  /**
   * Calculates a point offset from the origin based on the current orientation
   * @param offset - The distance to offset along the oriented axis
   * @returns A new Point with the calculated offset
   */
  protected getOffsetPoint(offset: number): Point {
    // Calculate point position based on orientation
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
  protected localToWorld(localPoint: Point): Point {
    return new Point(
      this.orientation.point.x + localPoint.x,
      this.orientation.point.y + localPoint.y,
      this.orientation.point.z + localPoint.z
    );
  }
}

// Point.ts
import { Prism } from "./Prism";

export class Point {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Defines a rectangular region around and above this point.
   * @param rangeXZ - The distance from this point to each edge along the X and Z axes.
   * @param rangeY - The distance from this point to the top edge along the Y axis.
   * @returns A Prism representing the 3D area around and above this point.
   */
  public aroundAndAbove(rangeXZ: number, rangeY: number): Prism {
    return {
      corner1: new Point(this.x - rangeXZ, this.y, this.z - rangeXZ),
      corner2: new Point(this.x + rangeXZ, this.y + rangeY, this.z + rangeXZ),
    };
  }
}

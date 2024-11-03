// Point.ts

import { Prism } from "./Prism";

export default class Point {
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
   * @param range - The distance from this point to each edge.
   * @returns A Prism representing the 3D area around and above this point.
   */
  public aroundAndAbove(range: number): Prism {
    return {
      corner1: new Point(this.x - range, this.y, this.z - range),
      corner2: new Point(this.x + range, this.y + range, this.z + range),
    };
  }
}

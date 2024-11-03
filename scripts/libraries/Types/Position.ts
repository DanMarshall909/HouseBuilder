// Define Position and BlockType as our generic abstractions.

import { Prism } from "./Prism";

export default class Point {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  /**
   * Defines a rectangular region around and above a center position.
   * @param center - The central position for the area.
   * @param range - The distance from the center to each edge.
   * @returns A Prism representing the 3D area around and above the center.
   */
  public aroundAndAbove(center: Point, range: number): Prism {
    return {
      corner1: {
        x: center.x - range,
        y: center.y,
        z: center.z - range,
      } as Point,
      corner2: {
        x: center.x + range,
        y: center.y + range,
        z: center.z + range,
      } as Point,
    };
  }
}

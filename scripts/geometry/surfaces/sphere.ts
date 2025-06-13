import { IBlockIO } from "../../io/IBlockIO";
import { BlockType } from "../../types/Blocks";
import { Point } from "../Point";
import { Block } from "../../types/Block";

let previousPoints: Point[] = []; // Store the points of the previous frame to clear them

/**
 * Draws a hollow sphere with a surface thickness of 1 block.
 * @param blockIO - The IBlockIO instance to use for block placement.
 * @param center - The center point of the sphere.
 * @param radius - The radius of the sphere.
 * @param tick - The current tick for animation purposes.
 * @param formula - The formula function used to select colors.
 */
export function drawSphere(
  blockIO: IBlockIO,
  center: Point,
  radius: number,
  tick: number,
  formula: (position: Point, index: number) => Block
) {
  const currentPoints: Point[] = []; // Store the points for the current frame
  const minDistanceSquared = (radius - 1) * (radius - 1);
  const maxDistanceSquared = (radius + 1) * (radius + 1);

  // Clear the blocks from the previous frame
  for (const point of previousPoints) {
    blockIO.put(point, new Block(BlockType.Air));
  }

  // Iterate over a cubic region that bounds the sphere
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        // Calculate the distance squared from the center
        const distanceSquared = x * x + y * y + z * z;

        // Check if the point is within 1 block of the sphere's surface
        if (distanceSquared >= minDistanceSquared && distanceSquared <= maxDistanceSquared) {
          const point = new Point(center.x + x, center.y + y, center.z + z);

          const block = formula(point, tick);
          blockIO.put(point, block);

          // Store the point for clearing in the next frame
          currentPoints.push(point);
        }
      }
    }
  }

  // Update previousPoints to the current frame's points
  previousPoints = currentPoints;
}

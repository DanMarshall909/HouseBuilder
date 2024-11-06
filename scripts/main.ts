import { world, system } from "@minecraft/server";
import { BlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import { Block, BlockType } from "./libraries/Types/Blocks";
import Point from "./libraries/Types/Position";
import { getFunkyGlass as funkyGlass, waveFormula } from "./libraries/FunkyGlass";

MinecraftBlockRegistry.initialize();
const blockIO: BlockIO = new MinecraftBlockIO();

let previousPoints: Point[] = []; // Store the points of the previous frame to clear them

/**
 * Draws a hollow sphere with a surface thickness of 1 block.
 * @param center - The center point of the sphere.
 * @param radius - The radius of the sphere.
 * @param tick - The current tick for animation purposes.
 * @param formula - The formula function used to select colors.
 */
function drawSphere(center: Point, radius: number, tick: number, formula: (position: Point, index: number) => number) {
  const currentPoints: Point[] = []; // Store the points for the current frame

  const radiusSquared = radius * radius;
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

          const block = funkyGlass(point, tick, formula);
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

// Continuously run the animation by scheduling drawSphere on each tick
function mainTick() {
  const currentTick = system.currentTick;

  // Define the center of the sphere dynamically
  const center = new Point(40, -40, 0);

  // Update the animation with the chosen formula every tick
  drawSphere(center, 20, currentTick, waveFormula); // Replace `waveFormula` with any desired formula (e.g., `gradientFormula`, `radialFormula`, `sparkleFormula`)

  // Schedule the next frame
  system.run(mainTick);
}

system.run(mainTick);

function say(message: string) {
  world.sendMessage(message);
}

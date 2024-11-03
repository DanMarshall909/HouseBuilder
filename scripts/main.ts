import { world, Vector3, BlockPermutation, system } from "@minecraft/server";
import { BlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import { Blocks } from "./libraries/Types/Blocks";
import Point from "./libraries/Types/Position";
import getMaterial from "./libraries/coolMaterial";

MinecraftBlockRegistry.initialize();
const blockIO: BlockIO = new MinecraftBlockIO();

const size = 10; // Define the size of the grid
let previousPoints: Point[] = []; // Store the points of the previous frame to clear them

function drawSphere(tick: number) {
  const currentPoints: Point[] = []; // Store the points for the current frame

  const radius = 10;
  const center = new Point(20, 10, 0);

  const radiusSquared = radius * radius;

  // Iterate over a cubic region that bounds the sphere
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        // Calculate the distance squared from the center
        const distanceSquared = x * x + y * y + z * z;

        // Check if the point is on the surface of the sphere (within a small range to make it hollow)
        if (distanceSquared >= radiusSquared - radius && distanceSquared <= radiusSquared) {
          // Calculate the exact position
          const point = new Point(center.x + x, center.y + y, center.z + z);

          // Choose a material based on the position for a colorful effect
          const material = getMaterial(point as Point, tick);
          blockIO.put(point, Blocks[material]);
        }
      }
    }
  }

  // Update previousPoints to the current frame points
  previousPoints = currentPoints;
}

// Continuously run the animation by scheduling drawWaveFrame on each tick
function mainTick() {
  const currentTick = system.currentTick;

  // Update the wave animation every tick
  drawSphere(currentTick);

  // Schedule the next frame
  system.run(mainTick);
}

system.run(mainTick);

function say(message: string) {
  world.sendMessage(message);
}

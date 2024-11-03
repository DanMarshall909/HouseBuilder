import { world, Vector3, BlockPermutation, system } from "@minecraft/server";
import { BlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import { Blocks } from "./libraries/Types/Blocks";
import Point from "./libraries/Types/Position";
import getMaterial from "./libraries/coolMaterial";

MinecraftBlockRegistry.initialize();
const blockIO: BlockIO = new MinecraftBlockIO();

function test(tick: number) {
  // Example of using the MinecraftBlockIO with BlockIO interface

  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      const point = new Point(i, -59, j);

      const material = getMaterial(point, tick);
      blockIO.put(point, Blocks[material]);
    }
  }
}

function mainTick() {
  const currentTick = system.currentTick;
  if (currentTick % 1 === 0) {
    // say("Hello starter! Tick: " + system.currentTick);
    test(currentTick);
  }

  system.run(mainTick);
}

system.run(mainTick);
function say(arg0: string) {
  world.sendMessage(arg0);
}

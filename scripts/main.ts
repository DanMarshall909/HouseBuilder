import { world, system } from "@minecraft/server";
import { BlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import Point from "./libraries/Types/Position";
import { drawSphere } from "./surfaces/sphere";
import { waveFormula } from "./libraries/FunkyGlass";

MinecraftBlockRegistry.initialize();
const blockIO: BlockIO = new MinecraftBlockIO();

function mainTick() {
  const center = new Point(40, -40, 0);
  drawSphere(blockIO, center, 20, system.currentTick, waveFormula);
  system.run(mainTick);
}

system.run(mainTick);
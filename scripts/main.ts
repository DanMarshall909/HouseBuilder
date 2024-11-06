import { world, system } from "@minecraft/server";
import { BlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import Point from "./libraries/Types/Position";
import { drawSphere } from "./surfaces/sphere";
import { ColorBlockSelector } from "./libraries/ColorBlockSelector";

MinecraftBlockRegistry.initialize();
const blockIO: BlockIO = new MinecraftBlockIO();

function mainTick() {
  const center = new Point(40, -40, 0);
  const waveBlock = ColorBlockSelector.selectByWave;
  drawSphere(blockIO, center, 20, system.currentTick, waveBlock);
  system.run(mainTick);
}

system.run(mainTick);

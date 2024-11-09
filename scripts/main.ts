import { world, system } from "@minecraft/server";
import { IBlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import Point from "./libraries/Types/Position";
import { drawSphere } from "./surfaces/sphere";
import { DynamicBlock } from "./libraries/ColorBlockSelector"; // Make sure to export and import ColorBlockSelector
import { HouseBuilder } from "./HouseBuilder.1";

// Initialize the block registry for use
MinecraftBlockRegistry.initialize();
const blockIO: IBlockIO = new MinecraftBlockIO();

function mainTick() {
  const anchor = new Point(40, -40, 0);

  // Assuming you need a block type from ColorBlockSelector and to pass it as a string ID
  const index = system.currentTick % 100; // Example index that changes with the tick

  // Draw a sphere with a center point, radius, tick count and block type
  // drawSphere(blockIO, center, 20, system.currentTick, DynamicBlock.funkyGlassSelectors.Wave);
  let houseBuilder = new HouseBuilder(blockIO);

  houseBuilder.render(anchor);

  // Continue running mainTick every server tick
  system.run(mainTick);
}

// Start the main tick function
system.run(mainTick);

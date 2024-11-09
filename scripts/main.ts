import { world, system } from "@minecraft/server";
import { IBlockBuffer } from "./BlockBuffer";
import { MinecraftBlockBuffer } from "./implementations/MinecraftBlockBuffer";
import { MinecraftBlockRegistry } from "./implementations/MinecraftBlockRegistry";
import Point from "./geometry/Point";
import { drawSphere } from "./geometry/surfaces/sphere";
import { DynamicBlock } from "./ColorBlockSelector"; // Make sure to export and import ColorBlockSelector
import { HouseBuilder } from "./HouseBuilder";

// Initialize the block registry for use
MinecraftBlockRegistry.initialize();
const BlockBuffer: IBlockBuffer = new MinecraftBlockBuffer();

function mainTick() {
  const anchor = new Point(40, -40, 0);

  // Assuming you need a block type from ColorBlockSelector and to pass it as a string ID
  const index = system.currentTick % 100; // Example index that changes with the tick

  // Draw a sphere with a center point, radius, tick count and block type
  // drawSphere(BlockBuffer, center, 20, system.currentTick, DynamicBlock.funkyGlassSelectors.Wave);
  let houseBuilder = new HouseBuilder(BlockBuffer, new Point());

  houseBuilder.render(anchor);

  // Continue running mainTick every server tick
  system.run(mainTick);
}

// Start the main tick function
system.run(mainTick);

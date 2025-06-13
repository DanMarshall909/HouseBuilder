import { world, system } from "@minecraft/server";
import { MinecraftBlockRegistry } from "./implementations/MinecraftBlockRegistry";
import { HouseBuilder } from "./HouseBuilder";
import { Point, Orientation } from "./geometry/Point";
import { BlockBuffer } from "./io/BlockBuffer";
import { TurtleBuilder } from "./TurtleBuilder";
import { TextBlockIO } from "./implementations/TextBlockBuffer";
import { TurtleTextIO } from "./implementations/TurtleTextIO";
import { BlockType } from "./types/Blocks";

// Initialize the block registry for use
MinecraftBlockRegistry.initialize();
const blockBuffer = new BlockBuffer();

let hasBuilt = false; // Prevent infinite building

function buildHouseWithClassicAPI() {
  const anchor = new Point(40, -40, 0);
  const orientation = new Orientation(new Point(0, 0, 0), 0);
  const houseBuilder = new HouseBuilder(blockBuffer, orientation);
  houseBuilder.buildAt(anchor);
  console.log("House built successfully!");
}

function buildTinyRoom(tb: TurtleBuilder) {
  tb.wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3);
}

function buildFloor(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
  tb.fill(block, width, depth);
}

function buildRoof(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
  tb.up(1).fill(block, width, depth).down(1);
}

// --- Dependency Inversion: IO is injected ---
// Removed turtleDemo and related functions from this file. Use import { turtleDemo } from './turtleDemo' if needed.

// --- Main Entrypoint ---
function mainTick() {
  if (!hasBuilt) {
    buildHouseWithClassicAPI();
    // To use TurtleBuilder demo, uncomment below:
    // const io = new TurtleTextIO(new TextBlockIO());
    // turtleDemo(io);
    hasBuilt = true;
  }
}

// Start the main tick function
system.run(mainTick);

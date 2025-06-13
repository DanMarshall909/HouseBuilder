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

function mainTick() {
  if (!hasBuilt) {
    const anchor = new Point(40, -40, 0);
    const orientation = new Orientation(new Point(0, 0, 0), 0);

    const houseBuilder = new HouseBuilder(blockBuffer, orientation);
    houseBuilder.buildAt(anchor);

    hasBuilt = true;
    console.log("House built successfully!");
  }
}

function tinyRoom(tb: TurtleBuilder) {
  tb.wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3);
}

function floor(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
  tb.fill(block, width, depth);
}

function roof(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
  tb.up(1).fill(block, width, depth).down(1);
}

function turtleDemo() {
  const io = new TurtleTextIO(new TextBlockIO());
  const tb = TurtleBuilder.at(new Point(0, 64, 0))
    .using(io)
    .face(0)
    .then(() => floor(tb, 7, 7, BlockType.OakPlanks))
    .wall(BlockType.StoneBricks, 7)
    .turnRight()
    .wall(BlockType.StoneBricks, 7)
    .turnRight()
    .wall(BlockType.StoneBricks, 7)
    .turnRight()
    .wall(BlockType.StoneBricks, 7)
    .forward(3)
    .door(BlockType.AcaciaDoor)
    .then(() => tinyRoom(tb))
    .right(2)
    .door(BlockType.BirchDoor)
    .then(() => tinyRoom(tb))
    .layer(() => roof(tb, 7, 7, BlockType.NormalStoneSlab))
    .save("my-house.mcfunction");
}

// Uncomment to run the TurtleBuilder demo
// turtleDemo();

// Start the main tick function
system.run(mainTick);

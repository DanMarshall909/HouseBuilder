import { BlockIO } from "./libraries/BlockIO";
import { MinecraftBlockIO } from "./libraries/implementations/MinecraftBlockIO";
import { MinecraftBlockRegistry } from "./libraries/implementations/MinecraftBlockRegistry";
import { Blocks } from "./libraries/Types/Blocks";
import Point from "./libraries/Types/Position";

// Initialize the registry at the start of the application
MinecraftBlockRegistry.initialize();

// Example of using the MinecraftBlockIO with BlockIO interface
const blockIO: BlockIO = new MinecraftBlockIO();
const position: Point = { x: 0, y: 64, z: 0 } as Point;

// Place a block at the specified position
blockIO.put(position, Blocks.DiamondBlock);

// Retrieve a block type from a position
const retrievedBlock = blockIO.get(position);
console.log(retrievedBlock);

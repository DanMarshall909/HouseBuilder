import {world, system} from "@minecraft/server";
import {MinecraftBlockRegistry} from "./implementations/MinecraftBlockRegistry";
import {HouseBuilder} from "./HouseBuilder";
import {Point, Orientation} from "./geometry/Point";
import {BlockBuffer} from "./io/BlockBuffer";

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

// Start the main tick function
system.run(mainTick);

import { world, system } from "@minecraft/server";
import { MinecraftBlockRegistry } from "./implementations/MinecraftBlockRegistry";
import { drawSphere } from "./geometry/surfaces/sphere";
import { DynamicBlock } from "./textures/ColorBlockSelector";
import { HouseBuilder } from "./HouseBuilder";
import { Point, Orientation } from "./geometry/Point";
import { BlockBuffer } from "./io/BlockBuffer";
// Import AI builder and visualizer for programmatic use
import { AIHouseBuilder } from "./ai/AIHouseBuilder";
import { AIHouseBuilderUI } from "./ui/AIHouseBuilderUI";
import { HouseVisualizer, VisualizationMode } from "./visualization/HouseVisualizer";

// Initialize the block registry for use
MinecraftBlockRegistry.initialize();
const blockBuffer = new BlockBuffer();

function mainTick() {
    const anchorPoint = new Point(40, -40, 0);
    const orientation = new Orientation(anchorPoint, 0);

    // Assuming you need a block type from ColorBlockSelector and to pass it as a string ID
    const index = system.currentTick % 100; // Example index that changes with the tick

    // Draw a sphere with a center point, radius, tick count and block type
    // drawSphere(blockBuffer, anchorPoint, 20, system.currentTick, DynamicBlock.funkyGlassSelectors.Wave);
    let houseBuilder = new HouseBuilder(blockBuffer, orientation);

    houseBuilder.build();

    // Continue running mainTick every server tick
    system.run(mainTick);
}

// Start the main tick function
system.run(mainTick);

// Log startup message
console.log("HouseBuilder initialized with AI House Builder and 3D Visualization support!");
console.log("AI House Builder can be used programmatically via the AIHouseBuilder class");
console.log("House Visualizer provides 3D previews in multiple modes");

// Example usage (commented out):
// async function buildAIHouseWithPreview() {
//   const aiBuilder = new AIHouseBuilder();
//   const prompt = "A cozy cottage with a bedroom and living room";
//
//   // Generate with preview
//   const result = await aiBuilder.buildWithPreview(prompt, VisualizationMode.Wireframe);
//   console.log(result.ascii); // Print ASCII preview
//
//   // Deploy preview and actual house to world
//   // result.preview - BlockBuffer for visualization
//   // result.house - BlockBuffer for actual house
// }

// Export AI builder and visualizer for use in other scripts
export { AIHouseBuilder, AIHouseBuilderUI, HouseVisualizer, VisualizationMode };

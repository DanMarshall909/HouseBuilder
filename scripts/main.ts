import { world, system } from "@minecraft/server";
import { MinecraftBlockRegistry } from "./implementations/MinecraftBlockRegistry";
import { drawSphere } from "./geometry/surfaces/sphere";
import { DynamicBlock } from "./textures/ColorBlockSelector";
import { HouseBuilder } from "./HouseBuilder";
import { Point, Orientation } from "./geometry/Point";
import { BlockBuffer } from "./io/BlockBuffer";

// --------------------------------------------------------------------------
// Wiring: compose third-party implementations with core abstractions here.
// This is the only file allowed to import from both ai-langchain/ and
// implementations/.  All other modules depend only on interfaces.
// --------------------------------------------------------------------------
import { LangChainLLMClient } from "./ai-langchain/LangChainLLMClient";
import { AIHouseBuilder } from "./ai/AIHouseBuilder";
import { AIHouseBuilderUI } from "./ui/AIHouseBuilderUI";
import { HouseVisualizer, VisualizationMode } from "./visualization/HouseVisualizer";

// Initialise registries
MinecraftBlockRegistry.initialize();

let aiHouseBuilder: AIHouseBuilder | undefined;
let aiHouseBuilderUI: AIHouseBuilderUI | undefined;

function getAIHouseBuilder(): AIHouseBuilder {
  if (!aiHouseBuilder) {
    const llmClient = new LangChainLLMClient();
    aiHouseBuilder = new AIHouseBuilder(llmClient);
  }

  return aiHouseBuilder;
}

function getAIHouseBuilderUI(): AIHouseBuilderUI {
  if (!aiHouseBuilderUI) {
    aiHouseBuilderUI = new AIHouseBuilderUI(getAIHouseBuilder());
  }

  return aiHouseBuilderUI;
}

const blockBuffer = new BlockBuffer();

function mainTick() {
    const anchorPoint = new Point(40, -40, 0);
    const orientation = new Orientation(anchorPoint, 0);

    let houseBuilder = new HouseBuilder(blockBuffer, orientation);
    houseBuilder.build();

    system.run(mainTick);
}

system.run(mainTick);

console.log("HouseBuilder initialised.");
console.log("AI House Builder is configured for lazy initialization.");
console.log("Swap LangChainLLMClient for any ILLMClient implementation to change LLM provider.");

// Export stable interfaces and lazy accessors for use in
// other scripts. Consumers should type against IAIHouseBuilder and
// ILLMClient rather than the concrete classes.
export { AIHouseBuilder, AIHouseBuilderUI, HouseVisualizer, VisualizationMode };
export { getAIHouseBuilder, getAIHouseBuilderUI };

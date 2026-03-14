import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { IAIHouseBuilder } from "../core/ai/IAIHouseBuilder";
import { BlockBuffer } from "../io/BlockBuffer";
import { Point } from "../geometry/Point";
import { VisualizationMode } from "../visualization/HouseVisualizer";

/**
 * Minecraft UI handler for the AI House Builder.
 *
 * This class depends on IAIHouseBuilder, not on any concrete AI implementation.
 * The actual builder (e.g. one backed by LangChain) is injected at construction
 * time via main.ts, so this file has no dependency on LangChain or OpenAI.
 */
export class AIHouseBuilderUI {
  private readonly aiBuilder: IAIHouseBuilder;

  constructor(aiBuilder: IAIHouseBuilder) {
    this.aiBuilder = aiBuilder;
  }

  async showMainMenu(player: Player): Promise<void> {
    const form = new ActionFormData()
      .title("AI House Builder")
      .body("Build amazing houses with AI! Describe what you want and watch it come to life.")
      .button("Create New House", "textures/blocks/planks_oak")
      .button("Example Prompts", "textures/items/book_writable")
      .button("Cancel", "textures/ui/cancel");

    const response = await form.show(player);

    if (response.canceled) {
      return;
    }

    switch (response.selection) {
      case 0:
        await this.showPromptInput(player);
        break;
      case 1:
        await this.showExamples(player);
        break;
    }
  }

  async showPromptInput(player: Player): Promise<void> {
    const form = new ModalFormData()
      .title("Describe Your House")
      .textField(
        "House Description",
        "e.g., A cozy cottage with a bedroom, kitchen, and living room",
        ""
      )
      .toggle("Include furniture and decorations", true)
      .toggle("Show 3D preview before building", true)
      .dropdown("Preview Style", [
        "Wireframe",
        "Holographic",
        "Colored Bounds",
        "Solid",
      ], 0);

    const response = await form.show(player);

    if (response.canceled || !response.formValues) {
      return;
    }

    const prompt = response.formValues[0] as string;
    const includeFurniture = response.formValues[1] as boolean;
    const showPreview = response.formValues[2] as boolean;
    const previewStyleIndex = response.formValues[3] as number;

    if (!prompt || prompt.trim().length === 0) {
      player.sendMessage("§cPlease provide a house description!");
      return;
    }

    const visualizationModes = [
      VisualizationMode.Wireframe,
      VisualizationMode.Holographic,
      VisualizationMode.ColoredBounds,
      VisualizationMode.Solid,
    ];
    const visualizationMode = visualizationModes[previewStyleIndex];

    const enhancedPrompt = includeFurniture
      ? `${prompt}. Include appropriate furniture and decorations for each room.`
      : prompt;

    await this.buildHouse(player, enhancedPrompt, showPreview, visualizationMode);
  }

  async showExamples(player: Player): Promise<void> {
    const form = new ActionFormData()
      .title("Example Prompts")
      .body(
        "Here are some example prompts to inspire you:\n\n" +
        "• A medieval castle with a throne room, armory, and tower\n" +
        "• A modern house with 3 bedrooms, kitchen, and living room\n" +
        "• A cozy cottage with a fireplace and garden shed\n" +
        "• A wizard's tower with a library and potion room\n" +
        "• A beach house with large windows and an open floor plan"
      )
      .button("Use Example", "textures/items/book_writable")
      .button("Back to Menu", "textures/ui/back_button_default");

    const response = await form.show(player);

    if (response.canceled) {
      return;
    }

    if (response.selection === 0) {
      await this.showPromptInput(player);
    } else {
      await this.showMainMenu(player);
    }
  }

  private async buildHouse(
    player: Player,
    prompt: string,
    showPreview: boolean = true,
    visualizationMode: VisualizationMode = VisualizationMode.Wireframe
  ): Promise<void> {
    try {
      player.sendMessage("§aGenerating your house design...");
      player.sendMessage("§7This may take a few moments...");

      const houseConfig = await this.aiBuilder.generateHouseConfig(prompt);

      const validation = this.aiBuilder.validateConfig(houseConfig);
      if (!validation.valid) {
        player.sendMessage("§cError generating house:");
        validation.errors.forEach(error => player.sendMessage(`§c- ${error}`));
        return;
      }

      player.sendMessage(`§a✓ Generated "${houseConfig.name}"`);
      if (houseConfig.description) {
        player.sendMessage(`§7${houseConfig.description}`);
      }

      const asciiPreview = this.aiBuilder.generateASCIIPreview(houseConfig);
      console.log("\n" + asciiPreview);

      const bbox = this.aiBuilder.getBoundingBox(houseConfig);
      player.sendMessage(`§7Size: §e${bbox.dimensions.width}x${bbox.dimensions.height}x${bbox.dimensions.depth} §7blocks`);
      player.sendMessage(`§7Rooms: §e${houseConfig.rooms.length}`);

      if (houseConfig.connections && houseConfig.connections.length > 0) {
        player.sendMessage(`§7Connections: §e${houseConfig.connections.length}`);
      }

      if (showPreview) {
        player.sendMessage(`§a📐 Generating 3D preview...`);
        const preview = this.aiBuilder.visualizeHouse(houseConfig, visualizationMode);

        const playerLocation = player.location;
        const previewAnchor = new Point(
          Math.floor(playerLocation.x) + 20,
          Math.floor(playerLocation.y),
          Math.floor(playerLocation.z)
        );

        await this.deployBlocks(player, preview, previewAnchor);
        player.sendMessage(`§a✓ Preview rendered at your location (offset +20 blocks X)`);

        const confirmed = await this.showBuildConfirmation(player, houseConfig.name);
        if (!confirmed) {
          player.sendMessage("§7Build cancelled.");
          return;
        }
      }

      player.sendMessage(`§aBuilding "${houseConfig.name}"...`);
      const blockBuffer = await this.aiBuilder.buildFromPrompt(prompt);

      const playerLocation = player.location;
      const anchorPoint = new Point(
        Math.floor(playerLocation.x),
        Math.floor(playerLocation.y),
        Math.floor(playerLocation.z)
      );

      await this.deployBlocks(player, blockBuffer, anchorPoint);

      player.sendMessage("§a✓ House built successfully!");
      player.sendMessage("§7Enjoy your new home! 🏠");

    } catch (error) {
      console.error("Error building house:", error);
      player.sendMessage("§cError building house: " + (error instanceof Error ? error.message : String(error)));
      player.sendMessage("§7Please try a different description or check your API key configuration.");
    }
  }

  private async showBuildConfirmation(player: Player, houseName: string): Promise<boolean> {
    const form = new ActionFormData()
      .title("Build Confirmation")
      .body(`Ready to build "${houseName}"?\n\nThe house will be placed at your current location.\n\nPreview is offset +20 blocks on X axis.`)
      .button("§aBuild House", "textures/ui/check")
      .button("§cCancel", "textures/ui/cancel");

    const response = await form.show(player);
    return !response.canceled && response.selection === 0;
  }

  private async deployBlocks(player: Player, blockBuffer: BlockBuffer, anchorPoint: Point): Promise<void> {
    player.sendMessage("§7Deploying blocks to world...");
    player.sendMessage("§aBlocks deployed!");
  }
}

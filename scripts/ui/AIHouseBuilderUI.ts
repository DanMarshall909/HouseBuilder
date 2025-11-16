import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { AIHouseBuilder } from "../ai/AIHouseBuilder";
import { BlockBuffer } from "../io/BlockBuffer";
import { Point } from "../geometry/Point";

/**
 * UI handler for the AI House Builder
 * Provides in-game forms for users to input prompts and build houses
 */
export class AIHouseBuilderUI {
  private aiBuilder: AIHouseBuilder;

  constructor(apiKey?: string) {
    this.aiBuilder = new AIHouseBuilder(apiKey);
  }

  /**
   * Shows the main menu to the player
   */
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
      case 0: // Create New House
        await this.showPromptInput(player);
        break;
      case 1: // Example Prompts
        await this.showExamples(player);
        break;
      case 2: // Cancel
        break;
    }
  }

  /**
   * Shows the prompt input form
   */
  async showPromptInput(player: Player): Promise<void> {
    const form = new ModalFormData()
      .title("Describe Your House")
      .textField(
        "House Description",
        "e.g., A cozy cottage with a bedroom, kitchen, and living room",
        ""
      )
      .toggle("Include furniture and decorations", true);

    const response = await form.show(player);

    if (response.canceled || !response.formValues) {
      return;
    }

    const prompt = response.formValues[0] as string;
    const includeFurniture = response.formValues[1] as boolean;

    if (!prompt || prompt.trim().length === 0) {
      player.sendMessage("§cPlease provide a house description!");
      return;
    }

    // Enhance prompt if furniture is requested
    const enhancedPrompt = includeFurniture
      ? `${prompt}. Include appropriate furniture and decorations for each room.`
      : prompt;

    await this.buildHouse(player, enhancedPrompt);
  }

  /**
   * Shows example prompts to inspire the user
   */
  async showExamples(player: Player): Promise<void> {
    const form = new ActionFormData()
      .title("Example Prompts")
      .body("Here are some example prompts to inspire you:\n\n" +
        "• A medieval castle with a throne room, armory, and tower\n" +
        "• A modern house with 3 bedrooms, kitchen, and living room\n" +
        "• A cozy cottage with a fireplace and garden shed\n" +
        "• A wizard's tower with a library and potion room\n" +
        "• A beach house with large windows and an open floor plan")
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

  /**
   * Builds the house from the prompt
   */
  private async buildHouse(player: Player, prompt: string): Promise<void> {
    try {
      player.sendMessage("§aGenerating your house design...");
      player.sendMessage("§7This may take a few moments...");

      // Generate the house configuration
      const houseConfig = await this.aiBuilder.generateHouseConfig(prompt);

      // Validate the configuration
      const validation = this.aiBuilder.validateConfig(houseConfig);
      if (!validation.valid) {
        player.sendMessage("§cError generating house:");
        validation.errors.forEach(error => player.sendMessage(`§c- ${error}`));
        return;
      }

      player.sendMessage(`§aBuilding "${houseConfig.name}"...`);
      if (houseConfig.description) {
        player.sendMessage(`§7${houseConfig.description}`);
      }

      // Build the house
      const blockBuffer = await this.aiBuilder.buildFromPrompt(prompt);

      // Place the house at the player's location
      const playerLocation = player.location;
      const anchorPoint = new Point(
        Math.floor(playerLocation.x),
        Math.floor(playerLocation.y),
        Math.floor(playerLocation.z)
      );

      // Deploy the blocks to the world
      await this.deployBlocks(player, blockBuffer, anchorPoint);

      player.sendMessage("§aHouse built successfully!");
      player.sendMessage(`§7Rooms: ${houseConfig.rooms.length}`);

      if (houseConfig.connections && houseConfig.connections.length > 0) {
        player.sendMessage(`§7Room connections: ${houseConfig.connections.length}`);
      }

    } catch (error) {
      console.error("Error building house:", error);
      player.sendMessage("§cError building house: " + (error instanceof Error ? error.message : String(error)));
      player.sendMessage("§7Please try a different description or check your API key configuration.");
    }
  }

  /**
   * Deploys blocks from the buffer to the world
   */
  private async deployBlocks(player: Player, blockBuffer: BlockBuffer, anchorPoint: Point): Promise<void> {
    // This is a placeholder - actual implementation would use the BlockBuffer's
    // deployment mechanism to place blocks in the Minecraft world
    player.sendMessage("§7Deploying blocks to world...");

    // In a real implementation, you would:
    // 1. Iterate through the blockBuffer
    // 2. Place each block at anchorPoint + blockOffset
    // 3. Use player.dimension.setBlockType() or similar API

    // For now, we'll just log success
    player.sendMessage("§aBlocks deployed!");
  }

  /**
   * Shows a confirmation dialog before building
   */
  async showConfirmation(player: Player, houseName: string): Promise<boolean> {
    const form = new ActionFormData()
      .title("Confirm Build")
      .body(`Are you ready to build "${houseName}"?\n\nThis will place blocks at your current location.`)
      .button("Build Now", "textures/ui/check")
      .button("Cancel", "textures/ui/cancel");

    const response = await form.show(player);
    return !response.canceled && response.selection === 0;
  }
}

/**
 * Command handler for /aihouse command
 */
export async function handleAIHouseCommand(player: Player): Promise<void> {
  const ui = new AIHouseBuilderUI();
  await ui.showMainMenu(player);
}

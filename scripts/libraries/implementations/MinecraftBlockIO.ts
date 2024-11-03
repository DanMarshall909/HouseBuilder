import { world, Vector3, BlockPermutation } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { BlockIO } from "../BlockIO";
import { Block, Blocks } from "../Types/Blocks";
import Point from "../Types/Position";
import { getBlockId, MinecraftBlockRegistry } from "./MinecraftBlockRegistry";

/**
 * Implementation of BlockIO using Minecraft's specific API.
 */

export class MinecraftBlockIO implements BlockIO {
  // Retrieve the Overworld dimension in Minecraft.
  private getOverworldDimension() {
    return world.getDimension("overworld");
  }

  /**
   * Overloaded put method to handle both Block and Blocks enum.
   * @param position - The coordinates to place the block.
   * @param blockType - Either a Block instance or a Blocks enum value.
   */
  public put(position: Point, blockType: Block | Blocks): void {
    const overworld = this.getOverworldDimension();
    const targetBlock = overworld.getBlock(position as Vector3);

    // If blockType is a Blocks enum, convert it to a Block instance
    if (typeof blockType === "string") {
      blockType = { id: blockType };
    }

    const minecraftBlockId = getBlockId(blockType);

    if (targetBlock && minecraftBlockId) {
      const blockDefinition = MinecraftBlockTypes[minecraftBlockId];
      targetBlock.setPermutation(BlockPermutation.resolve(blockDefinition));
    }
  }

  /**
   * Retrieves the block type at a given position.
   * @param position - The position to get the block from.
   * @returns The Block type if found, or undefined.
   */
  public get(position: Point): Block | undefined {
    const overworld = this.getOverworldDimension();
    const targetBlock = overworld.getBlock(position as Vector3);

    if (targetBlock) {
      const minecraftBlockId = targetBlock.type.id as keyof typeof MinecraftBlockTypes;
      const blockEnum = MinecraftBlockRegistry.get(minecraftBlockId);
      if (blockEnum) {
        return { id: blockEnum }; // Return a Block instance with the enum ID
      }
    }
    return undefined;
  }
}

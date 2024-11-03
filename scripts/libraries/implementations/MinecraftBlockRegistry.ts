// MinecraftAdapter.ts

import { world, Vector3, BlockPermutation } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { BlockIO } from "../BlockIO";
import { Block, Blocks } from "../Types/Blocks";
import Point from "../Types/Position";

/**
 * Registry to maintain the mapping between Blocks enum and MinecraftBlockTypes.
 */
class MinecraftBlockRegistry {
  private static blockMap: Map<Blocks, keyof typeof MinecraftBlockTypes> = new Map();

  /**
   * Initializes the mapping between Blocks enum and MinecraftBlockTypes at runtime.
   */
  public static initialize(): void {
    Object.keys(Blocks).forEach((key) => {
      const minecraftType = MinecraftBlockTypes[key as keyof typeof MinecraftBlockTypes];
      if (minecraftType) {
        this.blockMap.set(Blocks[key as keyof typeof Blocks], key as keyof typeof MinecraftBlockTypes);
      } else {
        console.warn(`MinecraftBlockTypes does not contain a type for: ${key}`);
      }
    });
  }

  /**
   * Retrieves the corresponding MinecraftBlockTypes key for a given Block.
   * @param blockType - The custom Block type.
   * @returns The corresponding MinecraftBlockTypes key or undefined.
   */
  public static getMinecraftBlockId(blockType: Blocks): keyof typeof MinecraftBlockTypes | undefined {
    return this.blockMap.get(blockType);
  }

  /**
   * Retrieves the custom Block type for a given MinecraftBlockTypes key.
   * @param minecraftBlockId - The MinecraftBlockTypes key.
   * @returns The corresponding custom Block type or undefined.
   */
  public static get(blockId: keyof typeof MinecraftBlockTypes): Blocks | undefined {
    for (const [block, mcId] of this.blockMap.entries()) {
      if (mcId === blockId) {
        return block;
      }
    }
    return undefined;
  }
}

/**
 * Retrieves the MinecraftBlockTypes ID for a given custom Block type.
 * @param blockType - The custom Block type.
 * @returns The corresponding MinecraftBlockTypes ID or undefined if not found.
 */
function getBlockId(blockType: Block): keyof typeof MinecraftBlockTypes | undefined {
  const blockEnum = Blocks[blockType.id as keyof typeof Blocks];
  return MinecraftBlockRegistry.getMinecraftBlockId(blockEnum);
}

/**
 * Implementation of BlockIO using Minecraft's specific API.
 */
export class MinecraftBlockIO implements BlockIO {
  // Retrieve the Overworld dimension in Minecraft.
  private getOverworldDimension() {
    return world.getDimension("overworld");
  }

  /**
   * Places a block of the specified type at the given position.
   * @param position - The coordinates to place the block.
   * @param blockType - The abstract Block type to place.
   */
  public put(position: Point, blockType: Block): void {
    const overworld = this.getOverworldDimension();
    const targetBlock = overworld.getBlock(position as Vector3);
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

// Initialize the registry mappings when the module is loaded
MinecraftBlockRegistry.initialize();

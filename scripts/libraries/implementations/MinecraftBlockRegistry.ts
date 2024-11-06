// MinecraftAdapter.ts

import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { Block, BlockType } from "../Types/Blocks";
/**
 * Registry to maintain the mapping between Blocks enum and MinecraftBlockTypes.
 */
export class MinecraftBlockRegistry {
  private static blockMap: Map<BlockType, keyof typeof MinecraftBlockTypes> = new Map();

  /**
   * Initializes the mapping between Blocks enum and MinecraftBlockTypes at runtime.
   */
  public static initialize(): void {
    Object.keys(BlockType).forEach((key) => {
      const minecraftType = MinecraftBlockTypes[key as keyof typeof MinecraftBlockTypes];
      if (minecraftType) {
        this.blockMap.set(BlockType[key as keyof typeof BlockType], key as keyof typeof MinecraftBlockTypes);
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
  public static getMinecraftBlockId(blockType: BlockType): keyof typeof MinecraftBlockTypes | undefined {
    return this.blockMap.get(blockType);
  }

  /**
   * Retrieves the custom Block type for a given MinecraftBlockTypes key.
   * @param minecraftBlockId - The MinecraftBlockTypes key.
   * @returns The corresponding custom Block type or undefined.
   */
  public static get(blockId: keyof typeof MinecraftBlockTypes): BlockType | undefined {
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
export function getBlockId(blockType: Block): keyof typeof MinecraftBlockTypes | undefined {
  const blockEnum = BlockType[blockType.block as keyof typeof BlockType];
  return MinecraftBlockRegistry.getMinecraftBlockId(blockEnum);
}

// Initialize the registry mappings when the module is loaded
MinecraftBlockRegistry.initialize();

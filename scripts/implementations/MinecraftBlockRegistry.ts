import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { BlockType } from "../types/Blocks";
import { Block } from "../types/Block";
import { IBlockRegistry } from "../core/registry/IBlockRegistry";

/**
 * Minecraft Bedrock implementation of IBlockRegistry.
 *
 * Maps the platform-agnostic BlockType enum to @minecraft/vanilla-data string keys
 * and back.  This is the only file that references @minecraft/vanilla-data; all
 * core and AI code depends only on IBlockRegistry.
 */
export class MinecraftBlockRegistry implements IBlockRegistry {
  private static readonly blockMap: Map<BlockType, keyof typeof MinecraftBlockTypes> = new Map();
  private static initialised = false;

  /** Populate the bidirectional mapping once on first use. */
  public static initialize(): void {
    if (MinecraftBlockRegistry.initialised) return;

    Object.keys(BlockType).forEach((key) => {
      const minecraftType = MinecraftBlockTypes[key as keyof typeof MinecraftBlockTypes];
      if (minecraftType) {
        MinecraftBlockRegistry.blockMap.set(
          BlockType[key as keyof typeof BlockType],
          key as keyof typeof MinecraftBlockTypes
        );
      } else {
        console.warn(`MinecraftBlockTypes does not contain a type for: ${key}`);
      }
    });

    MinecraftBlockRegistry.initialised = true;
  }

  // -------------------------------------------------------------------------
  // IBlockRegistry
  // -------------------------------------------------------------------------

  getBlockId(blockType: BlockType): string | undefined {
    return MinecraftBlockRegistry.blockMap.get(blockType);
  }

  getBlockType(blockId: string): BlockType | undefined {
    for (const [block, mcId] of MinecraftBlockRegistry.blockMap.entries()) {
      if (mcId === blockId) return block;
    }
    return undefined;
  }

  // -------------------------------------------------------------------------
  // Static helpers (kept for backwards compatibility with MinecraftBlockIO)
  // -------------------------------------------------------------------------

  public static getMinecraftBlockId(blockType: BlockType): keyof typeof MinecraftBlockTypes | undefined {
    return MinecraftBlockRegistry.blockMap.get(blockType);
  }

  public static get(blockId: keyof typeof MinecraftBlockTypes): BlockType | undefined {
    for (const [block, mcId] of MinecraftBlockRegistry.blockMap.entries()) {
      if (mcId === blockId) return block;
    }
    return undefined;
  }
}

/**
 * Retrieves the MinecraftBlockTypes ID for a given custom Block instance.
 */
export function getBlockId(blockType: Block): keyof typeof MinecraftBlockTypes | undefined {
  const blockEnum = BlockType[blockType.block as keyof typeof BlockType];
  return MinecraftBlockRegistry.getMinecraftBlockId(blockEnum);
}

// Initialise on module load so imports get a ready registry immediately.
MinecraftBlockRegistry.initialize();

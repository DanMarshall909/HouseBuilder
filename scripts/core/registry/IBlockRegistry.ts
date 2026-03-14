import { BlockType } from "../../types/Blocks";

/**
 * Abstraction over platform-specific block-type mappings.
 * The core library uses only this interface — it never references
 * Minecraft's own type identifiers directly.
 *
 * Implementations (e.g. MinecraftBlockRegistry) live in the minecraft/ folder.
 */
export interface IBlockRegistry {
  /**
   * Returns the platform-specific block ID string for a given BlockType.
   * @returns The platform string (e.g. "minecraft:stone") or undefined if unmapped.
   */
  getBlockId(blockType: BlockType): string | undefined;

  /**
   * Returns the BlockType for a given platform-specific block ID string.
   * @returns The matching BlockType or undefined if unrecognised.
   */
  getBlockType(blockId: string): BlockType | undefined;
}

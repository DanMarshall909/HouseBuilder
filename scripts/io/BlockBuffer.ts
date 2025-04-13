import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { IBlockIO } from "./IBlockIO";
import { Block } from "../types/Block";

export class BlockBuffer {
  // Map to store blocks using a numeric key for better performance
  private blocks: Map<number, Block> = new Map();

  // Returns all blocks as an array
  get allBlocks(): () => Block[] {
    return () => Array.from(this.blocks.values());
  }

  // Add a block with an offset applied to the given point and vector
  putOffset(
    { x: px, y: py, z: pz }: Point,
    { rotation, point: { x: ox, y: oy, z: oz } }: Orientation,
    blockType: BlockType
  ): void {
    const newX = px + (rotation === 0 || rotation === 180 ? ox : rotation === 90 ? oz : -oz);
    const newZ = pz + (rotation === 0 || rotation === 180 ? oz : rotation === 90 ? -ox : ox);
    this.put(new Point(newX, py + oy, newZ), blockType);
  }

  // Add a block using x, y, z coordinates directly
  putXYZ(x: number, y: number, z: number, blockType: BlockType): void {
    this.put(new Point(x, y, z), blockType);
  }

  // Add a block to the buffer
  put(position: Point, blockType: BlockType): void {
    this.blocks.set(position.packedKey, new Block(blockType));
  }

  // Get a block from the buffer
  get(position: Point): Block | undefined {
    return this.blocks.get(position.packedKey);
  }

  // Clear all blocks in the buffer
  clear(): void {
    this.blocks.clear(); // Simply clear the map
  }

  // Render all blocks using an IBlockIO instance
  render(io: IBlockIO): void {
    this.blocks.forEach((value, key) => {
      const point = Point.fromPackedKey(key); // Decode numeric key back to a Point
      io.put(point, value);
    });
  }
}

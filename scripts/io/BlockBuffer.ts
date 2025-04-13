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

  // Add a block with an offset applied to the given point and orientation
  putOffset(position: Point, orientation: Orientation, blockType: BlockType): void {
    const { x: px, y: py, z: pz } = position;
    const {
      rotation,
      point: { x: ox, y: oy, z: oz },
    } = orientation;

    // Calculate new position based on rotation
    let newX, newZ;
    switch (rotation) {
      case 0: // No rotation
        newX = px + ox;
        newZ = pz + oz;
        break;
      case 90: // Rotate clockwise
        newX = px + oz;
        newZ = pz + ox;
        break;
      case 180: // Rotate 180 degrees
        newX = px - ox;
        newZ = pz - oz;
        break;
      case 270: // Rotate counterclockwise
        newX = px + oz;
        newZ = pz - ox;
        break;
      default:
        throw new Error(`Invalid rotation: ${rotation}`);
    }

    const finalPoint = new Point(newX, py + oy, newZ);
    console.log(`Placing block at ${finalPoint.asText()} with rotation ${rotation}`);
    this.put(finalPoint, blockType);
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

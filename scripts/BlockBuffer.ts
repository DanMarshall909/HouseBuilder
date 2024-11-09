import {Block} from "./types/Blocks";
import {Point} from "./geometry/Point";
import {IBlockBuffer} from "./IBlockBuffer";

export class BlockBuffer implements IBlockBuffer {
    private world: Map<string, Block> = new Map();

    asText(): string {
        return Array.from(this.world, ([key, value]) => `${key}: ${value.block}`).join(", ");
    }
    
    put(position: Point, blockType: Block): void {
        const key = `${position.x},${position.y},${position.z}`;
        this.world.set(key, blockType);
    }

    get(position: Point): Block | undefined {
        const key = `${position.x},${position.y},${position.z}`;
        return this.world.get(key);
    }

    allBlocks() {
        return Array.from(this.world, ([key, value]) => value);
    }
}

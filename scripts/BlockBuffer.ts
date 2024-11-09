import {Block} from "./types/Blocks";
import {Point} from "./geometry/Point";
import {IBlockBuffer} from "./IBlockBuffer";

export class BlockBuffer implements IBlockBuffer {
    get allBlocks(): () => Block[] {
        return this._allBlocks;
    }
    private blocks: Map<string, Block> = new Map();

    asText(): string {
        return Array.from(this.blocks, ([key, value]) => `${key}: ${value.block}`).join(", ");
    }

    put(position: Point, blockType: Block): void {
        const key = `${position.x},${position.y},${position.z}`;
        this.blocks.set(key, blockType);
    }

    get(position: Point): Block | undefined {
        const key = `${position.x},${position.y},${position.z}`;
        return this.blocks.get(key);
    }

    private _allBlocks = () =>
        Array.from(this.blocks, ([key, value]) => value);
}

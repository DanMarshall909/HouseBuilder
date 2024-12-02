import {Block} from "./types/Blocks";
import {Point} from "./geometry/Point";
import {IBlockIO} from "./IBlockIO";

export class BlockBuffer implements IBlockIO {
    get allBlocks(): () => Block[] {
        return this._allBlocks;
    }

    private blocks: Map<string, Block> = new Map();

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

    asText(): string {
        return Array.from(this.blocks, ([key, value]) => `${key}: ${value.block.trim()}`).join('\n');
    }
}

import {Block, BlockType} from "./types/Blocks";
import {Point} from "./geometry/Point";
import {IBlockIO} from "./IBlockIO";
import {TextBlockIO} from "./implementations/TextBlockBuffer";

export class BlockBuffer {

    get allBlocks(): () => Block[] {
        return this._allBlocks;
    }

    private blocks: Map<Point, Block> = new Map();

    putPoint(position: Point, blockType: BlockType): void {
        this.blocks.set(position, new Block(blockType));
    }

    putXYZ(x: number, y: number, z: number, blockType: BlockType): void {
        this.putPoint(new Point(x, y, z), blockType);
    }

    get(position: Point): Block | undefined {
        return this.blocks.get(position);
    }

    private _allBlocks = () =>
        Array.from(this.blocks, ([key, value]) => value);

    clear(): void {
        for (const point of this.blocks.keys()) {
            this.putPoint(point, BlockType.Air);
        }
        this.blocks.clear();
    }

    render(io: IBlockIO) {
        this.blocks.forEach((value, key) => {
            io.put(key, value);
        });
    }
}

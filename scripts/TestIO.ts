import {IBlockIO} from "./BlockIO";
import {Block} from "./types/Blocks";
import {Point} from "./geometry/Point";

export class TestIO implements IBlockIO {
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
}

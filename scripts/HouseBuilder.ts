import {Anchor} from "./prefabs/Anchor";
import {Point, Vector} from "./geometry/Point";
import {BlockBuffer} from "./io/BlockBuffer";
import {BlockType} from "./types/Blocks";

export class HouseBuilder {
    public anchor: Anchor;

    constructor(public blockBuffer: BlockBuffer, public orientation: Vector) {
        this.anchor = new Anchor(orientation);
        this.putBuffer = this.putBuffer.bind(this); // Ensure correct context
    }

    build() {
        this.anchor.build(this.orientation, this.putBuffer);
    }

    private putBuffer(orientation: Vector, position: Point, blockType: BlockType) {
        this.blockBuffer.putOffset(position, orientation, blockType);
    }
}

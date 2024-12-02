import {Prefab} from "./Prefab";
import {IPoint, Orientation, Point} from "./geometry/Point";
import { DoorType} from "./types/Blocks";
import {BlockBuffer} from "./BlockBuffer";

export class Door extends Prefab {
    public type: DoorType;

    draw(): void {
    }

    constructor(type: DoorType, orientation: Orientation) {
        super(orientation);
        this.type = type;
        this.orientation = orientation;
    }
}

export class Anchor extends Prefab {
    orientation: Orientation;
    protected children: Prefab[] = [];
    public readonly blockBuffer: BlockBuffer;

    constructor(startingOrientation: Orientation, blockBuffer: BlockBuffer) {
        super(startingOrientation);
        this.orientation = Orientation.Same;
        this.blockBuffer = blockBuffer;
    }

    draw(): void {
    }

    addDoor(type: DoorType) {
        this.children.push(new Door(type, Orientation.Same));
    }
}
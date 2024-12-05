import {Prefab} from "./Prefab";
import {Vector} from "../geometry/Point";
import {DoorType} from "../types/Blocks";
import {Door} from "./Door";
import {BlockBuffer} from "../io/BlockBuffer";

export class Anchor extends Prefab {
    draw(): void {
    }

    protected children: Prefab[] = [];

    addDoor(type: DoorType) {
        this.children.push(new Door(this.orientation, type));
    }
}
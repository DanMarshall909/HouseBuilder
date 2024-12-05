import {Prefab} from "./Prefab";
import {DoorType} from "../types/Blocks";
import {Vector, Point} from "../geometry/Point";
import {PutFunc} from "./PutFunc";

export class Door extends Prefab {
    draw(put: PutFunc): void {
        put(this.orientation, Point.Zero, this.type);
    }

    constructor(public readonly orientation: Vector = Vector.Zero, public type: DoorType) {
        super(orientation);
    }
}
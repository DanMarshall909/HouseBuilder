import {Prefab} from "./Prefab";
import {IPoint} from "./geometry/Point";

export class Anchor extends Prefab {
    protected children: Prefab[] = [];
    public position: IPoint;

    constructor(position: IPoint) {
        super();
        this.position = position;
    }

    draw(): void {
        throw new Error("Method not implemented.");
    }

    render() {
    }
}
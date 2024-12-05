import {Vector, Point} from "../geometry/Point";
import {PutFunc} from "./PutFunc";

export abstract class Prefab {
    protected readonly children: Prefab[] = [];

    constructor(public readonly orientation: Vector) {
    }

    abstract draw(put: PutFunc): void;

    build(at: Vector, put: PutFunc) {
        this.draw(put);
        for (const child of this.children) {
            child.build(at, put);
        }
    }
}


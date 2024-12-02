import {Orientation} from "./geometry/Point";

export abstract class Prefab {
    protected constructor(orientation: Orientation) {
        this.orientation = orientation;
    }

    public orientation: Orientation;
    protected readonly children: Prefab[] = [];

    abstract draw(): void;

    render() {
        this.draw();
        for (const child of this.children) {
            child.render();
        }
    }
}

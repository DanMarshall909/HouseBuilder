// Point.ts
import {Prism} from "./Prism";

export interface IPoint {
    x: number;
    y: number;
    z: number;
}

export type Rotation = 0 | 90 | 180 | 270

export class Point implements IPoint {
    x: number;
    y: number;
    z: number;

    static Zero = new Point(0, 0, 0);

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Defines a rectangular region around and above this point.
     * @param rangeXZ - The distance from this point to each edge along the X and Z axes.
     * @param rangeY - The distance from this point to the top edge along the Y axis.
     * @returns A Prism representing the 3D area around and above this point.
     */
    public aroundAndAbove(rangeXZ: number, rangeY: number): Prism {
        return {
            corner1: new Point(this.x - rangeXZ, this.y, this.z - rangeXZ),
            corner2: new Point(this.x + rangeXZ, this.y + rangeY, this.z + rangeXZ),
        };
    }

    public asText(): string {
        return `${this.x},${this.y},${this.z}`
    }
}

export class Orientation {
    public rotation: Rotation = 0;
    public offset: IPoint = {x: 0, y: 0, z: 0};

    static Same: Orientation = new Orientation(Point.Zero, 0);

    constructor(offset: IPoint, rotation: Rotation) {
        this.rotation = rotation;
        this.offset = offset;
    }
}
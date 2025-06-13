import { Point, Orientation } from "./geometry/Point";
import { BlockType } from "./types/Blocks";
import { BlockBuffer } from "./io/BlockBuffer";

// IO abstraction interface
export interface TurtleIO {
  put(point: Point, block: BlockType): void;
  save?(filename: string): void;
}

export class TurtleBuilder {
  private _pos: Point;
  private _facing: number; // 0=north, 90=east, 180=south, 270=west
  private _io: TurtleIO;
  private _chain: Promise<void> = Promise.resolve();

  constructor(pos: Point, facing: number, io: TurtleIO) {
    this._pos = pos;
    this._facing = facing;
    this._io = io;
  }

  static at(pos: Point) {
    return new TurtleBuilder(pos, 0, null as any);
  }

  using(io: TurtleIO) {
    this._io = io;
    return this;
  }

  face(degrees: number) {
    this._facing = degrees % 360;
    return this;
  }

  wall(type: BlockType, length: number) {
    for (let i = 0; i < length; i++) {
      this._io.put(this._pos, type);
      this.forward(1);
    }
    return this;
  }

  door(type: BlockType) {
    this._io.put(this._pos, type);
    this.forward(1);
    return this;
  }

  window(type: BlockType = BlockType.GlassPane) {
    this._io.put(this._pos, type);
    return this;
  }

  turnRight() {
    this._facing = (this._facing + 90) % 360;
    return this;
  }

  turnLeft() {
    this._facing = (this._facing + 270) % 360;
    return this;
  }

  turnAround() {
    this._facing = (this._facing + 180) % 360;
    return this;
  }

  forward(n: number) {
    this._pos = this._move(this._pos, this._facing, n);
    return this;
  }

  backward(n: number) {
    this._pos = this._move(this._pos, (this._facing + 180) % 360, n);
    return this;
  }

  left(n: number) {
    this._pos = this._move(this._pos, (this._facing + 270) % 360, n);
    return this;
  }

  right(n: number) {
    this._pos = this._move(this._pos, (this._facing + 90) % 360, n);
    return this;
  }

  up(n: number) {
    this._pos = new Point(this._pos.x, this._pos.y + n, this._pos.z);
    return this;
  }

  down(n: number) {
    this._pos = new Point(this._pos.x, this._pos.y - n, this._pos.z);
    return this;
  }

  fill(type: BlockType, width: number, depth: number) {
    for (let dx = 0; dx < width; dx++) {
      for (let dz = 0; dz < depth; dz++) {
        const p = new Point(this._pos.x + dx, this._pos.y, this._pos.z + dz);
        this._io.put(p, type);
      }
    }
    return this;
  }

  then(fn: () => void) {
    fn();
    return this;
  }

  layer(fn: () => void) {
    this.up(1);
    fn();
    this.down(1);
    return this;
  }

  save(filename: string) {
    if (this._io.save) this._io.save(filename);
    return this;
  }

  private _move(pos: Point, facing: number, n: number) {
    let { x, y, z } = pos;
    if (facing === 0) z += n;
    else if (facing === 90) x += n;
    else if (facing === 180) z -= n;
    else if (facing === 270) x -= n;
    return new Point(x, y, z);
  }
}

// Extensibility: Command registration system
export type TurtleCommand = (tb: TurtleBuilder, ...args: any[]) => TurtleBuilder;
const commandRegistry: Record<string, TurtleCommand> = {};

export function registerTurtleCommand(name: string, fn: TurtleCommand) {
  commandRegistry[name] = fn;
  (TurtleBuilder.prototype as any)[name] = function (...args: any[]) {
    return commandRegistry[name](this, ...args);
  };
}

// Example: register a custom command in another file
// registerTurtleCommand('circle', (tb, radius, block) => { ... });
// tb.circle(5, BlockType.Glass);

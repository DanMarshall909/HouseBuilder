import { TurtleIO } from "../TurtleBuilder";
import { MinecraftBlockIO } from "./MinecraftBlockIO";
import { Point } from "../geometry/Point";
import { BlockType } from "../types/Blocks";

export class TurtleMinecraftIO implements TurtleIO {
  private _io: MinecraftBlockIO;
  constructor(io: MinecraftBlockIO) {
    this._io = io;
  }
  put(point: Point, block: BlockType) {
    this._io.put(point, block);
  }
  save(filename: string) {
    // No-op for live Minecraft IO
  }
}

import { TurtleIO } from "../TurtleBuilder";
import { TextBlockIO } from "./TextBlockBuffer";
import { Point } from "../geometry/Point";
import { BlockType } from "../types/Blocks";

export class TurtleTextIO implements TurtleIO {
  private _io: TextBlockIO;
  constructor(io: TextBlockIO) {
    this._io = io;
  }
  put(point: Point, block: BlockType) {
    this._io.put(point, { block });
  }
  save(filename: string) {
    // For demo: just print to console, or you could write to file
    console.log(this._io.asText());
  }
}

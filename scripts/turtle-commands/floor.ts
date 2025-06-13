import { TurtleBuilder } from "../TurtleBuilder";
import { BlockType } from "../types/Blocks";
import { registerTurtleCommand } from "../TurtleBuilder";

export function floor(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
  tb.fill(block, width, depth);
  return tb;
}

registerTurtleCommand("floor", floor);

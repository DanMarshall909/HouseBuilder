import { TurtleBuilder } from "../TurtleBuilder";
import { BlockType } from "../types/Blocks";
import { registerTurtleCommand } from "../TurtleBuilder";

export function roof(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
  tb.up(1).fill(block, width, depth).down(1);
  return tb;
}

registerTurtleCommand("roof", roof);

import { TurtleBuilder } from "../TurtleBuilder";
import { BlockType } from "../types/Blocks";
import { registerTurtleCommand } from "../TurtleBuilder";

export function tinyRoom(tb: TurtleBuilder) {
  tb.wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3)
    .turnRight()
    .wall(BlockType.Cobblestone, 3);
  return tb;
}

registerTurtleCommand("tinyRoom", tinyRoom);

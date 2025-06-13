import { TurtleBuilder } from "./TurtleBuilder";
import { TextBlockIO } from "./implementations/TextBlockBuffer";
import { TurtleTextIO } from "./implementations/TurtleTextIO";
import { BlockType } from "./types/Blocks";
import { Point } from "./geometry/Point";
import "./turtle-commands/floor";
import "./turtle-commands/roof";
import "./turtle-commands/tinyRoom";

export function turtleDemo() {
  const io = new TurtleTextIO(new TextBlockIO());
  const tb = TurtleBuilder.at(new Point(0, 64, 0)).using(io).face(0);
  (tb as any)
    .floor(7, 7, BlockType.OakPlanks)
    .wall(BlockType.StoneBricks, 7)
    .turnRight()
    .wall(BlockType.StoneBricks, 7)
    .turnRight()
    .wall(BlockType.StoneBricks, 7)
    .turnRight()
    .wall(BlockType.StoneBricks, 7)
    .forward(3)
    .door(BlockType.AcaciaDoor)
    .tinyRoom()
    .right(2)
    .door(BlockType.BirchDoor)
    .tinyRoom()
    .layer(() => (tb as any).roof(7, 7, BlockType.NormalStoneSlab))
    .save("my-house.mcfunction");
  return io;
}

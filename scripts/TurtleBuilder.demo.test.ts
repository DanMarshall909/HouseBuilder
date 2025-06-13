import { TurtleBuilder } from "./TurtleBuilder";
import { TextBlockIO } from "./implementations/TextBlockBuffer";
import { TurtleTextIO } from "./implementations/TurtleTextIO";
import { BlockType } from "./types/Blocks";
import { Point } from "./geometry/Point";

describe("TurtleBuilder Demo", () => {
  function tinyRoom(tb: TurtleBuilder) {
    tb.wall(BlockType.Cobblestone, 3)
      .turnRight()
      .wall(BlockType.Cobblestone, 3)
      .turnRight()
      .wall(BlockType.Cobblestone, 3)
      .turnRight()
      .wall(BlockType.Cobblestone, 3);
  }

  function floor(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
    tb.fill(block, width, depth);
  }

  function roof(tb: TurtleBuilder, width: number, depth: number, block: BlockType) {
    tb.up(1).fill(block, width, depth).down(1);
  }

  it("should build a house and output a text visualization", () => {
    const io = new TextBlockIO();
    const tb = TurtleBuilder.at(new Point(0, 64, 0))
      .using({
        put: (point, block) => io.put(point, { block }),
        save: () => {},
      })
      .face(0);

    floor(tb, 7, 7, BlockType.OakPlanks);
    tb.wall(BlockType.StoneBricks, 7)
      .turnRight()
      .wall(BlockType.StoneBricks, 7)
      .turnRight()
      .wall(BlockType.StoneBricks, 7)
      .turnRight()
      .wall(BlockType.StoneBricks, 7)
      .forward(3)
      .door(BlockType.AcaciaDoor);
    tinyRoom(tb);
    tb.right(2).door(BlockType.BirchDoor);
    tinyRoom(tb);
    tb.layer(() => roof(tb, 7, 7, BlockType.NormalStoneSlab));

    // Output the text visualization
    const text = io.asText();
    console.log("\nTurtleBuilder Text Visualization:\n" + text);

    // Canonical expected output (update this string to match the actual output format)
    const expected = `OakPlanks:0,64,0
OakPlanks:0,64,1
OakPlanks:0,64,2
OakPlanks:0,64,3
OakPlanks:0,64,4
OakPlanks:0,64,5
OakPlanks:0,64,6
OakPlanks:1,64,0
OakPlanks:1,64,1
OakPlanks:1,64,2
OakPlanks:1,64,3
OakPlanks:1,64,4
OakPlanks:1,64,5
OakPlanks:1,64,6
OakPlanks:2,64,0
OakPlanks:2,64,1
OakPlanks:2,64,2
OakPlanks:2,64,3
OakPlanks:2,64,4
OakPlanks:2,64,5
OakPlanks:2,64,6
OakPlanks:3,64,0
OakPlanks:3,64,1
OakPlanks:3,64,2
OakPlanks:3,64,3
OakPlanks:3,64,4
OakPlanks:3,64,5
OakPlanks:3,64,6
OakPlanks:4,64,0
OakPlanks:4,64,1
OakPlanks:4,64,2
OakPlanks:4,64,3
OakPlanks:4,64,4
OakPlanks:4,64,5
OakPlanks:4,64,6
OakPlanks:5,64,0
OakPlanks:5,64,1
OakPlanks:5,64,2
OakPlanks:5,64,3
OakPlanks:5,64,4
OakPlanks:5,64,5
OakPlanks:5,64,6
OakPlanks:6,64,0
OakPlanks:6,64,1
OakPlanks:6,64,2
OakPlanks:6,64,3
OakPlanks:6,64,4
OakPlanks:6,64,5
OakPlanks:6,64,6
StoneBricks:0,64,0
StoneBricks:0,64,1
StoneBricks:0,64,2
StoneBricks:0,64,3
StoneBricks:0,64,4
StoneBricks:0,64,5
StoneBricks:0,64,6
StoneBricks:0,64,7
StoneBricks:1,64,0
StoneBricks:1,64,7
StoneBricks:2,64,0
StoneBricks:2,64,7
StoneBricks:3,64,0
StoneBricks:3,64,7
StoneBricks:4,64,0
StoneBricks:4,64,7
StoneBricks:5,64,0
StoneBricks:5,64,7
StoneBricks:6,64,0
StoneBricks:6,64,7
StoneBricks:7,64,0
StoneBricks:7,64,1
StoneBricks:7,64,2
StoneBricks:7,64,3
StoneBricks:7,64,4
StoneBricks:7,64,5
StoneBricks:7,64,6
StoneBricks:7,64,7
AcaciaDoor:-3,64,0
BirchDoor:-6,64,0
Cobblestone:-4,64,0
Cobblestone:-4,64,1
Cobblestone:-4,64,2
Cobblestone:-4,64,3
Cobblestone:-5,64,0
Cobblestone:-5,64,3
Cobblestone:-6,64,-1
Cobblestone:-6,64,-2
Cobblestone:-6,64,-3
Cobblestone:-6,64,-4
Cobblestone:-6,64,0
Cobblestone:-6,64,3
Cobblestone:-7,64,-1
Cobblestone:-7,64,-4
Cobblestone:-7,64,0
Cobblestone:-7,64,1
Cobblestone:-7,64,2
Cobblestone:-7,64,3
Cobblestone:-8,64,-1
Cobblestone:-8,64,-4
Cobblestone:-9,64,-1
Cobblestone:-9,64,-2
Cobblestone:-9,64,-3
Cobblestone:-9,64,-4
NormalStoneSlab:-6,66,-1
NormalStoneSlab:-6,66,0
NormalStoneSlab:-6,66,1
NormalStoneSlab:-6,66,2
NormalStoneSlab:-6,66,3
NormalStoneSlab:-6,66,4
NormalStoneSlab:-6,66,5
NormalStoneSlab:-5,66,-1
NormalStoneSlab:-5,66,0
NormalStoneSlab:-5,66,1
NormalStoneSlab:-5,66,2
NormalStoneSlab:-5,66,3
NormalStoneSlab:-5,66,4
NormalStoneSlab:-5,66,5
NormalStoneSlab:-4,66,-1
NormalStoneSlab:-4,66,0
NormalStoneSlab:-4,66,1
NormalStoneSlab:-4,66,2
NormalStoneSlab:-4,66,3
NormalStoneSlab:-4,66,4
NormalStoneSlab:-4,66,5
NormalStoneSlab:-3,66,-1
NormalStoneSlab:-3,66,0
NormalStoneSlab:-3,66,1
NormalStoneSlab:-3,66,2
NormalStoneSlab:-3,66,3
NormalStoneSlab:-3,66,4
NormalStoneSlab:-3,66,5
NormalStoneSlab:-2,66,-1
NormalStoneSlab:-2,66,0
NormalStoneSlab:-2,66,1
NormalStoneSlab:-2,66,2
NormalStoneSlab:-2,66,3
NormalStoneSlab:-2,66,4
NormalStoneSlab:-2,66,5
NormalStoneSlab:-1,66,-1
NormalStoneSlab:-1,66,0
NormalStoneSlab:-1,66,1
NormalStoneSlab:-1,66,2
NormalStoneSlab:-1,66,3
NormalStoneSlab:-1,66,4
NormalStoneSlab:-1,66,5
NormalStoneSlab:0,66,-1
NormalStoneSlab:0,66,0
NormalStoneSlab:0,66,1
NormalStoneSlab:0,66,2
NormalStoneSlab:0,66,3
NormalStoneSlab:0,66,4
NormalStoneSlab:0,66,5`;

    // Normalize output for robust comparison
    function normalize(s: string) {
      return s.trim().split(/\r?\n/).sort().join("\n");
    }
    expect(normalize(text)).toBe(normalize(expected));
  });
});

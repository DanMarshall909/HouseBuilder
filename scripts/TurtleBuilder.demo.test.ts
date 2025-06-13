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
    expect(text).toContain("StoneBricks");
    expect(text).toContain("OakPlanks");
    expect(text).toContain("AcaciaDoor");
    expect(text).toContain("BirchDoor");
    expect(text).toContain("NormalStoneSlab");
  });
});

import { Orientation, Point } from "./geometry/Point";
import { HouseBuilder } from "./HouseBuilder";
import { BlockType } from "./types/Blocks";
import { BlockBuffer } from "./io/BlockBuffer";
import { Anchor } from "./prefabs";

describe("HouseBuilder", () => {
  const anchorPoint = new Point(1, 2, 3);
  const startingOrientation: Orientation = new Orientation(anchorPoint, 0);

  let blockBuffer: BlockBuffer;
  beforeEach(() => {
    blockBuffer = new BlockBuffer();
  });

  it("renders an empty house at a given anchorPoint point", () => {
    let houseBuilder: HouseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    houseBuilder.build();

    expect(blockBuffer.allBlocks()).toEqual([]);
    expect(houseBuilder.anchor.from).toEqual(startingOrientation);
  });

  it("draws a door at the anchorPoint point", () => {
    const houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    houseBuilder.anchor.addDoor(BlockType.AcaciaDoor);
    houseBuilder.build();
    console.log(blockBuffer);

    let actual = blockBuffer.get(anchorPoint);
    expect(actual?.block).toBe(BlockType.AcaciaDoor);
  });

  it("draws a wall next to the anchor point", () => {
    const houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    houseBuilder.anchor.addWall(BlockType.StoneBricks, 3); // Add a 3-block long wall
    houseBuilder.build();

    // Check if wall blocks are placed correctly
    expect(blockBuffer.get(new Point(2, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(4, 2, 3))?.block).toBe(BlockType.StoneBricks);
  });

  it("draws a wall continuing on from the last point rotated 90 degrees", () => {
    const houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    var orientation = houseBuilder.anchor
      .addWall(BlockType.StoneBricks, 3) // Add a 3-block long wall
      .addWall(BlockType.StoneBricks, 3).from; // Add a 3-block long wall

    expect(orientation).toBe(new Orientation(new Point(4, 2, 0), 90));
  });
});

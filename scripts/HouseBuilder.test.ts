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
    expect(houseBuilder.anchor.orientation).toEqual(startingOrientation);
  });

  it("draws a door at the anchorPoint point", () => {
    const houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    houseBuilder.anchor.addDoor(BlockType.AcaciaDoor);
    houseBuilder.build();

    const actual = blockBuffer.get(anchorPoint);
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
    houseBuilder.anchor
      .addWall(BlockType.StoneBricks, 3) // Add first wall along X axis
      .addWall(BlockType.StoneBricks, 3, 90); // Add second wall along Z axis

    // Build the house to place the blocks
    houseBuilder.build();

    // Check the final orientation after building
    const finalOrientation = houseBuilder.anchor.orientation;
    expect(finalOrientation.point).toEqual(new Point(1, 2, 3)); // Original point since anchor doesn't move
    expect(finalOrientation.rotation).toBe(0); // Original rotation since anchor doesn't rotate

    // Verify blocks are placed correctly
    // First wall (along X axis, starting from anchor point)
    expect(blockBuffer.get(new Point(2, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(4, 2, 3))?.block).toBe(BlockType.StoneBricks);

    // Second wall (along Z axis, starting from end of first wall)
    expect(blockBuffer.get(new Point(3, 2, 2))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 4))?.block).toBe(BlockType.StoneBricks);

    // Add a test to verify no unexpected blocks are placed
    expect(blockBuffer.get(new Point(1, 2, 4))).toBeUndefined();
    expect(blockBuffer.get(new Point(1, 2, 5))).toBeUndefined();
    expect(blockBuffer.get(new Point(1, 2, 6))).toBeUndefined();
  });

  it("draws a U-shaped structure with three walls", () => {
    const houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    houseBuilder.anchor
      .addWall(BlockType.StoneBricks, 3) // First wall along X axis
      .addWall(BlockType.StoneBricks, 3, 90) // Second wall along +Z axis
      .addWall(BlockType.StoneBricks, 3, 270); // Third wall along -Z axis

    // Build the house to place the blocks
    houseBuilder.build();

    // Check the final orientation after building
    const finalOrientation = houseBuilder.anchor.orientation;
    expect(finalOrientation.point).toEqual(new Point(1, 2, 3)); // Original point since anchor doesn't move
    expect(finalOrientation.rotation).toBe(0); // Original rotation since anchor doesn't rotate

    // Verify blocks are placed correctly
    // First wall (along +X axis)
    expect(blockBuffer.get(new Point(2, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(4, 2, 3))?.block).toBe(BlockType.StoneBricks);

    // Second wall (along +Z axis)
    expect(blockBuffer.get(new Point(3, 2, 2))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, 4))?.block).toBe(BlockType.StoneBricks);

    // Third wall (along -Z axis)
    expect(blockBuffer.get(new Point(3, 2, -2))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, -3))?.block).toBe(BlockType.StoneBricks);
    expect(blockBuffer.get(new Point(3, 2, -4))?.block).toBe(BlockType.StoneBricks);

    // Add a test to verify no unexpected blocks are placed
    expect(blockBuffer.get(new Point(5, 2, 3))).toBeUndefined();
    expect(blockBuffer.get(new Point(3, 2, 5))).toBeUndefined();
    expect(blockBuffer.get(new Point(3, 2, -5))).toBeUndefined();
  });
});

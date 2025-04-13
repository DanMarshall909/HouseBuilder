import { Orientation, Point, Rotation } from "./geometry/Point";
import { HouseBuilder } from "./HouseBuilder";
import { BlockType } from "./types/Blocks";
import { BlockBuffer } from "./io/BlockBuffer";

// Test constants
const TEST_CONSTANTS = {
  ANCHOR_POINT: new Point(1, 2, 3),
  WALL_LENGTH: 3,
  WALL_BLOCK_TYPE: BlockType.StoneBricks,
  DEFAULT_WINDOW_TYPE: BlockType.GlassPane,
  STAINED_WINDOW_TYPE: BlockType.WhiteStainedGlass,
  DEFAULT_WINDOW_SIZE: { width: 2, height: 2 },
};

describe("Window Construction", () => {
  let blockBuffer: BlockBuffer;
  let houseBuilder: HouseBuilder;
  let startingOrientation: Orientation;

  beforeEach(() => {
    blockBuffer = new BlockBuffer();
    startingOrientation = new Orientation(TEST_CONSTANTS.ANCHOR_POINT, 0);
    houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
  });

  it("should place a default 2x2 window at the anchor point", () => {
    houseBuilder.anchor.addWindow();
    houseBuilder.build();

    // Check if glass panes are placed in a 2x2 pattern
    const expectedPositions = [
      new Point(1, 2, 3), // Bottom left
      new Point(1, 3, 3), // Top left
      new Point(2, 2, 3), // Bottom right
      new Point(2, 3, 3), // Top right
    ];

    expectedPositions.forEach((position) => {
      const block = blockBuffer.get(position);
      expect(block).toBeDefined();
      expect(block?.block).toBe(TEST_CONSTANTS.DEFAULT_WINDOW_TYPE);
    });
  });

  it("should place a custom-sized window", () => {
    const size = { width: 3, height: 4 };
    houseBuilder.anchor.addWindow({ size });
    houseBuilder.build();

    // Check if glass panes are placed in a 3x4 pattern
    for (let x = 0; x < size.width; x++) {
      for (let y = 0; y < size.height; y++) {
        const position = new Point(
          TEST_CONSTANTS.ANCHOR_POINT.x + x,
          TEST_CONSTANTS.ANCHOR_POINT.y + y,
          TEST_CONSTANTS.ANCHOR_POINT.z
        );
        const block = blockBuffer.get(position);
        expect(block).toBeDefined();
        expect(block?.block).toBe(TEST_CONSTANTS.DEFAULT_WINDOW_TYPE);
      }
    }
  });

  it("should place a window with custom glass type", () => {
    houseBuilder.anchor.addWindow({
      blockType: TEST_CONSTANTS.STAINED_WINDOW_TYPE,
    });
    houseBuilder.build();

    const expectedPositions = [
      new Point(1, 2, 3), // Bottom left
      new Point(1, 3, 3), // Top left
      new Point(2, 2, 3), // Bottom right
      new Point(2, 3, 3), // Top right
    ];

    expectedPositions.forEach((position) => {
      const block = blockBuffer.get(position);
      expect(block).toBeDefined();
      expect(block?.block).toBe(TEST_CONSTANTS.STAINED_WINDOW_TYPE);
    });
  });

  it("should place a window rotated 90 degrees", () => {
    const rotatedOrientation = new Orientation(TEST_CONSTANTS.ANCHOR_POINT, 90 as Rotation);
    houseBuilder = new HouseBuilder(blockBuffer, rotatedOrientation);
    houseBuilder.anchor.addWindow();
    houseBuilder.build();

    // Check if glass panes are placed in a 2x2 pattern along Z axis
    const expectedPositions = [
      new Point(1, 2, 3), // Bottom near
      new Point(1, 3, 3), // Top near
      new Point(1, 2, 4), // Bottom far
      new Point(1, 3, 4), // Top far
    ];

    expectedPositions.forEach((position) => {
      const block = blockBuffer.get(position);
      expect(block).toBeDefined();
      expect(block?.block).toBe(TEST_CONSTANTS.DEFAULT_WINDOW_TYPE);
    });
  });

  it("should allow placing a window after a wall", () => {
    houseBuilder.anchor.addWall(TEST_CONSTANTS.WALL_BLOCK_TYPE, TEST_CONSTANTS.WALL_LENGTH).addWindow();
    houseBuilder.build();

    // Check if wall blocks are placed
    const wallPositions = [new Point(2, 2, 3), new Point(3, 2, 3), new Point(4, 2, 3)];

    wallPositions.forEach((position) => {
      const block = blockBuffer.get(position);
      expect(block?.block).toBe(TEST_CONSTANTS.WALL_BLOCK_TYPE);
    });

    // Check if window is placed after the wall
    const windowPositions = [
      new Point(5, 2, 3), // Bottom left
      new Point(5, 3, 3), // Top left
      new Point(6, 2, 3), // Bottom right
      new Point(6, 3, 3), // Top right
    ];

    windowPositions.forEach((position) => {
      const block = blockBuffer.get(position);
      expect(block?.block).toBe(TEST_CONSTANTS.DEFAULT_WINDOW_TYPE);
    });
  });

  it("should not allow windows to overlap with existing blocks", () => {
    // Place a wall
    houseBuilder.anchor.addWall(TEST_CONSTANTS.WALL_BLOCK_TYPE, 2);

    // Try to place a window at the same location
    expect(() => {
      houseBuilder.anchor.addWindow();
    }).toThrow("Cannot place window: space is occupied");
  });

  it("should maintain window dimensions regardless of rotation", () => {
    const rotations: Rotation[] = [0, 90, 180, 270];

    rotations.forEach((rotation) => {
      // Reset for each rotation
      blockBuffer = new BlockBuffer();
      houseBuilder = new HouseBuilder(blockBuffer, new Orientation(TEST_CONSTANTS.ANCHOR_POINT, rotation));

      houseBuilder.anchor.addWindow();
      houseBuilder.build();

      // Count the number of glass panes placed
      const glassBlocks = blockBuffer.allBlocks().filter((block) => block.block === TEST_CONSTANTS.DEFAULT_WINDOW_TYPE);

      expect(glassBlocks.length).toBe(4); // Should always be 2x2 = 4 blocks
    });
  });

  it("should validate window dimensions", () => {
    expect(() => {
      houseBuilder.anchor.addWindow({ size: { width: 0, height: 2 } });
    }).toThrow("Window width must be at least 1");

    expect(() => {
      houseBuilder.anchor.addWindow({ size: { width: 2, height: 0 } });
    }).toThrow("Window height must be at least 1");

    expect(() => {
      houseBuilder.anchor.addWindow({ size: { width: -1, height: 2 } });
    }).toThrow("Window width must be at least 1");
  });
});

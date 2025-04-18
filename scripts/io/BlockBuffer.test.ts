import { BlockBuffer } from "./BlockBuffer";
import { Orientation, Point, Rotation } from "../geometry/Point";
import { BlockType } from "../types/Blocks";
import { TextBlockIO } from "../implementations/TextBlockBuffer";

describe("BlockBuffer", () => {
  let blockBuffer: BlockBuffer;

  beforeEach(() => {
    blockBuffer = new BlockBuffer();
  });

  it("stores and retrieves a block", () => {
    const point = new Point(1, 2, 3);

    blockBuffer.put(point, BlockType.Stone);
    const retrievedBlock = blockBuffer.get(point);

    expect(retrievedBlock?.block).toEqual(BlockType.Stone);
  });

  it("returns undefined for non-existent block", () => {
    const point = new Point(4, 5, 6);
    const retrievedBlock = blockBuffer.get(point);

    expect(retrievedBlock).toBeUndefined();
  });

  it("outputs correct text representation", () => {
    blockBuffer.putXYZ(1, 2, 3, BlockType.Stone);
    blockBuffer.putXYZ(2, 2, 3, BlockType.BrickBlock);
    const textBlockIO = new TextBlockIO();
    blockBuffer.render(textBlockIO);
    let actual = textBlockIO.asText();
    expect(actual).toBe(
      `Stone:1,2,3
BrickBlock:2,2,3`
    );
  });

  describe("BlockBuffer rotations", () => {
    const testCases = [
      { rotation: 0 as Rotation, expectedPoint: new Point(2, 3, 4), blockType: BlockType.Stone },
      { rotation: 90 as Rotation, expectedPoint: new Point(2, 3, 4), blockType: BlockType.BrickBlock },
      { rotation: 180 as Rotation, expectedPoint: new Point(0, 3, 2), blockType: BlockType.SpruceWood },
      { rotation: 270 as Rotation, expectedPoint: new Point(2, 3, 2), blockType: BlockType.Glass },
    ];

    testCases.forEach(({ rotation, expectedPoint, blockType }) => {
      it(`places a block with ${rotation}-degree rotation`, () => {
        const position = new Point(1, 2, 3);
        const orientation: Orientation = { rotation, point: new Point(1, 1, 1) };

        blockBuffer.putOffset(position, orientation, blockType);
        const retrievedBlock = blockBuffer.get(expectedPoint);

        expect(retrievedBlock?.block).toEqual(blockType);
      });
    });
  });
});

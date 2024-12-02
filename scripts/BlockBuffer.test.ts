import {BlockBuffer} from "./BlockBuffer";
import {Point} from "./geometry/Point";
import {BlockType} from "./types/Blocks";

describe("BlockBuffer", () => {
    let blockBuffer: BlockBuffer;

    beforeEach(() => {
        blockBuffer = new BlockBuffer();
    });

    it("stores and retrieves a block", () => {
        const point = new Point(1, 2, 3);

        blockBuffer.put(point, {block: BlockType.Stone});
        const retrievedBlock = blockBuffer.get(point);

        expect(retrievedBlock).toEqual({block: BlockType.Stone});
    });

    it("returns undefined for non-existent block", () => {
        const point = new Point(4, 5, 6);
        const retrievedBlock = blockBuffer.get(point);

        expect(retrievedBlock).toBeUndefined();
    });

    it("outputs correct text representation", () => {
        blockBuffer.put(new Point(1, 2, 3), {block: BlockType.Stone});
        blockBuffer.put(new Point(2, 2, 3), {block: BlockType.BrickBlock});
        let actual = blockBuffer.asText();
        expect(actual).toBe("1,2,3: Stone\n2,2,3: BrickBlock");
    });
});

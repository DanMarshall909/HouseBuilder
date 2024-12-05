import {BlockBuffer} from "./BlockBuffer";
import {Point} from "../geometry/Point";
import {BlockType} from "../types/Blocks";
import {TextBlockIO} from "../implementations/TextBlockBuffer";

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
BrickBlock:2,2,3`);
    });
});

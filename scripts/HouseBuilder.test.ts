import {BlockBuffer} from "./BlockBuffer";
import {Point} from "./geometry/Point";
import {BlockType} from "./types/Blocks";
import {HouseBuilder} from "./HouseBuilder";


describe("HouseBuilder", () => {
    let houseBuilder: HouseBuilder;

    let blockBuffer: BlockBuffer;
    beforeEach(() => {
        blockBuffer = new BlockBuffer();
        houseBuilder = new HouseBuilder(blockBuffer);
    });

    it("renders an empty house at a given anchor point", () => {
        let anchor = new Point(1, 2, 3);
        houseBuilder.render(anchor)

        expect(blockBuffer.allBlocks()).toEqual([]);
    });

    describe("TestIO", () => {
        let testIO: BlockBuffer;

        beforeEach(() => {
            testIO = new BlockBuffer();
        });

        it("stores and retrieves a block", () => {
            const point = new Point(1, 2, 3);

            testIO.put(point, {block: BlockType.Stone});
            const retrievedBlock = testIO.get(point);

            expect(retrievedBlock).toEqual({block: BlockType.Stone});
        });

        it("returns undefined for non-existent block", () => {
            const point = new Point(4, 5, 6);
            const retrievedBlock = testIO.get(point);

            expect(retrievedBlock).toBeUndefined();
        });

        it("outputs correct text representation", () => {
            const point = new Point(1, 2, 3);

            testIO.put(point, {block: BlockType.Stone});
            expect(testIO.asText()).toBe("1,2,3: Stone");
        });
    })
});

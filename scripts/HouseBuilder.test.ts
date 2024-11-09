import {BlockBuffer} from "./BlockBuffer";
import {Point, IPoint} from "./geometry/Point";
import {HouseBuilder} from "./HouseBuilder";


describe("HouseBuilder", () => {
    let houseBuilder: HouseBuilder;

    const anchor = new Point(1, 2, 3);
    let blockBuffer: BlockBuffer;
    beforeEach(() => {
        blockBuffer = new BlockBuffer();
        houseBuilder = new HouseBuilder(blockBuffer, anchor);
    });

    it("renders an empty house at a given anchor point", () => {
        houseBuilder.render(anchor)

        expect(blockBuffer.allBlocks()).toEqual([]);
        expect(houseBuilder.anchor.position as IPoint).toEqual(anchor as IPoint);
    });
});

import {BlockBuffer} from "./BlockBuffer";
import {IPoint, Orientation, Point} from "./geometry/Point";
import {HouseBuilder} from "./HouseBuilder";
import {BlockType} from "./types/Blocks";


describe("HouseBuilder", () => {
    const anchorPoint = new Point(1, 2, 3);
    const startingOrientation: Orientation = new Orientation(Point.Zero, 0);

    let blockBuffer: BlockBuffer;
    beforeEach(() => {
        blockBuffer = new BlockBuffer();
        let houseBuilder: HouseBuilder;
        houseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
    });

    it("renders an empty house at a given anchorPoint point", () => {

        let houseBuilder: HouseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
        houseBuilder.buildAt(anchorPoint)

        expect(blockBuffer.allBlocks()).toEqual([]);
        expect(houseBuilder.Anchor.orientation).toEqual(Orientation.Same);
    });

    it("draws a door at the anchorPoint point", () => {
        const houseBuilder: HouseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
        houseBuilder.Anchor.addDoor(BlockType.AcaciaDoor);
        houseBuilder.Anchor.render();

        let actual = blockBuffer.get(anchorPoint);
        expect(actual).toBe(BlockType.AcaciaDoor);
    });
});

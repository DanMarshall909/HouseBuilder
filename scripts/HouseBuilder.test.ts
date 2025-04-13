import {Vector, Point} from "./geometry/Point";
import {HouseBuilder} from "./HouseBuilder";
import {BlockType} from "./types/Blocks";
import {BlockBuffer} from "./io/BlockBuffer";


describe("HouseBuilder", () => {
    const anchorPoint = new Point(1, 2, 3);
    const startingOrientation: Vector = new Vector(anchorPoint, 0);

    let blockBuffer: BlockBuffer;
    beforeEach(() => {
        blockBuffer = new BlockBuffer();
    });

    it("renders an empty house at a given anchorPoint point", () => {
        let houseBuilder: HouseBuilder = new HouseBuilder(blockBuffer, startingOrientation);
        houseBuilder.build()

        expect(blockBuffer.allBlocks()).toEqual([]);
        expect(houseBuilder.anchor.orientation).toEqual(startingOrientation);
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
}); 
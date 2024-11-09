import {TestIO} from "./TestIO";
import {Point} from "./geometry/Point";
import {BlockType} from "./types/Blocks";


describe("TestIO", () => {
	let testIO: TestIO;
	
	beforeEach(() => {
		testIO = new TestIO();
	});
	
  it("should store and retrieve a block", () => {
    const point = new Point(1, 2, 3);

    testIO.put(point, { block: BlockType.Stone });
    const retrievedBlock = testIO.get(point);

    expect(retrievedBlock).toEqual({ block: BlockType.Stone });
  });

  it("should return undefined for non-existent block", () => {
    const point = new Point(4, 5, 6);
    const retrievedBlock = testIO.get(point);

    expect(retrievedBlock).toBeUndefined();
  });

  it("should output correct text representation", () => {
    const point = new Point(1, 2, 3); 

    testIO.put(point, { block: BlockType.Stone });
    expect(testIO.asText()).toBe("1,2,3: Stone");
  });
});

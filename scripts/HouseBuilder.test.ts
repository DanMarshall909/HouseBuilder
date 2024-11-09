import { HouseBuilder } from "./HouseBuilder";
import Point from "./libraries/Types/Position";
import { TestIO } from "./TestIO";

test("HouseBuilder builds a house", () => {
  const testIo = new TestIO();
  const houseBuilder = new HouseBuilder(testIo);

  houseBuilder.render({ x: 0, y: 0, z: 0 } as Point);
  expect(testIo.asText()).toBe("");
});

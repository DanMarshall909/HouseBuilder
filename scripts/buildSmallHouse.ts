import { BlockBuffer } from "./io/BlockBuffer";
import { Point, Orientation } from "./geometry/Point";
import { HouseBuilder } from "./HouseBuilder";
import { BlockType } from "./types/Blocks";
import { McFunctionIO } from "./implementations/McFunctionIO";

export function buildSmallHouse(buffer: BlockBuffer, origin: Point) {
  const WALL = BlockType.StoneBricks;

  // Build outer square
  const outer = new HouseBuilder(buffer, new Orientation(origin, 0));
  outer.anchor
    .addWall(WALL, 7)
    .addWall(WALL, 7, 90)
    .addWall(WALL, 7, 90)
    .addWall(WALL, 7, 90);
  outer.build();

  // Interior cross along X axis
  const crossX = new HouseBuilder(
    buffer,
    new Orientation(new Point(origin.x + 1, origin.y, origin.z + 3), 0)
  );
  crossX.anchor.addWall(WALL, 6);
  crossX.build();

  // Interior cross along Z axis
  const crossZ = new HouseBuilder(
    buffer,
    new Orientation(new Point(origin.x + 3, origin.y, origin.z + 1), 90)
  );
  crossZ.anchor.addWall(WALL, 6);
  crossZ.build();

  // Door
  const doorBuilder = new HouseBuilder(
    buffer,
    new Orientation(new Point(origin.x + 3, origin.y, origin.z), 0)
  );
  doorBuilder.anchor.addDoor(BlockType.AcaciaDoor);
  doorBuilder.build();

  // Window
  const windowBuilder = new HouseBuilder(
    buffer,
    new Orientation(new Point(origin.x + 3, origin.y + 1, origin.z + 7), 180)
  );
  windowBuilder.anchor.addWindow();
  windowBuilder.build();
}

if (require.main === module) {
  const buffer = new BlockBuffer();
  buildSmallHouse(buffer, new Point(0, 0, 0));
  const io = new McFunctionIO();
  buffer.render(io);
  io.save("house.mcfunction");
  console.log("Exported house.mcfunction");
}

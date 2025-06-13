# House Builder

Builds a house from TypeScript definitions or with a fluent Turtle-style builder API.

## Usage

### Minecraft World (Bedrock)
Run the `build` command to build the project for Minecraft Bedrock Edition.
```bash
npm run build
```

### TurtleBuilder Web/Script API
You can use the new fluent TurtleBuilder API to build houses, rooms, and more using code that feels like walking and placing blocks:

```ts
import { TurtleBuilder } from "./scripts/TurtleBuilder";
import { TextBlockIO } from "./scripts/implementations/TextBlockBuffer";
import { BlockType } from "./scripts/types/Blocks";
import { Point } from "./scripts/geometry/Point";

const io = new TextBlockIO();
const tb = TurtleBuilder.at(new Point(0, 64, 0))
  .using({
    put: (point, block) => io.put(point, { block }),
    save: () => {},
  })
  .face(0);

// Example: build a square room
function tinyRoom(tb: TurtleBuilder) {
  tb.wall(BlockType.Cobblestone, 3)
    .turnRight().wall(BlockType.Cobblestone, 3)
    .turnRight().wall(BlockType.Cobblestone, 3)
    .turnRight().wall(BlockType.Cobblestone, 3);
}

tb.wall(BlockType.StoneBricks, 7)
  .turnRight().wall(BlockType.StoneBricks, 7)
  .turnRight().wall(BlockType.StoneBricks, 7)
  .turnRight().wall(BlockType.StoneBricks, 7)
  .forward(3)
  .door(BlockType.AcaciaDoor);
tinyRoom(tb);

console.log(io.asText()); // See a text visualization of your build
```

### Web Editor & Visualization (Recommended)
A web-based editor and real-time renderer is recommended for the best experience. You can:
- Write TurtleBuilder scripts in a code editor
- See a live 2D/3D preview of your build
- Export `.mcfunction` files for Minecraft

(See project roadmap for web UI details.)

## Testing
Run the `test` command to run the tests.
```bash
npm run test:watch
```

## Linting
Run the `lint` command to run the linter.
```bash
npm run lint
```



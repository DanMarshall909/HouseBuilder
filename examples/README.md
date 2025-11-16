# JSON House Configuration Examples

This directory contains example JSON configurations for building Minecraft houses using the HouseBuilder system.

## Overview

The JSON configuration system allows you to define complete houses with all the typical building components:
- **Floors** - Solid floor surfaces
- **Walls** - Vertical wall structures on all four sides
- **Windows** - Glass windows with configurable size and position
- **Doors** - Entry/exit points
- **Stairs** - Connect multiple levels
- **Ceilings** - Cover the top of rooms
- **Roofs** - Various roof styles (flat, gabled, hipped, pyramidal)
- **Multiple Levels** - Stack rooms vertically to create multi-story buildings

## JSON Schema

### House Configuration

```json
{
  "name": "House Name",
  "description": "Optional description",
  "rooms": [
    // Array of room configurations
  ]
}
```

### Room Configuration

```json
{
  "position": { "x": 0, "y": 64, "z": 0 },
  "rotation": 0,  // 0, 90, 180, or 270
  "width": 10,
  "depth": 8,
  "height": 4,
  "floor": {
    "material": "OakPlanks",
    "yOffset": 0  // Optional vertical offset
  },
  "ceiling": {
    "material": "OakPlanks"
  },
  "walls": [
    {
      "side": "front",  // front, back, left, right
      "material": "StoneBricks",
      "startHeight": 1,  // Optional
      "wallHeight": 4    // Optional, defaults to room height
    }
  ],
  "windows": [
    {
      "side": "front",
      "offsetAlong": 2,
      "offsetHeight": 2,
      "width": 2,   // Optional
      "height": 2,  // Optional
      "material": "GlassPane"  // Optional
    }
  ],
  "doors": [
    {
      "side": "front",
      "offsetAlong": 5,
      "material": "OakDoor"
    }
  ],
  "stairs": [
    {
      "corner": "frontLeft",  // frontLeft, frontRight, backLeft, backRight
      "material": "OakStairs",
      "steps": 5,
      "width": 2  // Optional
    }
  ],
  "roof": {
    "material": "BrickBlock",
    "style": "gabled"  // flat, gabled, hipped, pyramidal
  }
}
```

## Available Block Materials

The system supports all Minecraft block types. Common materials include:

### Wood Types
- `OakPlanks`, `SprucePlanks`, `BirchPlanks`, `JunglePlanks`, `AcaciaPlanks`, `DarkOakPlanks`
- `OakLog`, `SpruceLog`, `BirchLog`, etc.

### Stone Types
- `Stone`, `StoneBricks`, `CobbleStone`, `MossyStoneBricks`
- `Granite`, `Diorite`, `Andesite`
- `PolishedGranite`, `PolishedDiorite`, `PolishedAndesite`

### Decorative Blocks
- `QuartzBlock`, `BrickBlock`, `NetherBrick`, `RedNetherBrick`
- `Sandstone`, `RedSandstone`
- `PrismarineBricks`, `DarkPrismarine`

### Door Types
- `OakDoor`, `SpruceDoor`, `BirchDoor`, `JungleDoor`, `AcaciaDoor`, `DarkOakDoor`
- `IronDoor`

### Stairs Types
- `OakStairs`, `StoneStairs`, `BrickStairs`, `QuartzStairs`, etc.

### Glass Types
- `Glass`, `GlassPane`
- `StainedGlass` (various colors)

## Examples

### 1. Simple Cottage (`simple-house.json`)
A small single-room cottage with:
- Stone brick walls
- Oak plank floors and ceiling
- Windows on three sides
- A gabled brick roof
- One entrance door

### 2. Two-Story House (`two-story-house.json`)
A modern two-story house featuring:
- Two complete levels
- Interior stairs connecting floors
- Multiple windows per level
- A hipped roof on the second floor

### 3. Grand Mansion (`mansion.json`)
A luxurious three-story mansion with:
- Quartz block exterior
- Multiple large windows per floor
- Grand staircases
- A pyramidal roof
- Polished andesite and dark oak interiors

## Usage in Code

```typescript
import { JsonHouseBuilder } from "./scripts/config/JsonHouseBuilder";
import * as fs from "fs";

// Load from JSON file
const jsonContent = fs.readFileSync("examples/simple-house.json", "utf-8");
const blockBuffer = JsonHouseBuilder.fromJson(jsonContent);

// Or build from configuration object
const config = {
  name: "My House",
  rooms: [
    {
      position: { x: 0, y: 64, z: 0 },
      rotation: 0,
      width: 8,
      depth: 6,
      height: 4,
      floor: { material: "OakPlanks" },
      walls: [
        { side: "front", material: "StoneBricks" },
        { side: "back", material: "StoneBricks" },
        { side: "left", material: "StoneBricks" },
        { side: "right", material: "StoneBricks" }
      ]
    }
  ]
};

const blockBuffer = JsonHouseBuilder.fromConfig(config);

// Render to Minecraft world
blockBuffer.render(minecraftBlockIO);
```

## Tips for Creating Configurations

1. **Start Simple**: Begin with a single room and gradually add features
2. **Plan Coordinates**: Sketch out your house layout to plan room positions
3. **Match Heights**: When stacking rooms, ensure the Y position accounts for floor height + room height
4. **Window Placement**: Ensure windows don't exceed wall lengths
5. **Door Access**: Plan door positions to allow proper entry/exit
6. **Stairs Position**: Place stairs in corners that don't block important areas
7. **Roof Styles**:
   - Use `gabled` for traditional barn-style roofs
   - Use `hipped` for roofs that slope on all sides
   - Use `pyramidal` for perfect pyramid shapes
   - Use `flat` for modern designs

## Coordinate System

- **X**: East (+) / West (-)
- **Y**: Up (+) / Down (-)
- **Z**: South (+) / North (-)
- **Rotation**:
  - 0° = Facing East (positive X)
  - 90° = Facing South (positive Z)
  - 180° = Facing West (negative X)
  - 270° = Facing North (negative Z)

## Room Sides

When rotation is 0°:
- **front**: Faces East (+X direction)
- **back**: Faces West (-X direction)
- **left**: Faces North (-Z direction)
- **right**: Faces South (+Z direction)

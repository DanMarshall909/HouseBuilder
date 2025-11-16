# AI House Builder

Build amazing Minecraft houses using natural language with the power of AI and LangChain!

## Features

- 🏠 **Natural Language House Generation**: Describe your house in plain English
- 🤖 **LangChain Integration**: Uses LangChain to abstract LLM interactions
- 🚪 **Room Connections**: Automatically connects rooms with doors
- 🪑 **Object Placement**: Places furniture and decorations in rooms
- 🎨 **Smart Design**: AI understands architectural concepts and room purposes
- 📐 **3D Visualization**: Preview houses before building with multiple visualization modes (see [VISUALIZATION.md](VISUALIZATION.md))
- 📊 **ASCII Art Previews**: Console-friendly house summaries

## Setup

### 1. Install Dependencies

The required dependencies are already installed:
- `langchain` - LangChain core library
- `@langchain/openai` - OpenAI integration
- `@langchain/core` - LangChain core types
- `zod` - Schema validation

### 2. Configure OpenAI API Key

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Or pass it directly when creating the AIHouseBuilder:

```typescript
const builder = new AIHouseBuilder("your-api-key-here");
```

## Usage

### In-Game Command

Use the chat command in Minecraft to open the AI House Builder UI:

```
!aihouse
```

or

```
!buildhouse
```

### Programmatic Usage

```typescript
import { AIHouseBuilder } from "./ai/AIHouseBuilder";

const builder = new AIHouseBuilder();

// Generate a house from a prompt
const prompt = "A medieval castle with a throne room, armory, and tower";
const blockBuffer = await builder.buildFromPrompt(prompt);

// Or get the configuration first
const houseConfig = await builder.generateHouseConfig(prompt);
console.log(JSON.stringify(houseConfig, null, 2));
```

### Example Prompts

Here are some example prompts to try:

1. **Cozy Cottage**: "A cozy cottage with a bedroom, kitchen, and living room with a fireplace"
2. **Modern House**: "A modern house with 3 bedrooms, a large kitchen, living room, and bathroom"
3. **Medieval Castle**: "A medieval castle with a throne room, armory, guard towers, and dungeon"
4. **Wizard Tower**: "A tall wizard tower with a library, potion brewing room, and observatory"
5. **Beach House**: "A beach house with large windows, open floor plan, and ocean view"
6. **Treehouse**: "A treehouse with multiple levels, rope bridges, and a lookout platform"

## Architecture

### Components

1. **AIHouseBuilder** (`scripts/ai/AIHouseBuilder.ts`)
   - Main AI house generation service
   - Uses LangChain to communicate with OpenAI
   - Parses prompts and generates HouseConfig objects
   - Validates generated configurations

2. **AIHouseBuilderUI** (`scripts/ui/AIHouseBuilderUI.ts`)
   - In-game UI for prompt input
   - Minecraft server-ui integration
   - Player interaction handling

3. **Extended HouseConfig** (`scripts/config/HouseConfig.ts`)
   - Added `ObjectConfig` for object placement
   - Added `RoomConnection` for room connections
   - Extended `RoomConfig` with objects array and name field

4. **JsonHouseBuilder** (`scripts/config/JsonHouseBuilder.ts`)
   - Updated to support object placement
   - Handles placing furniture and decorations

### How It Works

1. User provides a natural language prompt describing their house
2. LangChain sends the prompt to OpenAI's GPT model
3. The AI generates a structured JSON configuration following the HouseConfig schema
4. The system validates the configuration
5. JsonHouseBuilder constructs the house from the configuration
6. Objects (furniture, decorations) are placed in rooms
7. Doors connect rooms automatically

## Configuration Format

The AI generates configurations in this format:

```json
{
  "name": "House Name",
  "description": "Brief description",
  "rooms": [
    {
      "name": "Room Name",
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": 0,
      "width": 10,
      "depth": 10,
      "height": 5,
      "floor": { "material": "OakPlanks" },
      "walls": [...],
      "windows": [...],
      "doors": [...],
      "objects": [
        {
          "type": "Chest",
          "position": { "x": 2, "y": 1, "z": 2 },
          "description": "storage chest"
        }
      ]
    }
  ],
  "connections": [
    {
      "fromRoomIndex": 0,
      "toRoomIndex": 1,
      "doorMaterial": "OakDoor"
    }
  ]
}
```

## Available Block Types

Common block types for building:

**Structural**:
- `OakPlanks`, `SprucePlanks`, `BirchPlanks`
- `StoneBricks`, `Cobblestone`, `Stone`
- `Glass`, `StainedGlass`

**Doors**:
- `OakDoor`, `BirchDoor`, `SpruceDoor`
- `IronDoor`, `CopperDoor`

**Furniture & Objects**:
- `Bed`, `Chest`, `CraftingTable`
- `Furnace`, `Bookshelf`, `EnchantingTable`
- `Torch`, `Lantern`, `Campfire`

See `scripts/types/Blocks.ts` for the complete list.

## Room Connections

The AI automatically infers room connections based on:
- Room adjacency (sharing a wall)
- Door placements
- Logical flow between rooms

Connections can also be explicitly defined in the configuration.

## Object Placement

Objects are placed within rooms with proper positioning:
- Beds in bedrooms
- Furnaces and crafting tables in kitchens
- Bookshelves in libraries
- Chests for storage
- Torches and lanterns for lighting

## Validation

The system validates generated configurations to ensure:
- All rooms have valid dimensions (minimum 3x3x3)
- Rotations are valid (0, 90, 180, 270)
- Block types exist in Minecraft
- Positions are reasonable

## Troubleshooting

### "Error opening AI House Builder"
- Ensure your OpenAI API key is set correctly
- Check console logs for detailed error messages

### "Error generating house"
- Try simplifying your prompt
- Check your internet connection
- Verify API key has sufficient credits

### House not building correctly
- The AI sometimes generates invalid configurations
- Try being more specific in your prompt
- Manually edit the generated JSON if needed

## Examples

See `examples/ai-house-example.json` for a complete example configuration.

## Future Enhancements

Potential improvements:
- Support for multiple AI providers (Anthropic, Gemini, etc.)
- Custom block palettes
- Terrain adaptation
- Interior decoration themes
- Multi-story buildings with stairs
- Redstone contraptions
- Garden and landscaping

## Contributing

Feel free to extend the AI house builder with:
- New object types
- Architectural styles
- Room templates
- Validation rules
- UI improvements

## License

Same as the main HouseBuilder project.

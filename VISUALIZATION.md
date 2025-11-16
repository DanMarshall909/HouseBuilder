# 3D House Visualization

The HouseBuilder now includes powerful 3D visualization capabilities to preview houses before building them!

## Features

- 🎨 **Multiple Visualization Modes**: Wireframe, Holographic, Colored Bounds, and Solid
- 📐 **Bounding Box Calculations**: Automatically calculates house dimensions
- 📊 **ASCII Art Preview**: Console-friendly house summaries
- 🔗 **Connection Highlighting**: Visualize room connections
- 🚪 **Door & Window Markers**: See where doors and windows will be placed

## Visualization Modes

### 1. Wireframe Mode
- Clean glass outlines of room boundaries
- Shows edges and corners clearly
- Lightweight and easy to see through
- Perfect for understanding structure

```typescript
const visualizer = new HouseVisualizer();
const preview = visualizer.visualize(houseConfig, {
  mode: VisualizationMode.Wireframe,
  highlightConnections: true
});
```

### 2. Holographic Mode
- Semi-transparent colored glass
- Each room has a different color
- Beautiful and futuristic
- Great for presentations

```typescript
const preview = visualizer.visualize(houseConfig, {
  mode: VisualizationMode.Holographic,
  showRoomLabels: true
});
```

### 3. Colored Bounds Mode
- Colored wool markers at room corners
- Minimal and non-intrusive
- Shows room boundaries without filling space
- Best for large houses

```typescript
const preview = visualizer.visualize(houseConfig, {
  mode: VisualizationMode.ColoredBounds
});
```

### 4. Solid Mode
- Full solid block preview
- Uses actual materials
- Most realistic preview
- Can be heavy for large houses

```typescript
const preview = visualizer.visualize(houseConfig, {
  mode: VisualizationMode.Solid
});
```

## Usage with AI House Builder

The AI House Builder automatically integrates visualization:

```typescript
import { AIHouseBuilder } from "./ai/AIHouseBuilder";
import { VisualizationMode } from "./visualization/HouseVisualizer";

const builder = new AIHouseBuilder();

// Build with automatic preview
const result = await builder.buildWithPreview(
  "A medieval castle with throne room",
  VisualizationMode.Holographic
);

// Access different outputs
console.log(result.ascii);     // ASCII art preview
result.preview;                 // BlockBuffer for visualization
result.house;                   // BlockBuffer for actual house
result.config;                  // House configuration
```

## In-Game UI

When using the AI House Builder UI, you get visualization options:

1. Open the AI House Builder menu
2. Enter your house description
3. Toggle "Show 3D preview before building"
4. Select your preferred preview style from dropdown
5. Generate and preview!

The preview will be rendered offset +20 blocks on the X axis so you can see it clearly before confirming the build.

## ASCII Visualization

For console output, you can generate beautiful ASCII art previews:

```typescript
const visualizer = new HouseVisualizer();
const ascii = visualizer.generateASCIIVisualization(houseConfig);
console.log(ascii);
```

Output example:
```
╔═══════════════════════════════════════╗
║  House: Cozy Cottage                  ║
╠═══════════════════════════════════════╣
║  1. Living Room                       ║
║     Size: 8x8x5                       ║
║     Position: (0, 0, 0)               ║
║     Doors: 1                          ║
║     Windows: 2                        ║
║     Objects: 3                        ║
╟───────────────────────────────────────╢
║  2. Bedroom                           ║
║     Size: 6x8x5                       ║
║     Position: (8, 0, 0)               ║
║     Doors: 1                          ║
║     Windows: 1                        ║
║     Objects: 3                        ║
╠═══════════════════════════════════════╣
║  Room Connections: 1                  ║
║  1. Room 1 ↔ Room 2                   ║
╚═══════════════════════════════════════╝
```

## Bounding Box Information

Get precise dimensions of your house:

```typescript
const bbox = visualizer.calculateBoundingBox(houseConfig);

console.log(`Min: (${bbox.min.x}, ${bbox.min.y}, ${bbox.min.z})`);
console.log(`Max: (${bbox.max.x}, ${bbox.max.y}, ${bbox.max.z})`);
console.log(`Size: ${bbox.dimensions.width} x ${bbox.dimensions.height} x ${bbox.dimensions.depth}`);
```

## Visualization Elements

### Room Wireframes
- Glass blocks outline room edges
- Corners are clearly marked
- Vertical and horizontal edges shown

### Door Markers
- Iron blocks mark door positions
- 2 blocks tall (matching door height)
- Positioned exactly where doors will be

### Window Markers
- Light blue stained glass
- Positioned at window locations
- Shows window placement

### Connection Lines
- Gold blocks connect room centers
- Shows how rooms are linked
- Only visible when `highlightConnections: true`

### Room Colors (Holographic Mode)
- **Room 1**: Blue
- **Room 2**: Green
- **Room 3**: Red
- **Room 4**: Yellow
- **Room 5**: Purple
- **Room 6**: Cyan
- (Cycles for more rooms)

## Programmatic Example

Complete example of visualizing a house:

```typescript
import { HouseVisualizer, VisualizationMode } from "./visualization/HouseVisualizer";
import { HouseConfig } from "./config/HouseConfig";

// Your house configuration
const houseConfig: HouseConfig = {
  name: "Test House",
  rooms: [
    {
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      width: 10,
      depth: 10,
      height: 5,
      doors: [{ side: "front", offsetAlong: 5, material: "OakDoor" }],
      windows: [{ side: "left", offsetAlong: 3, offsetHeight: 2 }]
    }
  ]
};

const visualizer = new HouseVisualizer();

// Generate wireframe
const wireframe = visualizer.visualize(houseConfig, {
  mode: VisualizationMode.Wireframe,
  showRoomLabels: true,
  highlightConnections: true
});

// Generate ASCII preview
const ascii = visualizer.generateASCIIVisualization(houseConfig);
console.log(ascii);

// Get dimensions
const bbox = visualizer.calculateBoundingBox(houseConfig);
console.log(`House size: ${bbox.dimensions.width}x${bbox.dimensions.height}x${bbox.dimensions.depth}`);
```

## Advanced Features

### Custom Visualization Options

```typescript
interface VisualizerOptions {
  mode: VisualizationMode;
  showRoomLabels?: boolean;      // Future: Add text labels
  showDimensions?: boolean;       // Future: Show measurements
  highlightConnections?: boolean; // Draw connection lines
  basePosition?: Position;        // Custom base position
}
```

### Integration with JSON Builder

The visualizer works seamlessly with JSON house configurations:

```typescript
import { JsonHouseBuilder } from "./config/JsonHouseBuilder";
import { HouseVisualizer, VisualizationMode } from "./visualization/HouseVisualizer";

// Load config from JSON
const config = JSON.parse(jsonString);

// Visualize before building
const visualizer = new HouseVisualizer();
const preview = visualizer.visualize(config, {
  mode: VisualizationMode.Holographic
});

// Build actual house
const builder = new JsonHouseBuilder();
const house = builder.build(config);
```

## Tips & Best Practices

1. **Use Wireframe for Structure**: Best for understanding room layout
2. **Use Holographic for Aesthetics**: Great for showcasing designs
3. **Use Colored Bounds for Large Houses**: Minimal visual clutter
4. **Check ASCII First**: Quick console preview before rendering
5. **Offset Previews**: Place previews offset from build location
6. **Clear Previews**: Remove preview blocks before building actual house

## Performance Considerations

- **Wireframe**: Fastest, minimal blocks
- **Holographic**: Moderate, fills walls with glass
- **Colored Bounds**: Fast, corner markers only
- **Solid**: Slowest, fills entire structure

For very large houses (>10 rooms), consider using Wireframe or Colored Bounds modes.

## Future Enhancements

Planned features:
- Floating text labels for rooms
- Dimension annotations
- Animated previews
- Multiple preview angles
- Export to 3D formats (OBJ, STL)
- VR visualization support

## Troubleshooting

### Preview not showing
- Check that visualization mode is set
- Ensure BlockBuffer is properly deployed
- Verify position is in loaded chunks

### Preview blocks remain after building
- Manually clear preview blocks
- Use air blocks to fill preview area
- Future: Auto-clear feature

### Colors not displaying correctly
- Ensure colored glass blocks are available
- Check Minecraft version compatibility
- Try Wireframe mode as fallback

## Examples

See `examples/ai-house-example.json` for a complete house configuration that can be visualized.

## API Reference

### HouseVisualizer Class

```typescript
class HouseVisualizer {
  visualize(config: HouseConfig, options: VisualizerOptions): BlockBuffer
  generateASCIIVisualization(config: HouseConfig): string
  calculateBoundingBox(config: HouseConfig): BoundingBox
}
```

### VisualizationMode Enum

```typescript
enum VisualizationMode {
  Wireframe = "wireframe",
  Holographic = "holographic",
  Solid = "solid",
  ColoredBounds = "colored_bounds"
}
```

## Contributing

To add new visualization modes:

1. Add mode to `VisualizationMode` enum
2. Implement render method in `HouseVisualizer`
3. Add UI option in `AIHouseBuilderUI`
4. Update documentation

## License

Same as the main HouseBuilder project.

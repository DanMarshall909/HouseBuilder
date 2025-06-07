# Best Practices & Design Principles

## Architectural Principles

### Dependency Inversion ✅
- **Pattern**: All major components depend on interfaces, not concrete implementations
- **Example**: HouseBuilder depends on `BlockBuffer` (abstract) not `MinecraftBlockIO` (concrete)
- **Benefit**: Enables testing with mock implementations like `TextBlockBuffer`

### Single Responsibility ✅
- **BlockBuffer**: Only handles block placement and positioning
- **HouseBuilder**: Only orchestrates the building process
- **Prefabs**: Each prefab only knows how to build itself
- **Factory**: Only responsible for creating prefab instances

### Interface Segregation ✅
- **IPrefab**: Minimal interface with only essential `build()` method
- **IBlockIO**: Focused interface for block operations
- **PrefabFactory**: Single responsibility for prefab creation

## Code Quality Standards

### Type Safety Best Practices
```typescript
// ✅ GOOD: Strong typing with enums
function placeBlock(type: BlockType, position: Point): void

// ❌ AVOID: Weak typing with strings
function placeBlock(type: string, x: number, y: number, z: number): void
```

### Error Handling Patterns
```typescript
// ✅ GOOD: Interface contracts prevent many errors
interface IPrefab {
  build(orientation: Orientation, putFunc: PutFunc): void;
}

// ✅ GOOD: Validation at boundaries
constructor(blockBuffer: BlockBuffer, orientation: Orientation) {
  if (!blockBuffer) throw new Error("BlockBuffer is required");
}
```

### Testing Patterns
```typescript
// ✅ GOOD: Test behavior, not implementation
it('should place blocks in correct positions when building wall', () => {
  // Test observable behavior
});

// ❌ AVOID: Testing internal state
it('should call internal method during build', () => {
  // Testing implementation details
});
```

## Minecraft-Specific Best Practices

### Coordinate System Management
- **Consistency**: Always use Point class for 3D coordinates
- **Offset Operations**: All positioning through `putOffset()` method
- **Orientation Handling**: Use Orientation type for rotations, not raw numbers

### Block Registry Pattern
```typescript
// ✅ GOOD: Centralized block management
MinecraftBlockRegistry.initialize();
const blockType = BlockType.STONE;

// ❌ AVOID: Raw string block IDs
world.getDimension().setBlockType(position, "minecraft:stone");
```

### Tick-Based Execution
- **System Integration**: Use `system.run()` for all recurring operations
- **Performance**: Batch operations to minimize per-tick overhead
- **Timing**: Respect Minecraft's tick cycle for smooth operation

## Prefab Design Patterns

### Composition Over Inheritance
```typescript
// ✅ GOOD: Composite pattern with delegation
class Anchor implements IPrefab {
  build(orientation: Orientation, putFunc: PutFunc): void {
    this.walls.forEach(wall => wall.build(orientation, putFunc));
    this.doors.forEach(door => door.build(orientation, putFunc));
  }
}
```

### Factory Pattern for Extensibility
```typescript
// ✅ GOOD: Factory enables easy extension
interface PrefabFactory {
  createWall(length: number): IPrefab;
  createDoor(width: number): IPrefab;
  createWindow(options: WindowOptions): IPrefab;
}
```

### Builder Pattern for Complex Configuration
```typescript
// ✅ GOOD: Fluent API for complex structures
const house = new HouseBuilder(blockBuffer, orientation)
  .withWalls(4)
  .withDoors(1)
  .withWindows(2)
  .build();
```

## Testing Best Practices

### Test Structure Standards
```typescript
describe('Component', () => {
  describe('method_name', () => {
    it('should expected_behavior when specific_condition', () => {
      // Arrange
      const component = new Component(dependencies);
      
      // Act
      const result = component.method(input);
      
      // Assert
      expect(result).toBehaviorDescription();
    });
  });
});
```

### Mock Strategy Principles
- **Interfaces Only**: Mock interfaces, not concrete classes
- **Minimal Mocking**: Only mock direct dependencies
- **Behavior Verification**: Test interactions, not internal state

### Integration Testing Approach
- **End-to-End**: Test complete building workflows
- **Real Components**: Use actual implementations where possible
- **Isolated Environment**: Use TextBlockBuffer for deterministic testing

## Performance Guidelines

### Memory Management
- **Object Reuse**: Reuse geometry objects where possible
- **Minimal Allocation**: Avoid creating objects in hot paths
- **Batch Operations**: Accumulate operations before execution

### Minecraft Optimization
- **Tick Budget**: Respect Minecraft's tick time budget
- **Chunked Operations**: Break large operations across multiple ticks
- **Lazy Loading**: Initialize expensive resources only when needed

## Development Workflow Standards

### Git Practices
- **Atomic Commits**: Each commit should represent a single logical change
- **Test Coverage**: All commits should maintain or improve test coverage
- **Linting**: All code must pass ESLint checks before commit

### Documentation Requirements
- **Interface Documentation**: All public interfaces must have JSDoc comments
- **Architecture Notes**: Significant architectural decisions documented in memory-bank
- **Example Usage**: Complex APIs should include usage examples

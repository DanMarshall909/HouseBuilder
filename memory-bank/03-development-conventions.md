# Development Conventions & Standards

## TypeScript Configuration
- **Target**: ES2020+ for modern Minecraft Bedrock compatibility
- **Module System**: ES modules with strict typing
- **Testing**: Jest with ts-jest transformer
- **Linting**: ESLint with minecraft-linting plugin

## Code Organization Principles

### Directory Structure Standards
```
scripts/
├── geometry/          # Mathematical utilities and 3D operations
├── implementations/   # Concrete implementations of interfaces
├── io/               # Input/output abstractions and interfaces
├── prefabs/          # Prefab system components
├── types/            # Type definitions and enums
└── textures/         # Block selection and texture logic
```

### Naming Conventions
- **Classes**: PascalCase (`HouseBuilder`, `BlockBuffer`)
- **Interfaces**: PascalCase with 'I' prefix (`IPrefab`, `IBlockIO`)
- **Files**: PascalCase matching primary export
- **Methods**: camelCase with descriptive verbs
- **Constants**: SCREAMING_SNAKE_CASE for enums

### Import/Export Standards
- **Index Files**: Each major module has an index.ts for clean imports
- **Re-exports**: Modules expose public API through index files
- **Interface Segregation**: Separate files for interfaces vs implementations

## Testing Strategy & Conventions

### Test File Organization
- **Naming**: `*.test.ts` suffix for all test files
- **Location**: Co-located with source files
- **Coverage**: Unit tests for individual classes, integration tests for workflows

### Test Structure Patterns
```typescript
describe('ComponentName', () => {
  describe('method_name', () => {
    it('should behavior when condition', () => {
      // Arrange, Act, Assert pattern
    });
  });
});
```

### Mock Strategy
- **TextBlockBuffer**: Used for testing without Minecraft dependencies
- **Factory Mocking**: PrefabFactory can be mocked for isolated testing
- **Interface Mocking**: All major dependencies implemented as interfaces for testability

## Minecraft Integration Standards

### Block Type Management
- **Enum-based**: BlockType enum for type safety
- **Registry Pattern**: MinecraftBlockRegistry for block management
- **Lazy Loading**: Block registry initialized on first use

### Coordinate System
- **Origin**: Uses Minecraft world coordinates
- **Orientation**: Consistent rotation handling through Orientation type
- **Offset Calculations**: All positioning through Point class transformations

## Error Handling Patterns
- **Interface Contracts**: Strong typing prevents many runtime errors
- **Validation**: Input validation at public API boundaries
- **Graceful Degradation**: System continues operation when non-critical components fail

## Performance Considerations
- **Batch Operations**: BlockBuffer accumulates operations for efficiency
- **Memory Management**: Minimal object creation in hot paths
- **Tick-based Execution**: Integration with Minecraft's tick system for smooth operation

# Architecture Documentation

## Core Design Patterns

### 1. Prefab System Architecture
The project implements a component-based prefab system with the following hierarchy:

```
IPrefab (interface)
├── Prefab (abstract base class)
├── Wall (concrete implementation)
├── Door (concrete implementation)
├── Window (concrete implementation)
└── Anchor (structural controller)
```

### 2. Factory Pattern Implementation
- **PrefabFactory**: Abstract factory interface for creating prefabs
- **DefaultPrefabFactory**: Concrete factory implementation
- **defaultPrefabFactory**: Singleton instance for global use

### 3. Block IO Abstraction Layer
```
IBlockIO (interface)
├── MinecraftBlockIO (Minecraft-specific implementation)
└── TextBlockBuffer (test/debug implementation)
```

## Key Components

### HouseBuilder (Main Orchestrator)
- **Role**: Primary entry point for house construction
- **Dependencies**: BlockBuffer, Orientation, PrefabFactory
- **Pattern**: Facade pattern - simplifies complex subsystem interactions

### BlockBuffer (IO Management)
- **Role**: Manages block placement operations with position buffering
- **Key Method**: `putOffset(position, orientation, blockType)`
- **Abstraction**: Decouples business logic from Minecraft-specific APIs

### Anchor (Structural Coordinator)
- **Role**: Defines the root structure and coordinates child prefab placement
- **Pattern**: Composite pattern - manages tree of prefab components
- **Responsibility**: Orchestrates the building process through delegation

### Geometry System
- **Point**: 3D coordinate representation with transformation capabilities
- **Orientation**: Rotation and positioning state management
- **Prism**: 3D volume calculations and operations

## Data Flow Architecture

1. **Initialization**: HouseBuilder creates BlockBuffer and Factory
2. **Structure Definition**: Anchor defines the overall house structure
3. **Recursive Building**: Each prefab builds itself and delegates to children
4. **Block Placement**: All block operations flow through BlockBuffer abstraction
5. **Minecraft Integration**: BlockBuffer delegates to MinecraftBlockIO for actual placement

## Testing Strategy
- **Unit Tests**: Individual prefab behavior verification
- **Integration Tests**: Full building process validation
- **Mock Objects**: TextBlockBuffer for testing without Minecraft dependency

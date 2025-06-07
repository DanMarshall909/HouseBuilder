# HouseBuilder Project Overview

## Purpose
HouseBuilder is a TypeScript-based Minecraft addon that programmatically generates house structures in Minecraft worlds. The project follows a modular, prefab-based architecture that allows for flexible and reusable building components.

## Key Value Propositions
- **Modular Architecture**: Uses a prefab system where individual components (walls, doors, windows) can be composed into larger structures
- **Type Safety**: Full TypeScript implementation with strong typing throughout
- **Test-Driven**: Comprehensive Jest testing suite ensuring reliability
- **Minecraft Integration**: Direct integration with Minecraft Bedrock Edition APIs

## Target Environment
- **Platform**: Minecraft Bedrock Edition
- **Runtime**: Minecraft server environment with TypeScript compilation
- **Development**: Node.js with TypeScript, Jest testing, ESLint linting

## Project Structure Philosophy
The project follows a clear separation of concerns:
- **Core Logic**: Business logic separated from Minecraft-specific implementations
- **IO Abstraction**: Block placement operations abstracted through interfaces
- **Factory Pattern**: Prefab creation handled through factory pattern for extensibility
- **Geometry Utilities**: Mathematical operations centralized in geometry module

/**
 * Prefab system for building structures
 * @module prefabs
 */

// Core interfaces and types
import { IPrefab } from "./IPrefab";
import { PrefabFactory, defaultPrefabFactory, DefaultPrefabFactory } from "./PrefabFactory";

// Base classes
import { Prefab } from "./Prefab";

// Concrete prefab implementations
import { Wall } from "./Wall";
import { Door } from "./Door";
import { Anchor } from "./Anchor";

// Initialize the default factory
import "./DefaultPrefabFactory";

// Export public API
export {
  // Interfaces and types
  IPrefab,
  PrefabFactory,

  // Factory implementation
  DefaultPrefabFactory,
  defaultPrefabFactory,

  // Base classes
  Prefab,

  // Concrete prefabs
  Wall,
  Door,
  Anchor,
};

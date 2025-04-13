// This file ensures proper initialization order
import { IPrefab } from "./IPrefab";
import { PrefabFactory, defaultPrefabFactory, DefaultPrefabFactory } from "./PrefabFactory";
import { Prefab } from "./Prefab";
import { Wall } from "./Wall";
import { Door } from "./Door";
import { Anchor } from "./Anchor";

// Initialize the default factory
import "./DefaultPrefabFactory";

// Export everything explicitly
export { IPrefab, PrefabFactory, DefaultPrefabFactory, defaultPrefabFactory, Prefab, Wall, Door, Anchor };

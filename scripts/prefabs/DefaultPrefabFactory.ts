import { Orientation } from "../geometry/Point";
import { BlockType } from "../types/Blocks";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { Wall } from "./Wall";
import { IPrefab } from "./IPrefab";

class DefaultPrefabFactory implements PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number): IPrefab {
    return new Wall(orientation, material, length);
  }
}

// Replace the default factory's implementation with our concrete one
Object.assign(defaultPrefabFactory, new DefaultPrefabFactory());

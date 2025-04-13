import { Prefab } from "./Prefab";
import { DoorType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

/**
 * Represents a door structure in the building system
 * A door is a single block that can be placed at a specific orientation
 */
export class Door extends Prefab {
  /**
   * Creates a new door prefab
   * @param orientation - The orientation at which to place the door
   * @param type - The type of door to place
   * @param factory - The factory to use for creating child prefabs
   */
  constructor(
    public readonly orientation: Orientation = Orientation.Zero,
    public readonly type: DoorType,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    super(orientation, factory);
  }

  /**
   * Draws the door by placing a single door block
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void {
    put(this.orientation, Point.Zero, this.type);
  }

  /**
   * Gets the orientation for child prefabs
   * @returns The same orientation as the door
   */
  getOrientationForChildPrefab(): Orientation {
    return this.orientation;
  }
}

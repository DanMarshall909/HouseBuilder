import { Prefab } from "./Prefab";
import { Orientation } from "../geometry/Point";
import { DoorType } from "../types/Blocks";
import { Door } from "./Door";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

/**
 * Represents an anchor point in the building system
 * An anchor serves as a container and starting point for other prefabs
 */
export class Anchor extends Prefab {
  /** List of child prefabs attached to this anchor */
  protected readonly children: Prefab[] = [];

  /**
   * Creates a new anchor prefab
   * @param orientation - The orientation of the anchor point
   * @param factory - The factory to use for creating child prefabs
   */
  constructor(public readonly orientation: Orientation, factory: PrefabFactory = defaultPrefabFactory) {
    super(orientation, factory);
  }

  /**
   * Gets the orientation for child prefabs
   * @returns The same orientation as the anchor
   */
  getOrientationForChildPrefab(): Orientation {
    return this.orientation;
  }

  /**
   * Draws nothing as the anchor is just a container
   */
  draw(): void {
    // Empty implementation as Anchor is just a container
  }

  /**
   * Adds a door as a child of this anchor
   * @param type - The type of door to add
   * @returns This anchor for method chaining
   */
  addDoor(type: DoorType): this {
    this.children.push(new Door(this.orientation, type, this.factory));
    return this;
  }
}

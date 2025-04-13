import { Prefab } from "./Prefab";
import { Orientation } from "../geometry/Point";
import { DoorType } from "../types/Blocks";
import { Door } from "./Door";
import { Window } from "./Window";
import { WindowOptions } from "../types/WindowOptions";
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

  /**
   * Adds a window as a child of this anchor
   * @param options - Configuration options for the window
   * @returns This anchor for method chaining
   * @throws {Error} If window dimensions are invalid or space is occupied
   */
  addWindow(options: WindowOptions = {}): this {
    // Check if space is occupied before adding the window
    const window = new Window(this.orientation, options, this.factory);

    // TODO: Add collision detection here
    // For now, we'll just add the window
    this.children.push(window);
    return this;
  }
}

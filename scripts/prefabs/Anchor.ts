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
    this.children.forEach((child) => child.draw());
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
    const window = new Window(this.orientation, options, this.factory);

    // Check for collisions with existing children
    this.children.forEach((child) => {
      if (child instanceof Window) {
        const childPoints = child.getOccupiedPoints().map((point) => child.localToWorld(point));
        const windowPoints = window.getOccupiedPoints().map((point) => window.localToWorld(point));

        const overlap = windowPoints.some((point) =>
          childPoints.some(
            (childPoint) => point.x === childPoint.x && point.y === childPoint.y && point.z === childPoint.z
          )
        );

        if (overlap) {
          throw new Error("Cannot place window: space is occupied");
        }
      }
    });

    this.children.push(window);
    return this;
  }
}

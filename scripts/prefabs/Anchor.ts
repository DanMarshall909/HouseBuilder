import { Prefab } from "./Prefab";
import { Orientation, Point } from "../geometry/Point";
import { DoorType } from "../types/Blocks";
import { Door } from "./Door";
import { Window } from "./Window";
import { WindowOptions } from "../types/WindowOptions";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { PutFunc } from "./PutFunc";

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
   * Draws nothing as the anchor is just a container
   */
  draw(put: PutFunc): void {
    // Pass the `put` argument to the `draw` method of child prefabs
    this.children.forEach((child) => child.draw(put));
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
    // Get the orientation for the new window based on existing children
    const windowOrientation = this.getOrientationForChildPrefab();
    const window = new Window(windowOrientation, options, this.factory);

    // Check for collisions with existing children
    if (this.children.length > 0) {
      const windowWorldPoints = window.getWorldOccupiedPoints();
      
      // Check against all existing children that might place blocks
      this.children.forEach((child) => {
        let childWorldPoints: Point[] = [];
        
        // Get occupied points from different prefab types
        if ('getWorldOccupiedPoints' in child && typeof child.getWorldOccupiedPoints === 'function') {
          childWorldPoints = child.getWorldOccupiedPoints();
        }
        
        const overlap = windowWorldPoints.some((windowPoint) =>
          childWorldPoints.some(
            (childPoint) => 
              windowPoint.x === childPoint.x && 
              windowPoint.y === childPoint.y && 
              windowPoint.z === childPoint.z
          )
        );

        if (overlap) {
          throw new Error("Cannot place window: space is occupied");
        }
      });
    }

    this.children.push(window);
    return this;
  }

  /**
   * Gets the orientation for the next child prefab based on existing children
   * @returns The orientation where the next child should be placed
   */
  getOrientationForChildPrefab(): Orientation {
    if (this.children.length === 0) {
      return this.orientation;
    }

    // Get the orientation from the last child
    const lastChild = this.children[this.children.length - 1];
    return lastChild.getOrientationForChildPrefab();
  }
}

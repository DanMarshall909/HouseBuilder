import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { WindowOptions, WindowDimensions } from "../types/WindowOptions";

const DEFAULT_WINDOW_OPTIONS: Required<WindowOptions> = {
  size: { width: 2, height: 2 },
  blockType: BlockType.GlassPane,
};

/**
 * Represents a window structure in the building system
 * A window is a rectangular structure made of glass blocks
 */
export class Window extends Prefab {
  private readonly size: WindowDimensions;
  private readonly blockType: BlockType;

  /**
   * Creates a new window prefab
   * @param orientation - The orientation at which to place the window
   * @param options - Configuration options for the window
   * @param factory - The factory to use for creating child prefabs
   * @throws {Error} If window dimensions are invalid
   */
  constructor(
    public readonly orientation: Orientation,
    options: WindowOptions = {},
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    super(orientation, factory);

    // Merge options with defaults
    const { size = DEFAULT_WINDOW_OPTIONS.size, blockType = DEFAULT_WINDOW_OPTIONS.blockType } = options;

    // Validate dimensions
    if (size.width < 1) throw new Error("Window width must be at least 1");
    if (size.height < 1) throw new Error("Window height must be at least 1");

    this.size = size;
    this.blockType = blockType;
  }

  /**
   * Gets the points that this window will occupy in local coordinates
   * @returns Array of points in local coordinates
   */
  getOccupiedPoints(): Point[] {
    const points: Point[] = [];
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        points.push(new Point(x, y, 0));
      }
    }
    return points;
  }

  /**
   * Gets the points that this window will occupy in world coordinates
   * @returns Array of points in world coordinates
   */
  getWorldOccupiedPoints(): Point[] {
    return this.getOccupiedPoints().map(point => this.localToWorld(point));
  }

  /**
   * Draws the window by placing glass blocks in a rectangular pattern
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void {
    // Place glass blocks in a rectangular pattern
    this.getOccupiedPoints().forEach((point) => {
      put(this.orientation, point, this.blockType);
    });
  }

  /**
   * Gets the orientation for child prefabs
   * @returns The orientation at the end of the window
   */
  getOrientationForChildPrefab(): Orientation {
    // Return orientation at the right edge of the window
    const endPoint = this.getOffsetPoint(this.size.width);
    return new Orientation(this.localToWorld(endPoint), this.orientation.rotation);
  }
}

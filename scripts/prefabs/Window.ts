import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point, Rotation } from "../geometry/Point";
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

  protected localToWorld(point: Point): Point {
    const { rotation, point: { x: ox, y: oy, z: oz } } = this.orientation;
    let x = 0;
    let z = 0;
    switch (rotation) {
      case 0:
        x = ox + point.x;
        z = oz + point.z;
        break;
      case 90:
        x = ox - point.z;
        z = oz + point.x;
        break;
      case 180:
        x = ox - point.x;
        z = oz - point.z;
        break;
      case 270:
        x = ox + point.z;
        z = oz - point.x;
        break;
      default:
        throw new Error(`Invalid rotation: ${rotation}`);
    }
    return new Point(x, oy + point.y, z);
  }

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
   * Gets the points that this window will occupy
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
   * Checks if this window would overlap with any existing blocks
   * @param put - Function to check block placement
   * @returns true if there would be an overlap
   */
  private checkOverlap(put: PutFunc): boolean {
    try {
      this.getOccupiedPoints().forEach((point) => {
        const world = this.localToWorld(point);
        put(new Orientation(world, 0 as Rotation), Point.Zero, this.blockType);
      });
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Draws the window by placing glass blocks in a rectangular pattern
   * @param put - Function to place blocks in the world
   * @throws {Error} If the window would overlap with existing blocks
   */
  draw(put: PutFunc): void {
    if (this.checkOverlap(put)) {
      throw new Error("Cannot place window: space is occupied");
    }

    this.getOccupiedPoints().forEach((point) => {
      const world = this.localToWorld(point);
      put(new Orientation(world, 0 as Rotation), Point.Zero, this.blockType);
    });
  }

  /**
   * Gets the orientation for child prefabs
   * @returns The orientation at the end of the window
   */
  getOrientationForChildPrefab(): Orientation {
    // Return orientation at the right edge of the window
    const endPoint = this.getOffsetPoint(this.size.width);
    const world = this.localToWorld(endPoint);
    return new Orientation(world, this.orientation.rotation);
  }
}

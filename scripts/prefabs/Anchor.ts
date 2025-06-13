import { Prefab } from "./Prefab";
import { Orientation, Point, Rotation } from "../geometry/Point";
import { DoorType, BlockType } from "../types/Blocks";
import { Door } from "./Door";
import { Window } from "./Window";
import { WindowOptions } from "../types/WindowOptions";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { Wall } from "./Wall";

/**
 * Represents an anchor point in the building system
 * An anchor serves as a container and starting point for other prefabs
 */
export class Anchor extends Prefab {
  /** List of child prefabs attached to this anchor */
  protected readonly children: Prefab[] = [];
  /** Track occupied world coordinates for collision checks */
  private readonly occupied: Set<string> = new Set();

  private pointKey(pt: Point): string {
    return `${pt.x},${pt.y},${pt.z}`;
  }

  private applyOrientation(local: Point, orientation: Orientation): Point {
    const { rotation, point: { x: ox, y: oy, z: oz } } = orientation;
    let x = 0;
    let z = 0;
    switch (rotation) {
      case 0:
        x = ox + local.x;
        z = oz + local.z;
        break;
      case 90:
        x = ox - local.z;
        z = oz + local.x;
        break;
      case 180:
        x = ox - local.x;
        z = oz - local.z;
        break;
      case 270:
        x = ox + local.z;
        z = oz - local.x;
        break;
      default:
        throw new Error(`Invalid rotation: ${rotation}`);
    }
    return new Point(x, oy + local.y, z);
  }

  private applyBlockBufferOrientation(local: Point, orientation: Orientation): Point {
    const { rotation, point: { x: ox, y: oy, z: oz } } = orientation;
    let x = 0;
    let z = 0;
    switch (rotation) {
      case 0:
        x = local.x + ox;
        z = local.z + oz;
        break;
      case 90:
        x = local.x + oz;
        z = local.z + ox;
        break;
      case 180:
        x = local.x - ox;
        z = local.z - oz;
        break;
      case 270:
        x = local.x + oz;
        z = local.z - ox;
        break;
      default:
        throw new Error(`Invalid rotation: ${rotation}`);
    }
    return new Point(x, oy + local.y, z);
  }

  private currentEndOrientation(): Orientation {
    if (this.children.length === 0) {
      return this.orientation;
    }
    const last = this.children[this.children.length - 1] as Prefab;
    return last.getOrientationForChildPrefab();
  }

  private orientationAfterLastChild(): Orientation {
    const base = this.currentEndOrientation();
    const last = this.children[this.children.length - 1];
    if (last instanceof Wall) {
      let offset: Point;
      switch (base.rotation) {
        case 0:
          offset = new Point(1, 0, 0);
          break;
        case 90:
          offset = new Point(0, 0, 1);
          break;
        case 180:
          offset = new Point(-1, 0, 0);
          break;
        case 270:
          offset = new Point(0, 0, -1);
          break;
        default:
          offset = Point.Zero;
      }
      const point = this.applyBlockBufferOrientation(offset, base);
      return new Orientation(point, base.rotation);
    }
    return base;
  }

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
    const start = this.orientationAfterLastChild();
    const door = new Door(start, type, this.factory);
    this.children.push(door);
    const worldPos = this.applyBlockBufferOrientation(Point.Zero, start);
    this.occupied.add(this.pointKey(worldPos));
    return this;
  }

  /**
   * Adds a window as a child of this anchor
   * @param options - Configuration options for the window
   * @returns This anchor for method chaining
   * @throws {Error} If window dimensions are invalid or space is occupied
   */
  addWindow(options: WindowOptions = {}): this {
    const start = this.orientationAfterLastChild();
    const window = new Window(start, options, this.factory);

    // Determine world points for the window using standard orientation
    const points = window
      .getOccupiedPoints()
      .map((p) => this.applyOrientation(p, start));

    for (const pt of points) {
      if (this.occupied.has(this.pointKey(pt))) {
        throw new Error("Cannot place window: space is occupied");
      }
    }

    points.forEach((pt) => this.occupied.add(this.pointKey(pt)));
    this.children.push(window);
    return this;
  }

  addWall(material: BlockType, length: number, rotation: Rotation = 0): this {
    const start = this.currentEndOrientation();
    const wallOrientation = new Orientation(start.point, rotation as Rotation);
    const wall = new Wall(wallOrientation, material, length, this.factory);

    const points: Point[] = [];
    for (let i = 0; i < length; i++) {
      const offset = i + 1;
      let local: Point;
      switch (wallOrientation.rotation) {
        case 0:
          local = new Point(offset, 0, 0);
          break;
        case 90:
          local = new Point(0, 0, offset);
          break;
        case 180:
          local = new Point(-offset, 0, 0);
          break;
        case 270:
          local = new Point(0, 0, -offset);
          break;
        default:
          throw new Error("Invalid rotation");
      }
      const world = this.applyBlockBufferOrientation(local, wallOrientation);
      points.push(world);
    }
    points.forEach((pt) => this.occupied.add(this.pointKey(pt)));
    this.children.push(wall);
    return this;
  }
}

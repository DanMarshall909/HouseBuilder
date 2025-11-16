import { Prefab } from "./Prefab";
import { BlockType, DoorType } from "../types/Blocks";
import { Orientation, Point, Rotation } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { WindowOptions } from "../types/WindowOptions";
import { RoofStyle } from "./Roof";

/**
 * Represents a complete room structure in the building system
 * A room can contain floors, walls, windows, doors, ceilings, and roofs
 */
export class Room extends Prefab {
  /**
   * Creates a new room prefab
   * @param orientation - The starting orientation of the room
   * @param width - The width of the room in blocks (along rotation axis)
   * @param depth - The depth of the room in blocks (perpendicular to rotation axis)
   * @param height - The height of the room walls in blocks
   * @param factory - The factory to use for creating child prefabs
   * @throws {Error} If dimensions are less than 1
   */
  constructor(
    public readonly orientation: Orientation,
    public readonly width: number,
    public readonly depth: number,
    public readonly height: number,
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    if (width < 1) {
      throw new Error("Room width must be at least 1 block");
    }
    if (depth < 1) {
      throw new Error("Room depth must be at least 1 block");
    }
    if (height < 1) {
      throw new Error("Room height must be at least 1 block");
    }
    super(orientation, factory);
  }

  /**
   * Room doesn't draw anything itself - it's a container for other prefabs
   */
  draw(put: PutFunc): void {
    // Room is a logical container - it doesn't draw blocks itself
  }

  /**
   * Gets the orientation for child prefabs
   * @returns The starting orientation of the room
   */
  getOrientationForChildPrefab(): Orientation {
    return this.orientation;
  }

  /**
   * Adds a floor to the room
   * @param material - The block type to use for the floor
   * @param yOffset - The vertical offset from the room's base (default 0)
   * @returns This room for method chaining
   */
  addFloor(material: BlockType, yOffset: number = 0): this {
    const floorOrientation = new Orientation(
      new Point(
        this.orientation.point.x,
        this.orientation.point.y + yOffset,
        this.orientation.point.z
      ),
      this.orientation.rotation
    );
    const floor = this.factory.createFloor(floorOrientation, material, this.width, this.depth);
    this.children.push(floor);
    return this;
  }

  /**
   * Adds a ceiling to the room
   * @param material - The block type to use for the ceiling
   * @returns This room for method chaining
   */
  addCeiling(material: BlockType): this {
    return this.addFloor(material, this.height);
  }

  /**
   * Builds a wall on the specified side of the room
   * @param side - Which side of the room (front, back, left, right)
   * @param material - The block type to use for the wall
   * @param startHeight - Starting height of the wall (default 1)
   * @param wallHeight - Height of the wall (default room height)
   * @returns This room for method chaining
   */
  buildWall(
    side: "front" | "back" | "left" | "right",
    material: BlockType,
    startHeight: number = 1,
    wallHeight?: number
  ): this {
    const actualWallHeight = wallHeight ?? this.height;
    const { position, rotation, length } = this.getWallConfig(side);

    // Build the wall vertically
    for (let y = startHeight; y < startHeight + actualWallHeight; y++) {
      const wallOrientation = new Orientation(
        new Point(
          this.orientation.point.x + position.x,
          this.orientation.point.y + y,
          this.orientation.point.z + position.z
        ),
        (this.orientation.rotation + rotation) % 360 as Rotation
      );
      const wall = this.factory.createWall(wallOrientation, material, length);
      this.children.push(wall);
    }

    return this;
  }

  /**
   * Adds a window to a wall
   * @param side - Which wall to add the window to
   * @param offsetAlong - Offset along the wall
   * @param offsetHeight - Height offset from floor
   * @param options - Window configuration options
   * @returns This room for method chaining
   */
  addWindow(
    side: "front" | "back" | "left" | "right",
    offsetAlong: number,
    offsetHeight: number,
    options?: WindowOptions
  ): this {
    const { position, rotation } = this.getWallConfig(side);

    const windowOrientation = new Orientation(
      new Point(
        this.orientation.point.x + position.x,
        this.orientation.point.y + offsetHeight,
        this.orientation.point.z + position.z
      ),
      (this.orientation.rotation + rotation) % 360 as Rotation
    );

    const window = this.factory.createWindow(windowOrientation, offsetAlong, options);
    this.children.push(window);
    return this;
  }

  /**
   * Adds a door to a wall
   * @param side - Which wall to add the door to
   * @param offsetAlong - Offset along the wall
   * @param material - The block type for the door
   * @returns This room for method chaining
   */
  buildDoor(
    side: "front" | "back" | "left" | "right",
    offsetAlong: number,
    material: DoorType
  ): this {
    const { position, rotation } = this.getWallConfig(side);

    const doorOrientation = new Orientation(
      new Point(
        this.orientation.point.x + position.x,
        this.orientation.point.y + 1,
        this.orientation.point.z + position.z
      ),
      (this.orientation.rotation + rotation) % 360 as Rotation
    );

    const door = this.factory.createDoor(doorOrientation, material, offsetAlong);
    this.children.push(door);
    return this;
  }

  /**
   * Adds a roof to the room
   * @param material - The block type to use for the roof
   * @param style - The roof style
   * @returns This room for method chaining
   */
  addRoof(material: BlockType, style: RoofStyle = "flat"): this {
    const roofOrientation = new Orientation(
      new Point(
        this.orientation.point.x,
        this.orientation.point.y + this.height,
        this.orientation.point.z
      ),
      this.orientation.rotation
    );
    const roof = this.factory.createRoof(roofOrientation, material, this.width, this.depth, style);
    this.children.push(roof);
    return this;
  }

  /**
   * Adds stairs inside the room
   * @param corner - Which corner to place stairs (frontLeft, frontRight, backLeft, backRight)
   * @param material - The block type for the stairs
   * @param steps - Number of steps
   * @returns This room for method chaining
   */
  addStairs(
    corner: "frontLeft" | "frontRight" | "backLeft" | "backRight",
    material: BlockType,
    steps: number
  ): this {
    const { position, rotation } = this.getStairConfig(corner);

    const stairOrientation = new Orientation(
      new Point(
        this.orientation.point.x + position.x,
        this.orientation.point.y + 1,
        this.orientation.point.z + position.z
      ),
      (this.orientation.rotation + rotation) % 360 as Rotation
    );

    const stairs = this.factory.createStairs(stairOrientation, material, steps);
    this.children.push(stairs);
    return this;
  }

  /**
   * Gets the wall configuration for a given side
   */
  private getWallConfig(side: "front" | "back" | "left" | "right"): {
    position: Point;
    rotation: Rotation;
    length: number;
  } {
    switch (side) {
      case "front": // Along the width, at depth=0
        return {
          position: new Point(0, 0, 0),
          rotation: 0,
          length: this.width - 1,
        };
      case "back": // Along the width, at depth=max
        return {
          position: new Point(0, 0, this.depth - 1),
          rotation: 180,
          length: this.width - 1,
        };
      case "left": // Along the depth, at width=0
        return {
          position: new Point(0, 0, 0),
          rotation: 90,
          length: this.depth - 1,
        };
      case "right": // Along the depth, at width=max
        return {
          position: new Point(this.width - 1, 0, 0),
          rotation: 270,
          length: this.depth - 1,
        };
    }
  }

  /**
   * Gets the stair configuration for a given corner
   */
  private getStairConfig(corner: "frontLeft" | "frontRight" | "backLeft" | "backRight"): {
    position: Point;
    rotation: Rotation;
  } {
    switch (corner) {
      case "frontLeft":
        return { position: new Point(0, 0, 0), rotation: 0 };
      case "frontRight":
        return { position: new Point(this.width - 1, 0, 0), rotation: 270 };
      case "backLeft":
        return { position: new Point(0, 0, this.depth - 1), rotation: 90 };
      case "backRight":
        return { position: new Point(this.width - 1, 0, this.depth - 1), rotation: 180 };
    }
  }
}

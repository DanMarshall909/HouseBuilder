import { HouseConfig, RoomConfig, WindowConfig, DoorConfig, WallConfig, StairsConfig, ObjectConfig } from "./HouseConfig";
import { BlockType, DoorType } from "../types/Blocks";
import { Orientation, Point, Rotation } from "../geometry/Point";
import { BlockBuffer } from "../io/BlockBuffer";
import { Room } from "../prefabs/Room";
import { defaultPrefabFactory } from "../prefabs/PrefabFactory";
import { WindowOptions } from "../types/WindowOptions";

/**
 * Builds houses from JSON configuration files
 */
export class JsonHouseBuilder {
  private blockBuffer: BlockBuffer;

  constructor() {
    this.blockBuffer = new BlockBuffer();
  }

  /**
   * Builds a house from a JSON configuration
   * @param config - The house configuration
   * @returns The BlockBuffer containing all the blocks
   */
  build(config: HouseConfig): BlockBuffer {
    this.blockBuffer = new BlockBuffer();

    console.log(`Building house: ${config.name}`);
    if (config.description) {
      console.log(`Description: ${config.description}`);
    }

    // Build each room
    for (const roomConfig of config.rooms) {
      this.buildRoom(roomConfig);
    }

    return this.blockBuffer;
  }

  /**
   * Builds a single room from configuration
   */
  private buildRoom(roomConfig: RoomConfig): void {
    const { position, rotation, width, depth, height } = roomConfig;

    // Create the room orientation
    const orientation = new Orientation(
      new Point(position.x, position.y, position.z),
      rotation as Rotation
    );

    // Create the room
    const room = new Room(orientation, width, depth, height, defaultPrefabFactory);

    // Add floor if specified
    if (roomConfig.floor) {
      const floorMaterial = this.parseBlockType(roomConfig.floor.material);
      room.addFloor(floorMaterial, roomConfig.floor.yOffset);
    }

    // Add walls if specified
    if (roomConfig.walls) {
      for (const wall of roomConfig.walls) {
        this.buildWall(room, wall);
      }
    }

    // Add windows if specified
    if (roomConfig.windows) {
      for (const window of roomConfig.windows) {
        this.buildWindow(room, window);
      }
    }

    // Add doors if specified
    if (roomConfig.doors) {
      for (const door of roomConfig.doors) {
        this.buildDoor(room, door);
      }
    }

    // Add stairs if specified
    if (roomConfig.stairs) {
      for (const stairs of roomConfig.stairs) {
        this.addStairs(room, stairs);
      }
    }

    // Add ceiling if specified
    if (roomConfig.ceiling) {
      const ceilingMaterial = this.parseBlockType(roomConfig.ceiling.material);
      room.addCeiling(ceilingMaterial);
    }

    // Add roof if specified
    if (roomConfig.roof) {
      const roofMaterial = this.parseBlockType(roomConfig.roof.material);
      const roofStyle = roomConfig.roof.style || "flat";
      room.addRoof(roofMaterial, roofStyle);
    }

    // Add objects if specified
    if (roomConfig.objects) {
      for (const obj of roomConfig.objects) {
        this.placeObject(obj);
      }
    }

    // Build the room into the block buffer
    room.build(orientation, (putOrientation, point, blockType) => {
      this.blockBuffer.putOffset(point, putOrientation, blockType);
    });
  }

  /**
   * Builds a wall in a room
   */
  private buildWall(room: Room, wallConfig: WallConfig): void {
    const material = this.parseBlockType(wallConfig.material);
    room.buildWall(
      wallConfig.side,
      material,
      wallConfig.startHeight,
      wallConfig.wallHeight
    );
  }

  /**
   * Builds a window in a room
   */
  private buildWindow(room: Room, windowConfig: WindowConfig): void {
    const options: WindowOptions = {};

    if (windowConfig.width && windowConfig.height) {
      options.size = {
        width: windowConfig.width,
        height: windowConfig.height,
      };
    }

    if (windowConfig.material) {
      options.blockType = this.parseBlockType(windowConfig.material);
    }

    room.addWindow(
      windowConfig.side,
      windowConfig.offsetAlong,
      windowConfig.offsetHeight,
      options
    );
  }

  /**
   * Builds a door in a room
   */
  private buildDoor(room: Room, doorConfig: DoorConfig): void {
    const material = this.parseDoorType(doorConfig.material);
    room.buildDoor(doorConfig.side, doorConfig.offsetAlong, material);
  }

  /**
   * Adds stairs to a room
   */
  private addStairs(room: Room, stairsConfig: StairsConfig): void {
    const material = this.parseBlockType(stairsConfig.material);
    room.addStairs(
      stairsConfig.corner,
      material,
      stairsConfig.steps
    );
  }

  /**
   * Parses a string block type name to BlockType enum
   */
  private parseBlockType(blockTypeName: string): BlockType {
    // Try to find the block type in the BlockType enum
    const blockType = (BlockType as any)[blockTypeName];
    if (blockType === undefined) {
      throw new Error(`Unknown block type: ${blockTypeName}`);
    }
    return blockType as BlockType;
  }

  /**
   * Parses a string door type name to DoorType enum
   */
  private parseDoorType(doorTypeName: string): DoorType {
    // Try to find the door type in the DoorType enum
    const doorType = (BlockType as any)[doorTypeName];
    if (doorType === undefined) {
      throw new Error(`Unknown door type: ${doorTypeName}`);
    }
    return doorType as DoorType;
  }

  /**
   * Places an object in the scene
   */
  private placeObject(objectConfig: ObjectConfig): void {
    const blockType = this.parseBlockType(objectConfig.type);
    const position = new Point(
      objectConfig.position.x,
      objectConfig.position.y,
      objectConfig.position.z
    );
    const rotation = objectConfig.rotation || 0;
    const orientation = new Orientation(position, rotation as Rotation);

    this.blockBuffer.putOffset(position, orientation, blockType);
  }

  /**
   * Gets the block buffer
   */
  getBlockBuffer(): BlockBuffer {
    return this.blockBuffer;
  }

  /**
   * Loads and builds a house from a JSON string
   */
  static fromJson(json: string): BlockBuffer {
    const config: HouseConfig = JSON.parse(json);
    const builder = new JsonHouseBuilder();
    return builder.build(config);
  }

  /**
   * Loads and builds a house from a configuration object
   */
  static fromConfig(config: HouseConfig): BlockBuffer {
    const builder = new JsonHouseBuilder();
    return builder.build(config);
  }
}

import { Orientation, Rotation } from "../geometry/Point";
import { BlockType, DoorType } from "../types/Blocks";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";
import { Wall } from "./Wall";
import { Floor } from "./Floor";
import { Roof, RoofStyle } from "./Roof";
import { Stairs } from "./Stairs";
import { Room } from "./Room";
import { Window } from "./Window";
import { Door } from "./Door";
import { IPrefab } from "./IPrefab";
import { WindowOptions } from "../types/WindowOptions";

class DefaultPrefabFactoryImpl implements PrefabFactory {
  createWall(orientation: Orientation, material: BlockType, length: number, rotation: Rotation = 0): IPrefab {
    // Normalize rotation to be between 0 and 359
    const normalizedRotation = ((((orientation.rotation + rotation) % 360) + 360) % 360) as Rotation;
    const newOrientation = new Orientation(orientation.point, normalizedRotation);
    return new Wall(newOrientation, material, length, this);
  }

  createFloor(orientation: Orientation, material: BlockType, width: number, depth: number): IPrefab {
    return new Floor(orientation, material, width, depth, this);
  }

  createRoof(orientation: Orientation, material: BlockType, width: number, depth: number, style: RoofStyle): IPrefab {
    return new Roof(orientation, material, width, depth, style, this);
  }

  createStairs(orientation: Orientation, material: BlockType, steps: number, width: number = 1): IPrefab {
    return new Stairs(orientation, material, steps, width, this);
  }

  createRoom(orientation: Orientation, width: number, depth: number, height: number): IPrefab {
    return new Room(orientation, width, depth, height, this);
  }

  createWindow(orientation: Orientation, offset: number, options?: WindowOptions): IPrefab {
    return new Window(orientation, options, this);
  }

  createDoor(orientation: Orientation, doorType: DoorType, offset: number): IPrefab {
    return new Door(orientation, doorType, this);
  }
}

// Replace the default factory's implementation with our concrete one
Object.assign(defaultPrefabFactory, new DefaultPrefabFactoryImpl());

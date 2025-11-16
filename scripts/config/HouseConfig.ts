import { BlockType, DoorType } from "../types/Blocks";
import { RoofStyle } from "../prefabs/Roof";

/**
 * Position in 3D space
 */
export interface Position {
  x: number;
  y: number;
  z: number;
}

/**
 * Rotation angles (0, 90, 180, 270)
 */
export type ConfigRotation = 0 | 90 | 180 | 270;

/**
 * Wall side in a room
 */
export type WallSide = "front" | "back" | "left" | "right";

/**
 * Corner position for stairs
 */
export type StairCorner = "frontLeft" | "frontRight" | "backLeft" | "backRight";

/**
 * Window configuration in JSON
 */
export interface WindowConfig {
  side: WallSide;
  offsetAlong: number;
  offsetHeight: number;
  width?: number;
  height?: number;
  material?: string;
}

/**
 * Door configuration in JSON
 */
export interface DoorConfig {
  side: WallSide;
  offsetAlong: number;
  material: string;
}

/**
 * Wall configuration in JSON
 */
export interface WallConfig {
  side: WallSide;
  material: string;
  startHeight?: number;
  wallHeight?: number;
}

/**
 * Stairs configuration in JSON
 */
export interface StairsConfig {
  corner: StairCorner;
  material: string;
  steps: number;
  width?: number;
}

/**
 * Floor configuration in JSON
 */
export interface FloorConfig {
  material: string;
  yOffset?: number;
}

/**
 * Roof configuration in JSON
 */
export interface RoofConfig {
  material: string;
  style?: RoofStyle;
}

/**
 * Room configuration in JSON
 */
export interface RoomConfig {
  position: Position;
  rotation: ConfigRotation;
  width: number;
  depth: number;
  height: number;
  floor?: FloorConfig;
  ceiling?: FloorConfig;
  walls?: WallConfig[];
  windows?: WindowConfig[];
  doors?: DoorConfig[];
  stairs?: StairsConfig[];
  roof?: RoofConfig;
}

/**
 * Complete house configuration
 */
export interface HouseConfig {
  name: string;
  description?: string;
  rooms: RoomConfig[];
}

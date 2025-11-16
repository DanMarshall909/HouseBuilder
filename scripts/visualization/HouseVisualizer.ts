import { HouseConfig, RoomConfig, Position } from "../config/HouseConfig";
import { BlockType } from "../types/Blocks";
import { Point, Orientation, Rotation } from "../geometry/Point";
import { BlockBuffer } from "../io/BlockBuffer";
import { Dimension } from "@minecraft/server";

/**
 * Visualization mode for house preview
 */
export enum VisualizationMode {
  /** Wireframe outline using barrier/glass blocks */
  Wireframe = "wireframe",
  /** Semi-transparent holographic preview */
  Holographic = "holographic",
  /** Solid preview with actual materials */
  Solid = "solid",
  /** Colored room boundaries */
  ColoredBounds = "colored_bounds"
}

/**
 * Visualizer options
 */
export interface VisualizerOptions {
  mode: VisualizationMode;
  showRoomLabels?: boolean;
  showDimensions?: boolean;
  highlightConnections?: boolean;
  basePosition?: Position;
}

/**
 * 3D House Visualizer
 * Renders houses in various visual modes for preview and planning
 */
export class HouseVisualizer {
  private dimension?: Dimension;

  constructor(dimension?: Dimension) {
    this.dimension = dimension;
  }

  /**
   * Visualizes a house configuration in 3D
   * @param config - House configuration to visualize
   * @param options - Visualization options
   * @returns BlockBuffer containing the visualization
   */
  visualize(config: HouseConfig, options: VisualizerOptions): BlockBuffer {
    const buffer = new BlockBuffer();

    switch (options.mode) {
      case VisualizationMode.Wireframe:
        this.renderWireframe(config, buffer, options);
        break;
      case VisualizationMode.Holographic:
        this.renderHolographic(config, buffer, options);
        break;
      case VisualizationMode.Solid:
        this.renderSolid(config, buffer, options);
        break;
      case VisualizationMode.ColoredBounds:
        this.renderColoredBounds(config, buffer, options);
        break;
    }

    return buffer;
  }

  /**
   * Renders a wireframe outline of the house
   */
  private renderWireframe(config: HouseConfig, buffer: BlockBuffer, options: VisualizerOptions): void {
    const wireframeMaterial = BlockType.Glass;

    config.rooms.forEach((room, index) => {
      this.renderRoomWireframe(room, buffer, wireframeMaterial, index);
    });

    // Highlight connections if requested
    if (options.highlightConnections && config.connections) {
      this.renderConnections(config, buffer);
    }
  }

  /**
   * Renders a single room as a wireframe
   */
  private renderRoomWireframe(
    room: RoomConfig,
    buffer: BlockBuffer,
    material: BlockType,
    roomIndex: number
  ): void {
    const { position, rotation, width, depth, height } = room;
    const orientation = new Orientation(
      new Point(position.x, position.y, position.z),
      rotation as Rotation
    );

    // Draw edges of the room
    // Bottom edges
    this.drawLine(buffer, orientation, 0, 0, 0, width - 1, 0, 0, material); // Front bottom
    this.drawLine(buffer, orientation, 0, 0, depth - 1, width - 1, 0, depth - 1, material); // Back bottom
    this.drawLine(buffer, orientation, 0, 0, 0, 0, 0, depth - 1, material); // Left bottom
    this.drawLine(buffer, orientation, width - 1, 0, 0, width - 1, 0, depth - 1, material); // Right bottom

    // Top edges
    this.drawLine(buffer, orientation, 0, height, 0, width - 1, height, 0, material); // Front top
    this.drawLine(buffer, orientation, 0, height, depth - 1, width - 1, height, depth - 1, material); // Back top
    this.drawLine(buffer, orientation, 0, height, 0, 0, height, depth - 1, material); // Left top
    this.drawLine(buffer, orientation, width - 1, height, 0, width - 1, height, depth - 1, material); // Right top

    // Vertical edges (corners)
    this.drawLine(buffer, orientation, 0, 0, 0, 0, height, 0, material); // Front-left
    this.drawLine(buffer, orientation, width - 1, 0, 0, width - 1, height, 0, material); // Front-right
    this.drawLine(buffer, orientation, 0, 0, depth - 1, 0, height, depth - 1, material); // Back-left
    this.drawLine(buffer, orientation, width - 1, 0, depth - 1, width - 1, height, depth - 1, material); // Back-right

    // Render door and window positions as colored markers
    if (room.doors) {
      room.doors.forEach(door => {
        this.renderDoorMarker(room, door.side, door.offsetAlong, buffer, orientation);
      });
    }

    if (room.windows) {
      room.windows.forEach(window => {
        this.renderWindowMarker(room, window.side, window.offsetAlong, window.offsetHeight, buffer, orientation);
      });
    }
  }

  /**
   * Renders a holographic semi-transparent preview
   */
  private renderHolographic(config: HouseConfig, buffer: BlockBuffer, options: VisualizerOptions): void {
    // Use different colored glass for different room types
    const glassColors = [
      BlockType.BlueStainedGlass,
      BlockType.GreenStainedGlass,
      BlockType.RedStainedGlass,
      BlockType.YellowStainedGlass,
      BlockType.PurpleStainedGlass,
      BlockType.CyanStainedGlass
    ];

    config.rooms.forEach((room, index) => {
      const glassMaterial = glassColors[index % glassColors.length];
      this.renderRoomHolographic(room, buffer, glassMaterial);
    });
  }

  /**
   * Renders a single room as holographic preview
   */
  private renderRoomHolographic(room: RoomConfig, buffer: BlockBuffer, material: BlockType): void {
    const { position, rotation, width, depth, height } = room;
    const orientation = new Orientation(
      new Point(position.x, position.y, position.z),
      rotation as Rotation
    );

    // Render semi-transparent walls
    // Front and back walls
    for (let y = 0; y <= height; y++) {
      for (let x = 0; x < width; x++) {
        buffer.putOffset(new Point(position.x + x, position.y + y, position.z), orientation, material);
        buffer.putOffset(new Point(position.x + x, position.y + y, position.z + depth - 1), orientation, material);
      }
    }

    // Left and right walls
    for (let y = 0; y <= height; y++) {
      for (let z = 0; z < depth; z++) {
        buffer.putOffset(new Point(position.x, position.y + y, position.z + z), orientation, material);
        buffer.putOffset(new Point(position.x + width - 1, position.y + y, position.z + z), orientation, material);
      }
    }

    // Floor and ceiling as lighter glass
    const floorMaterial = BlockType.Glass;
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        buffer.putOffset(new Point(position.x + x, position.y, position.z + z), orientation, floorMaterial);
        buffer.putOffset(new Point(position.x + x, position.y + height, position.z + z), orientation, floorMaterial);
      }
    }
  }

  /**
   * Renders a solid preview with actual materials
   */
  private renderSolid(config: HouseConfig, buffer: BlockBuffer, options: VisualizerOptions): void {
    // This would use the actual JsonHouseBuilder, but with preview materials
    // For now, just render wireframes with solid blocks
    config.rooms.forEach((room, index) => {
      this.renderRoomWireframe(room, buffer, BlockType.StoneBricks, index);
    });
  }

  /**
   * Renders colored room boundaries
   */
  private renderColoredBounds(config: HouseConfig, buffer: BlockBuffer, options: VisualizerOptions): void {
    const colors = [
      BlockType.RedWool,
      BlockType.BlueWool,
      BlockType.GreenWool,
      BlockType.YellowWool,
      BlockType.PurpleWool,
      BlockType.OrangeWool,
      BlockType.LimeWool,
      BlockType.CyanWool
    ];

    config.rooms.forEach((room, index) => {
      const color = colors[index % colors.length];
      this.renderRoomBounds(room, buffer, color);
    });
  }

  /**
   * Renders room boundaries with colored blocks
   */
  private renderRoomBounds(room: RoomConfig, buffer: BlockBuffer, material: BlockType): void {
    const { position, rotation, width, depth, height } = room;
    const orientation = new Orientation(
      new Point(position.x, position.y, position.z),
      rotation as Rotation
    );

    // Draw corner markers (2x2x2 cubes at each corner)
    this.drawCornerMarker(buffer, orientation, 0, 0, 0, material);
    this.drawCornerMarker(buffer, orientation, width - 2, 0, 0, material);
    this.drawCornerMarker(buffer, orientation, 0, 0, depth - 2, material);
    this.drawCornerMarker(buffer, orientation, width - 2, 0, depth - 2, material);
  }

  /**
   * Draws a corner marker cube
   */
  private drawCornerMarker(
    buffer: BlockBuffer,
    orientation: Orientation,
    x: number,
    y: number,
    z: number,
    material: BlockType
  ): void {
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 0; dy < 2; dy++) {
        for (let dz = 0; dz < 2; dz++) {
          const point = new Point(
            orientation.point.x + x + dx,
            orientation.point.y + y + dy,
            orientation.point.z + z + dz
          );
          buffer.putOffset(point, orientation, material);
        }
      }
    }
  }

  /**
   * Draws a line between two points
   */
  private drawLine(
    buffer: BlockBuffer,
    orientation: Orientation,
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number,
    material: BlockType
  ): void {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const dz = Math.abs(z2 - z1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    const sz = z1 < z2 ? 1 : -1;
    const dm = Math.max(dx, dy, dz);
    let x = x1, y = y1, z = z1;

    for (let i = 0; i <= dm; i++) {
      const point = new Point(
        orientation.point.x + x,
        orientation.point.y + y,
        orientation.point.z + z
      );
      buffer.putOffset(point, orientation, material);

      if (i < dm) {
        const e1 = (i + 1) * dx;
        const e2 = (i + 1) * dy;
        const e3 = (i + 1) * dz;

        if (e1 >= dm * Math.abs(x - x1)) x += sx;
        if (e2 >= dm * Math.abs(y - y1)) y += sy;
        if (e3 >= dm * Math.abs(z - z1)) z += sz;
      }
    }
  }

  /**
   * Renders a door marker
   */
  private renderDoorMarker(
    room: RoomConfig,
    side: string,
    offset: number,
    buffer: BlockBuffer,
    orientation: Orientation
  ): void {
    const markerMaterial = BlockType.IronBlock;
    const { position } = room;
    let x = 0, y = 1, z = 0;

    switch (side) {
      case "front":
        x = offset;
        z = 0;
        break;
      case "back":
        x = offset;
        z = room.depth - 1;
        break;
      case "left":
        x = 0;
        z = offset;
        break;
      case "right":
        x = room.width - 1;
        z = offset;
        break;
    }

    const point = new Point(position.x + x, position.y + y, position.z + z);
    buffer.putOffset(point, orientation, markerMaterial);
    buffer.putOffset(new Point(point.x, point.y + 1, point.z), orientation, markerMaterial);
  }

  /**
   * Renders a window marker
   */
  private renderWindowMarker(
    room: RoomConfig,
    side: string,
    offsetAlong: number,
    offsetHeight: number,
    buffer: BlockBuffer,
    orientation: Orientation
  ): void {
    const markerMaterial = BlockType.LightBlueStainedGlass;
    const { position } = room;
    let x = 0, y = offsetHeight, z = 0;

    switch (side) {
      case "front":
        x = offsetAlong;
        z = 0;
        break;
      case "back":
        x = offsetAlong;
        z = room.depth - 1;
        break;
      case "left":
        x = 0;
        z = offsetAlong;
        break;
      case "right":
        x = room.width - 1;
        z = offsetAlong;
        break;
    }

    const point = new Point(position.x + x, position.y + y, position.z + z);
    buffer.putOffset(point, orientation, markerMaterial);
  }

  /**
   * Renders connections between rooms
   */
  private renderConnections(config: HouseConfig, buffer: BlockBuffer): void {
    if (!config.connections) return;

    config.connections.forEach(connection => {
      const room1 = config.rooms[connection.fromRoomIndex];
      const room2 = config.rooms[connection.toRoomIndex];

      if (room1 && room2) {
        this.renderConnectionLine(room1, room2, buffer);
      }
    });
  }

  /**
   * Renders a connection line between two rooms
   */
  private renderConnectionLine(room1: RoomConfig, room2: RoomConfig, buffer: BlockBuffer): void {
    const center1 = this.getRoomCenter(room1);
    const center2 = this.getRoomCenter(room2);

    const orientation = new Orientation(new Point(0, 0, 0), 0);
    this.drawLine(
      buffer,
      orientation,
      center1.x, center1.y, center1.z,
      center2.x, center2.y, center2.z,
      BlockType.GoldBlock
    );
  }

  /**
   * Gets the center point of a room
   */
  private getRoomCenter(room: RoomConfig): Position {
    return {
      x: room.position.x + Math.floor(room.width / 2),
      y: room.position.y + Math.floor(room.height / 2),
      z: room.position.z + Math.floor(room.depth / 2)
    };
  }

  /**
   * Generates an isometric ASCII representation (for console output)
   */
  generateASCIIVisualization(config: HouseConfig): string {
    const lines: string[] = [];
    lines.push(`╔═══════════════════════════════════════╗`);
    lines.push(`║  House: ${config.name.padEnd(29)}║`);
    lines.push(`╠═══════════════════════════════════════╣`);

    config.rooms.forEach((room, index) => {
      const name = room.name || `Room ${index + 1}`;
      const dims = `${room.width}x${room.depth}x${room.height}`;
      const pos = `(${room.position.x}, ${room.position.y}, ${room.position.z})`;

      lines.push(`║ ${(index + 1).toString().padStart(2)}. ${name.padEnd(32)}║`);
      lines.push(`║     Size: ${dims.padEnd(28)}║`);
      lines.push(`║     Position: ${pos.padEnd(23)}║`);

      if (room.doors && room.doors.length > 0) {
        lines.push(`║     Doors: ${room.doors.length.toString().padEnd(27)}║`);
      }
      if (room.windows && room.windows.length > 0) {
        lines.push(`║     Windows: ${room.windows.length.toString().padEnd(25)}║`);
      }
      if (room.objects && room.objects.length > 0) {
        lines.push(`║     Objects: ${room.objects.length.toString().padEnd(25)}║`);
      }

      if (index < config.rooms.length - 1) {
        lines.push(`╟───────────────────────────────────────╢`);
      }
    });

    if (config.connections && config.connections.length > 0) {
      lines.push(`╠═══════════════════════════════════════╣`);
      lines.push(`║  Room Connections: ${config.connections.length.toString().padEnd(18)}║`);
      config.connections.forEach((conn, index) => {
        const desc = `  ${index + 1}. Room ${conn.fromRoomIndex + 1} ↔ Room ${conn.toRoomIndex + 1}`;
        lines.push(`║${desc.padEnd(39)}║`);
      });
    }

    lines.push(`╚═══════════════════════════════════════╝`);
    return lines.join('\n');
  }

  /**
   * Calculates bounding box for entire house
   */
  calculateBoundingBox(config: HouseConfig): {
    min: Position;
    max: Position;
    dimensions: { width: number; height: number; depth: number };
  } {
    if (config.rooms.length === 0) {
      return {
        min: { x: 0, y: 0, z: 0 },
        max: { x: 0, y: 0, z: 0 },
        dimensions: { width: 0, height: 0, depth: 0 }
      };
    }

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    config.rooms.forEach(room => {
      const { position, width, depth, height } = room;
      minX = Math.min(minX, position.x);
      minY = Math.min(minY, position.y);
      minZ = Math.min(minZ, position.z);
      maxX = Math.max(maxX, position.x + width);
      maxY = Math.max(maxY, position.y + height);
      maxZ = Math.max(maxZ, position.z + depth);
    });

    return {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
      dimensions: {
        width: maxX - minX,
        height: maxY - minY,
        depth: maxZ - minZ
      }
    };
  }
}

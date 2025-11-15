import { Prefab } from "./Prefab";
import { BlockType } from "../types/Blocks";
import { Orientation, Point } from "../geometry/Point";
import { PutFunc } from "./PutFunc";
import { PrefabFactory, defaultPrefabFactory } from "./PrefabFactory";

export type RoofStyle = "flat" | "gabled" | "hipped" | "pyramidal";

/**
 * Represents a roof structure in the building system
 * Supports different roof styles: flat, gabled, hipped, pyramidal
 */
export class Roof extends Prefab {
  /**
   * Creates a new roof prefab
   * @param orientation - The starting orientation of the roof
   * @param material - The block type to use for the roof
   * @param width - The width of the roof in blocks (along rotation axis)
   * @param depth - The depth of the roof in blocks (perpendicular to rotation axis)
   * @param style - The style of the roof (flat, gabled, hipped, pyramidal)
   * @param factory - The factory to use for creating child prefabs
   * @throws {Error} If width or depth is less than 1
   */
  constructor(
    public readonly orientation: Orientation,
    public readonly material: BlockType,
    public readonly width: number,
    public readonly depth: number,
    public readonly style: RoofStyle = "flat",
    factory: PrefabFactory = defaultPrefabFactory
  ) {
    if (width < 1) {
      throw new Error("Roof width must be at least 1 block");
    }
    if (depth < 1) {
      throw new Error("Roof depth must be at least 1 block");
    }
    super(orientation, factory);
  }

  /**
   * Draws the roof based on the selected style
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void {
    switch (this.style) {
      case "flat":
        this.drawFlat(put);
        break;
      case "gabled":
        this.drawGabled(put);
        break;
      case "hipped":
        this.drawHipped(put);
        break;
      case "pyramidal":
        this.drawPyramidal(put);
        break;
      default:
        throw new Error(`Unknown roof style: ${this.style}`);
    }
  }

  /**
   * Draws a flat roof
   */
  private drawFlat(put: PutFunc): void {
    for (let w = 0; w < this.width; w++) {
      for (let d = 0; d < this.depth; d++) {
        const blockPoint = this.getRoofPoint(w, d, 0);
        put(this.orientation, blockPoint, this.material);
      }
    }
  }

  /**
   * Draws a gabled roof (triangular cross-section along the depth axis)
   */
  private drawGabled(put: PutFunc): void {
    const halfDepth = Math.floor(this.depth / 2);
    const peakHeight = halfDepth;

    for (let w = 0; w < this.width; w++) {
      for (let d = 0; d < this.depth; d++) {
        // Calculate the height based on distance from the center
        const distanceFromCenter = Math.abs(d - halfDepth);
        const height = peakHeight - distanceFromCenter;

        if (height >= 0) {
          const blockPoint = this.getRoofPoint(w, d, height);
          put(this.orientation, blockPoint, this.material);
        }
      }
    }
  }

  /**
   * Draws a hipped roof (pyramid-like with sloped sides all around)
   */
  private drawHipped(put: PutFunc): void {
    const maxHeight = Math.min(Math.floor(this.width / 2), Math.floor(this.depth / 2));

    for (let y = 0; y <= maxHeight; y++) {
      const inset = y;
      const startW = inset;
      const endW = this.width - inset - 1;
      const startD = inset;
      const endD = this.depth - inset - 1;

      if (startW > endW || startD > endD) break;

      for (let w = startW; w <= endW; w++) {
        for (let d = startD; d <= endD; d++) {
          const blockPoint = this.getRoofPoint(w, d, y);
          put(this.orientation, blockPoint, this.material);
        }
      }
    }
  }

  /**
   * Draws a pyramidal roof (perfect pyramid shape)
   */
  private drawPyramidal(put: PutFunc): void {
    const maxDimension = Math.max(this.width, this.depth);
    const maxHeight = Math.floor(maxDimension / 2);

    for (let y = 0; y <= maxHeight; y++) {
      const inset = y;

      for (let w = 0; w < this.width; w++) {
        for (let d = 0; d < this.depth; d++) {
          // Calculate distance from edge for this position
          const distW = Math.min(w, this.width - 1 - w);
          const distD = Math.min(d, this.depth - 1 - d);
          const minDist = Math.min(distW, distD);

          if (minDist >= inset) {
            const blockPoint = this.getRoofPoint(w, d, y);
            put(this.orientation, blockPoint, this.material);
          }
        }
      }
    }
  }

  /**
   * Gets the orientation for child prefabs at the end of the roof
   * @returns The orientation at the top-center of the roof
   */
  getOrientationForChildPrefab(): Orientation {
    const centerW = Math.floor(this.width / 2);
    const centerD = Math.floor(this.depth / 2);
    const height = this.getMaxHeight();

    const endPoint = this.getRoofPoint(centerW, centerD, height);
    return new Orientation(this.localToWorld(endPoint), this.orientation.rotation);
  }

  /**
   * Gets the maximum height of the roof based on style
   */
  private getMaxHeight(): number {
    switch (this.style) {
      case "flat":
        return 0;
      case "gabled":
        return Math.floor(this.depth / 2);
      case "hipped":
      case "pyramidal":
        return Math.min(Math.floor(this.width / 2), Math.floor(this.depth / 2));
      default:
        return 0;
    }
  }

  /**
   * Calculates a point on the roof based on width, depth, and height
   * @param widthIndex - The index along the width axis
   * @param depthIndex - The index along the depth axis
   * @param heightOffset - The height offset above the base
   * @returns A new Point with the calculated position
   */
  private getRoofPoint(widthIndex: number, depthIndex: number, heightOffset: number): Point {
    switch (this.orientation.rotation) {
      case 0: // Width along +X, depth along +Z
        return new Point(widthIndex, heightOffset, depthIndex);
      case 90: // Width along +Z, depth along -X
        return new Point(-depthIndex, heightOffset, widthIndex);
      case 180: // Width along -X, depth along -Z
        return new Point(-widthIndex, heightOffset, -depthIndex);
      case 270: // Width along -Z, depth along +X
        return new Point(depthIndex, heightOffset, -widthIndex);
      default:
        throw new Error(`Invalid rotation: ${this.orientation.rotation}`);
    }
  }
}

// MaterialSelector.ts

import { Block, BlockType } from "./Types/Blocks";
import { IPoint } from "./Types/Position";

// Array of glass block types for colorful selection.
const funkyGlassBlockTypes: BlockType[] = [
  BlockType.RedStainedGlass,
  BlockType.OrangeStainedGlass,
  BlockType.YellowStainedGlass,
  BlockType.LimeStainedGlass,
  BlockType.GreenStainedGlass,
  BlockType.CyanStainedGlass,
  BlockType.LightBlueStainedGlass,
  BlockType.BlueStainedGlass,
  BlockType.PurpleStainedGlass,
  BlockType.MagentaStainedGlass,
  BlockType.PinkStainedGlass,
  BlockType.WhiteStainedGlass,
];

// Class to select colored glass blocks based on different formulas
class ColorBlockSelector {

  /**
   * Selects a block color based on the index calculated from various formulas.
   * @param index - Index to select the color.
   * @returns A new Block instance with the selected color.
   */
  static selectBlockByIndex(index: number): Block {
    const colorIndex = index % funkyGlassBlockTypes.length;
    return new Block(funkyGlassBlockTypes[colorIndex]);
  }

  /**
   * Calculates an index using a sum of position coordinates and additional index.
   * @param position - Position with x, y, z coordinates.
   * @param index - Additional index for dynamic effects.
   * @returns A Block instance representing a glass color.
   */
  static selectByGradient(position: IPoint, index: number): Block {
    return this.selectBlockByIndex(position.x + position.y + position.z + index);
  }

  /**
   * Calculates an index using a sine wave pattern from position coordinates.
   * @param position - Position with x, y, z coordinates.
   * @param index - Additional index for dynamic effects.
   * @returns A Block instance representing a glass color.
   */
  static selectByWave(position: IPoint, index: number): Block {
    return this.selectBlockByIndex(Math.floor((Math.sin((position.x + position.y + position.z + index) * 0.1) + 1) * 5));
  }

  /**
   * Calculates an index based on the radial distance from the origin.
   * @param position - Position with x, y, z coordinates.
   * @param index - Additional index for dynamic effects.
   * @returns A Block instance representing a glass color.
   */
  static selectByRadialDistance(position: IPoint, index: number): Block {
    const distance = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);
    return this.selectBlockByIndex(Math.floor(distance + index));
  }

  /**
   * Adds a random sparkle effect to the index calculation for a glittery selection.
   * @param position - Position with x, y, z coordinates.
   * @param index - Additional index for dynamic effects.
   * @returns An index modified by a random factor for an occasional sparkle.
   */
  static selectWithSparkle(position: IPoint, index: number): number {
    const baseIndex = position.x + position.y + position.z + index;
    return Math.random() > 0.9 ? baseIndex + Math.floor(Math.random() * 3) : baseIndex;
  }
}

export { IPoint, ColorBlockSelector };

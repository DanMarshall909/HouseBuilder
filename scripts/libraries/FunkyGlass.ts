// MaterialSelector.ts

import { Block, BlockType } from "./Types/Blocks";
import Point from "./Types/Position";

// List of glass block types for colorful selection.
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

/**
 * Retrieves a colored glass block based on a provided index.
 * @param index - The index to determine the color.
 * @returns A new Block instance with the selected color.
 */
export function getIndexedBlock(index: number): Block {
  const colorIndex = index % funkyGlassBlockTypes.length;
  return new Block(funkyGlassBlockTypes[colorIndex]);
}

/**
 * Selects a block color based on the sum of position coordinates and an index.
 * @param position - Position object with x, y, z coordinates.
 * @param index - Modifier index for dynamic selection.
 * @returns A Block instance representing a glass color.
 */
export function gradientFormula(position: Point, index: number): Block {
  return getIndexedBlock(position.x + position.y + position.z + index);
}

/**
 * Selects a block color using a sine wave pattern from position and index.
 * @param position - Position object with x, y, z coordinates.
 * @param index - Modifier index for dynamic selection.
 * @returns A Block instance representing a glass color.
 */
export function waveFormula(position: Point, index: number): Block {
  return getIndexedBlock(Math.floor((Math.sin((position.x + position.y + position.z + index) * 0.1) + 1) * 5));
}

/**
 * Determines a block color based on radial distance from origin combined with an index.
 * @param position - Position object with x, y, z coordinates.
 * @param index - Modifier index for dynamic selection.
 * @returns A Block instance representing a glass color.
 */
export function radialFormula(position: Point, index: number): Block {
  const distance = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);
  return getIndexedBlock(Math.floor(distance + index));
}

/**
 * Randomly enhances the color index based on position and index to create a sparkle effect.
 * @param position - Position object with x, y, z coordinates.
 * @param index - Modifier index for dynamic selection.
 * @returns An index potentially modified by a random factor for sparkle.
 */
export function sparkleFormula(position: Point, index: number): number {
  const baseIndex = position.x + position.y + position.z + index;
  return Math.random() > 0.9 ? baseIndex + Math.floor(Math.random() * 3) : baseIndex;
}

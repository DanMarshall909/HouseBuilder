// MaterialSelector.ts

import { Blocks } from "./Types/Blocks";
import Point from "./Types/Position";

/**
 * Selects a colored glass block based on the given formula.
 * @param position - The position used for calculating the material.
 * @param index - An index to add a changing effect over time.
 * @param formula - A function that takes position and index and returns an index for the color array.
 * @returns A `Blocks` key representing a glass color.
 */
export function getMaterial(
  position: Point,
  index: number,
  formula: (position: Point, index: number) => number
): keyof typeof Blocks {
  const materials: (keyof typeof Blocks)[] = [
    "RedStainedGlass",
    "OrangeStainedGlass",
    "YellowStainedGlass",
    "LimeStainedGlass",
    "GreenStainedGlass",
    "CyanStainedGlass",
    "LightBlueStainedGlass",
    "BlueStainedGlass",
    "PurpleStainedGlass",
    "MagentaStainedGlass",
    "PinkStainedGlass",
    "WhiteStainedGlass",
  ];

  // Use the provided formula to calculate the material index
  const colorIndex = Math.abs(formula(position, index) % materials.length);
  return materials[colorIndex];
}

/**
 * Gradient Formula: Generates a color index based on the sum of position coordinates.
 * @param position - The position used for calculating the index.
 * @param index - An index to add a changing effect over time.
 * @returns A calculated index for color selection.
 */
export function gradientFormula(position: Point, index: number): number {
  return position.x + position.y + position.z + index;
}

/**
 * Wave Formula: Generates a color index based on a sine wave pattern.
 * @param position - The position used for calculating the index.
 * @param index - An index to add a changing effect over time.
 * @returns A calculated index for color selection.
 */
export function waveFormula(position: Point, index: number): number {
  return Math.floor((Math.sin((position.x + position.y + position.z + index) * 0.1) + 1) * 5);
}

/**
 * Radial Formula: Generates a color index based on the radial distance from the origin.
 * @param position - The position used for calculating the index.
 * @param index - An index to add a changing effect over time.
 * @returns A calculated index for color selection.
 */
export function radialFormula(position: Point, index: number): number {
  const distance = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
  return Math.floor(distance + index);
}

/**
 * Sparkle Formula: Generates a color index with a random sparkle effect.
 * @param position - The position used for calculating the index.
 * @param index - An index to add a changing effect over time.
 * @returns A calculated index for color selection, occasionally adding randomness.
 */
export function sparkleFormula(position: Point, index: number): number {
  const baseIndex = position.x + position.y + position.z + index;
  return Math.random() > 0.9 ? baseIndex + Math.floor(Math.random() * 3) : baseIndex;
}

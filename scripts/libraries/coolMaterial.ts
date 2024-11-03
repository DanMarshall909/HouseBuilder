import { Blocks } from "./Types/Blocks";
import Point from "./Types/Position";

/**
 * Picks a beautiful colored glass block based on the given coordinates.
 * @param position - The position to use for selecting the material.
 * @returns A `Blocks` key representing a glass color.
 */
export default function getMaterial(position: Point, tick: number): keyof typeof Blocks {
  const materials: (keyof typeof Blocks)[] = [
    "BlackStainedGlass",
    "BlueStainedGlass",
    "BrownStainedGlass",
    "CyanStainedGlass",
    "GrayStainedGlass",
    "GreenStainedGlass",
    "LightBlueStainedGlass",
    "LightGrayStainedGlass",
    "LimeStainedGlass",
    "MagentaStainedGlass",
    "OrangeStainedGlass",
    "PinkStainedGlass",
    "PurpleStainedGlass",
    "RedStainedGlass",
    "WhiteStainedGlass",
    "YellowStainedGlass",
  ];

  // Calculate the index based on the position
  const index = Math.abs((position.x + position.y + position.z + tick) % materials.length);
  return materials[index];
}

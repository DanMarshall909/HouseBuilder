import { Orientation } from "../geometry/Point";
import { PutFunc } from "./PutFunc";

/**
 * Represents a prefabricated structure or component in the building system.
 * All prefabs have an orientation and can be drawn or built in the world.
 */
export interface IPrefab {
  /** The orientation of the prefab in the world */
  readonly orientation: Orientation;

  /**
   * Draws the prefab at its current position
   * @param put - Function to place blocks in the world
   */
  draw(put: PutFunc): void;

  /**
   * Builds the prefab and all its children at the specified orientation
   * @param at - The orientation to build at
   * @param put - Function to place blocks in the world
   */
  build(at: Orientation, put: PutFunc): void;
}

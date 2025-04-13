import { Vector } from "../geometry/Point";
import { PutFunc } from "./PutFunc";

export interface IPrefab {
  readonly orientation: Vector;
  draw(put: PutFunc): void;
  build(at: Vector, put: PutFunc): void;
}

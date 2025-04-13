import { Orientation } from "../geometry/Point";
import { PutFunc } from "./PutFunc";

export interface IPrefab {
  readonly orientation: Orientation;
  draw(put: PutFunc): void;
  build(at: Orientation, put: PutFunc): void;
}

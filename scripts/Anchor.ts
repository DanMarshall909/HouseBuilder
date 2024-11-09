import { Prefab } from "./Prefab";

export class Anchor extends Prefab {
  protected children: Prefab[] = [];
  draw(): void {
    throw new Error("Method not implemented.");
  }
  render() {}
}

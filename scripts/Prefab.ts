export abstract class Prefab {
  protected children: Prefab[] = [];
  abstract draw(): void;

  render() {
    this.draw();
    for (const child of this.children) {
      child.render();
    }
  }
}

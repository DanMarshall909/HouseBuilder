import { Point } from "../geometry/Point";
import { Block } from "../types/Block";
import { IBlockIO } from "../io/IBlockIO";
import { getBlockId } from "./MinecraftBlockRegistry";
import fs from "fs";

export class McFunctionIO implements IBlockIO {
  private commands: string[] = [];

  put(position: Point, block: Block): void {
    const id = getBlockId(block);
    const mcId = id ? `minecraft:${id}` : block.block;
    this.commands.push(`setblock ${position.x} ${position.y} ${position.z} ${mcId}`);
  }

  get(position: Point): Block | undefined {
    // Not needed for export
    return undefined;
  }

  save(filePath: string): void {
    fs.writeFileSync(filePath, this.commands.join("\n"));
  }
}

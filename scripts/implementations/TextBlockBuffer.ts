import {IBlockIO} from "../IBlockIO";
import {Point} from "../geometry/Point";
import {Block} from "../types/Blocks";

export class TextBlockIO implements IBlockIO {
    private _text: string = "";

    put(position: Point, blockType: Block): void {
        this._text += `${blockType.block}:${position.asText()}\n`;
    }

    get(position: Point): Block | undefined {
        throw new Error("Method not implemented.");
    }

    clear() {
        this._text = "";
    }

    asText() {
        return this._text.trimEnd();
    }
}
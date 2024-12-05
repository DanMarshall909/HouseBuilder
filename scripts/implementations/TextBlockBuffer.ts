import {Point} from "../geometry/Point";
import {Block} from "../types/Block";
import {IBlockIO} from "../io/IBlockIO";

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
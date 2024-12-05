// MaterialSelector.ts

import {BlockType} from "../types/Blocks";
import {IPoint} from "../geometry/Point";
import {Block} from "../types/Block";

// Array of glass block types for colorful selection.
const funkyGlassBlockTypes: BlockType[] = [
    BlockType.RedStainedGlass,
    BlockType.OrangeStainedGlass,
    BlockType.YellowStainedGlass,
    BlockType.LimeStainedGlass,
    BlockType.GreenStainedGlass,
    BlockType.CyanStainedGlass,
    BlockType.LightBlueStainedGlass,
    BlockType.BlueStainedGlass,
    BlockType.PurpleStainedGlass,
    BlockType.MagentaStainedGlass,
    BlockType.PinkStainedGlass,
    BlockType.WhiteStainedGlass,
];

enum SelectorName {
    Gradient = "Gradient",
    Wave = "Wave",
    RadialDistance = "RadialDistance",
    Sparkle = "Sparkle",
}

// Defines a function signature for block selectors
interface IBlockSelector {
    (position: IPoint, index: number): Block;
}

class DynamicBlock {
    // Define static methods or helper functions to simplify selectors
    private static calculateIndex(position: IPoint, index: number, factor: number = 1): number {
        return (position.x + position.y + position.z + index) % factor;
    }

    public static byIndex(index: number): Block {
        const colorIndex = index % funkyGlassBlockTypes.length;
        return new Block(funkyGlassBlockTypes[colorIndex]);
    }

    static funkyGlassSelectors: Record<SelectorName, IBlockSelector> = {
        [SelectorName.Gradient]: (position, index) => {
            return this.byIndex(this.calculateIndex(position, index, funkyGlassBlockTypes.length));
        },
        [SelectorName.Wave]: (position, index) => {
            return this.byIndex(this.calculateIndex(position, index, funkyGlassBlockTypes.length));
        },
        [SelectorName.RadialDistance]: (position, index) => {
            const distance = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);
            return this.byIndex(Math.floor(distance + index));
        },
        [SelectorName.Sparkle]: (position, index) => {
            const baseIndex = this.calculateIndex(position, index);
            const randomFactor = Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0;
            return this.byIndex(baseIndex + randomFactor);
        },
    };
}

export {DynamicBlock, SelectorName, IBlockSelector};

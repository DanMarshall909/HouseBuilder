import { Vector3 } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

//
// const house = new House({ x: 0, y: -60, z: 0 }, Direction.North, 10, 10);
//
// var blocks = house.build()
// picks an beautiful coloured glass block based off the coordinates
export default function getMaterial(position: Vector3): keyof typeof MinecraftBlockTypes {
	let materials: (keyof typeof MinecraftBlockTypes)[] = [
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
		"YellowStainedGlass"
	];

	return materials[Math.floor((position.x + position.y + position.z) / 3) % materials.length];
}

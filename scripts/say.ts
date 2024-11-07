import { world } from "@minecraft/server";

export function say(message: string) {
  world.sendMessage(message);
}

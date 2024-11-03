import { world, Vector3, BlockPermutation, system } from "@minecraft/server";


function mainTick() {
  if (system.currentTick % 100 === 0) {
    say("Hello starter! Tick: " + system.currentTick);

		// Get current player position
		const player = world.getPlayers()[0];
		const playerPosition = player.getHeadLocation();
		put(playerPosition, "Stone");
  }

  system.run(mainTick);
}

system.run(mainTick);
function say(arg0: string) {
	throw new Error("Function not implemented.");
}

function put(playerPosition: Vector3, arg1: string) {
	throw new Error("Function not implemented.");
}


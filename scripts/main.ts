import { world, system } from "@minecraft/server";
import { Room } from "./Game/room";
import { displayTitle, sendDebugLog, sendInfoLog, getRandomSurface } from "./Game/world";

import { Field } from "./Game/Field/field";

// const battleFieldVertices: [number, number][] = [[113, 77], [65, 77], [65, 97], [-50, 97], [-50, 27], [-38, 27], [-38, -37], [113, -37] ];
// const field = new Field(90, -30, -60, battleFieldVertices);
// let placedBlockLocations: [number, number, number][] = [];

const overworld = world.getDimension("overworld");
const room = new Room();
room.start();

system.runInterval(() => { room.update(); });
//MARK: On player join
world.afterEvents.playerJoin.subscribe((event) => {
  sendInfoLog(`Player ${event.playerName} joined`);
  room.onPlayerJoin(event.playerName);
});
//MARK: On player leave
world.afterEvents.playerLeave.subscribe((event) => {
  sendInfoLog(`Player ${event.playerName} left`);
});
//MARK: On player spawn
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  sendInfoLog(`Player ${player.name} spawned`);
});


world.afterEvents.chatSend.subscribe((event) => {
  const message = event.message;
  const messages = message.split(" ");
  const command = messages[0];
  const arguements = messages.slice(1);

  sendInfoLog(`Received command: ${command} ${arguements.join(" ")}`);
  switch (command) {
    case "!test":
      break;
    case "!run":
      // for (let i = 0; i < 100; i++) {
      //   const loc = field.getRandomLocation();
      //   const y = getRandomSurface(loc.x, loc.z, field.maxY, field.minY);
      //   if (!y) continue;
      //   overworld.runCommand(`setblock ${loc.x} ${y} ${loc.z} minecraft:blue_wool`);
      //   placedBlockLocations.push([loc.x, y, loc.z]);
      // }
      break;
    case "!clean":
      // placedBlockLocations.forEach((loc) => {
      //   overworld.runCommand(`setblock ${loc[0]} ${loc[1]} ${loc[2]} minecraft:air`);
      // });
      break;
    case "!i":
    case "!init":
      break;
    case "!s":
    case "!start":
      if (arguements[0] === "room") {
        room.start();
      } else {
        room.startGame();
      }
      break;
    case "!e":
    case "!end":
      if (arguements[0] === "room") {
        room.end();
      } else {
        room.endGame();
      }
      break;
    default:
      break;
  }
});
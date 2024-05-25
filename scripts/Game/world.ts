import { world } from "@minecraft/server";

const overWorld = world.getDimension("overworld");
const noPlacementBlockIds = [
  "minecraft:air",
  "minecraft:grass_path",
  "minecraft:cobbled_deepslate",
  "minecraft:cobbled_deepslate_stairs",
  "minecraft:cobbled_deepslate_slab",
  "minecraft:deepslate_bricks",
  "minecraft:deepslate_brick_stairs",
  "minecraft:deepslate_brick_slab",
  "minecraft:deepslate_tiles",
  "minecraft:deepslate_tile_stairs",
  "minecraft:deepslate_tile_slab",
];

function sendLog(level: string) {
  return function (color: string) {
    return function (message: string) {
      overWorld.runCommand(`tellraw @a[tag=op] {"rawtext":[{"text": "§o> §7[${color}${level}§7] ${message}"}]}`);
    }
  }
}
function playSound(soundId: string) {
  return function (target: string) {
    overWorld.runCommand(`playsound ${soundId} ${target}`);
  }
}

export const sendDebugLog = sendLog("DEBUG")("§6");
export const sendInfoLog = sendLog("INFO")("§a");
export const sendWarnLog = sendLog("WARN")("§g");
export const sendErrorLog = sendLog("ERROR")("§4");

export const playTimerSound = playSound("random.orb");

export function displayTitle(target: string) {
  return function (title: string) {
    overWorld.runCommand(`title ${target} title §l${title}`);
  }
}

export function getRandomSurface(x: number, z: number, maxY: number, minY: number): number | null {
  let y = maxY;
  const surfaces = [];
  while (minY <= y--) {
    if (!overWorld.getBlock({x: x, y: y, z: z})?.isAir) continue;
    const lowerBlock = overWorld.getBlock({x: x, y: y - 1, z: z});
    const lowerBlockId = lowerBlock?.permutation.type.id;
    if (!lowerBlockId) continue;
    if (noPlacementBlockIds.includes(lowerBlockId)) continue;
    surfaces.push(y);
  }
  if (surfaces.length === 0) return null;
  return surfaces[Math.floor(Math.random() * surfaces.length)];
}

export function getPlayer(name: string) {
  const player = world.getPlayers().find((player) => player.name === name);
  if (!player) {
    sendErrorLog(`Player not found: ${name}`)
    return null;
  }
  return player;
}

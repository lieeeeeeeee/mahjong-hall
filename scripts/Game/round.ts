import { world, system, Player, Block, Entity } from "@minecraft/server";
import { Field } from "./Field/field";
import { getRandomSurface } from "./world";

export class Round {
  private readonly overWorld = world.getDimension("overworld");

  private isTest: boolean = false;
  private _number: number;
  private _isStarted: boolean = false;
  private field: Field;

  public placedBlockLocations: [number, number, number][] = [];

  constructor(number: number, field: Field) {
    this._number = number;
    this.field = field;
  }

  get number(): number {
    return this._number;
  }

  public test(): void {
    const trialNum = 100;
    this.isTest = true;

    for (let i = 0; i < trialNum; i++) {
      const loc = this.field.getRandomLocation();
      const y = (loc.y) ? loc.y : getRandomSurface(loc.x, loc.z, this.field.maxY, this.field.minY);
      if (!y) continue;
      this.overWorld.runCommand(`setblock ${loc.x} ${y} ${loc.z} minecraft:blue_wool`);
      this.placedBlockLocations.push([loc.x, y, loc.z]);
    }
  }
  public init(): void {
  }
  public start(): void {
    this._isStarted = true;
  }

  public end(): void {
    this._isStarted = false;
  }

  public update(): void {
    if (!this._isStarted) return;
  }
}

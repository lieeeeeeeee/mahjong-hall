import { Field } from "./Field/field";
import { Round } from "./round";


enum RunningState { 
  PREPARETED = -1,
  STARTED = 1,
  ENDED = 0
}

export class Game {
  private readonly maxY: number = -30;
  private readonly minY: number = -60;
  private readonly roundNumber: number = 1
  private readonly battleFieldVertices: [number, number][] = [[113, 77], [65, 77], [65, 97], [-50, 97], [-50, 27], [-38, 27], [-38, -37], [113, -37]];
  private readonly homeReferenceLocation: [number, number, number] = [-40, -42, 386];

  private battleField: Field | undefined;
  // private home: Field;
  private rounds: Round[] = [];

  private safeAreaRadius: number = 15;
  private runTime: number = 0;
  private _runningState: RunningState = RunningState.PREPARETED;

  
  public get runningState(): number {
    return this._runningState;
  }

  public constructor() {
    // const homeLoc = this.homeReferenceLocation
    // this.home = new Field(0, 0, 0, undefined, { x: homeLoc[0], y: homeLoc[1], z: homeLoc[2] });
  }

  public init(): void {
  }
  public start(): void {
    this._runningState = RunningState.STARTED;
    // this.battleField = new Field(this.safeAreaRadius, this.maxY, this.minY, this.battleFieldVertices);
  }
  public end(): void {
    this._runningState = RunningState.ENDED;
  }
  public update(): void {
    if (this._runningState !== RunningState.STARTED) return;
    if (this.runTime % 20 === 0) {
      // this.battleField.update();
    }
    this.runTime++;
  }
}

import { world , Player } from "@minecraft/server";
import { displayTitle, sendDebugLog, sendWarnLog, playTimerSound, getPlayer } from "./world";
import { Game } from "./game";
import { Timer } from "./timer";


type WaitingPlayer = { name: string, trialCount: number };

export class Room {
  private readonly second: number = 20;
  
  public games: Game[] = [];
  
  private waitingList: WaitingPlayer[] = [];
  private participantsList: string[] = [];
  private isRunning: boolean = false;
  private preStartTimer: Timer = new Timer(5 * this.second);
  private runningTime: number = 0;
  private currentGame: Game | undefined;

  public init(): void {
    this.isRunning = false;
    this.preStartTimer.set();
    this.runningTime = 0;
    this.currentGame = undefined;
  }
  public start(): void {
    if (this.isRunning) return;
    this.init();
    this.isRunning = true;
  }
  public end(): void {
    if (!this.isRunning) return;
    sendDebugLog(`Game end!`);
    this.isRunning = false;
  }

  public update(): void {
    if (!this.isRunning) return;
    if (this.currentGame) {
      switch (this.currentGame.runningState) {
        // game is prepared
        case -1:
          this.checkTimer();
          break;
        // game is started
        case 1:
          this.currentGame.update();
          break;
        // game is ended
        case 0:
          this.end();
          this.currentGame = undefined;
          break;
      }
    }
    // per second
    if (this.runningTime % 20 === 0) {
      this.checkWaitList();
    }
    this.runningTime++;
  }

  // Event handlers
  public onPlayerJoin(playerName: string): void {
    const waitingPlayer: WaitingPlayer = { name: playerName, trialCount: 0 };
    this.waitingList.push(waitingPlayer);
  }

  public startGame(): void {
    sendDebugLog(`Game start!`);
    if (this.currentGame) return;
    const game = new Game();
    this.preStartTimer.set();
    this.currentGame = game;
  }
  public endGame(): void {
    sendDebugLog(`Game end!`);
    if (!this.currentGame) return;
    if (this.currentGame.runningState === 0) return;
    this.currentGame.end();
    this.games.push(this.currentGame);
  }

  private checkTimer(): void {
    if (this.preStartTimer.isOver) { this.currentGame!.start(); return; }
    if (this.preStartTimer.count % this.second === 0) {
      const seconds =  this.preStartTimer.count / this.second;
      displayTitle(`@a`)(`§6${seconds}`);
      playTimerSound(`@a`);
    }
    this.preStartTimer.update();
  }
  private checkWaitList(): void {
    if (this.waitingList.length === 0) return;
    const waitingList = this.waitingList;
    for (let i = 0; i < waitingList.length; i++) {
      waitingList[i].trialCount++;
      if (20 < waitingList[i].trialCount) { 
        this.waitingList.splice(i, 1);
        continue;
      }
      const player = getPlayer(waitingList[i].name);
      if (!player) continue;
      this.onPlayerJoin(waitingList[i].name);
      this.waitingList.splice(i, 1);
    }
  }
}
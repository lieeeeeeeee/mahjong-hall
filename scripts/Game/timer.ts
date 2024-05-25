export class Timer {
  public init: number;
  public count: number;

  public get isOver(): boolean {
    return this.count === 0;
  }

  public constructor(init: number) {
    this.init = init;
    this.count = init;
  }

  public set(): void {
    this.count = this.init;
  }

  public update(): void {
    if (this.count > 0) this.count--;
  }
}
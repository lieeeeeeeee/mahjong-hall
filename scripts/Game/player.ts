
export class Player {
  private readonly _name: string;
  private _isPerticipat: boolean = false;
  private _isObserver: boolean = false;
  private _isRunner: boolean = false;
  private _isOgre: boolean = false;


  public constructor(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }
  public get isPerticipat(): boolean {
    return this._isPerticipat;
  }
  public set isPerticipat(value: boolean) {
    this._isPerticipat = value;
    this._isObserver = !value;
  }
  public get isObserver(): boolean {
    return this._isObserver;
  }
  public set isObserver(value: boolean) {
    this._isObserver = value;
    this._isPerticipat = !value;
  }
  public get isRunner(): boolean {
    return this._isRunner;
  }
  public set isRunner(value: boolean) {
    this._isRunner = value;
    this._isOgre = !value;
  }
  public get isOgre(): boolean {
    return this._isOgre;
  }
  public set isOgre(value: boolean) {
    this._isOgre = value;
    this._isRunner = !value;
  }
}
import { Polygon } from './Models/polygon';
import { sortVertices, getRandomTriangle, getRandomPointInTriangle, calculateEffectiveArea, Point, createRegularPolygon } from './Utils/geometry';

type Location = { x: number, y: number | null, z: number };

export class Field {
  private _polygon: Polygon | undefined;
  private _effectiveArea: Polygon | undefined;
  private _center: Point | undefined;
  private _referenceLocation: Location | undefined;
  // private _safeArea: Polygon; <- 必要に応じて追加
  private _safeAreaRadius: number;
  private _maxY: number;
  private _minY: number;

  constructor(safeAreaRadius: number, maxY: number, minY: number, vertices?: [number, number][], referenceLocation?: Location) {
    if (vertices) {
      const v = vertices.map(v => ({ x: v[0], y: v[1] }));
      this._polygon = new Polygon(sortVertices(v));
      this._center = this._polygon.center;
      this._effectiveArea = new Polygon(calculateEffectiveArea(v, this._center, safeAreaRadius));
    }
    // this._safeArea = createRegularPolygon(10, safeAreaRadius, this._center); <- 必要に応じて追加
    this._safeAreaRadius = safeAreaRadius;
    this._referenceLocation = referenceLocation;
    this._maxY = maxY;
    this._minY = minY;
  }
  set center(center: Point) {
    this._center = center;
    this.reloadEffectiveArea();
  }
  set safeAreaRadius(radius: number) {
    // this._safeArea = createRegularPolygon(10, radius, this._center); <- 必要に応じて追加
    this._safeAreaRadius = radius;
    this.reloadEffectiveArea();
  }
  // 必要に応じて追加
  // get safeArea(): Polygon { 
  //   return this._safeArea;
  // }

  get maxY(): number {
    return this._maxY;
  }
  get minY(): number {
    return this._minY;
  }

  private reloadEffectiveArea(): void {
    if (!this._polygon || !this._center) return;
    this._effectiveArea = new Polygon(calculateEffectiveArea(this._polygon.vertices, this._center, this._safeAreaRadius));
  }
  public reloadProperties(center?: Point, safeAreaRadius?: number): void {
    if (center) this._center = center;
    if (safeAreaRadius) this._safeAreaRadius = safeAreaRadius;
    this.reloadEffectiveArea();
  } 
  public getRandomLocation(): Location {
    if (this._referenceLocation) return this._referenceLocation;
    if (!this._effectiveArea) return { x: 0, y: 0, z: 0 };
    const totalArea = this._effectiveArea.getArea();
    const triangle = getRandomTriangle(this._effectiveArea.triangles, totalArea);
    let randomPoint: Point;
    let randomLoc: Location;

    if (!triangle) return { x: 0, y: 0, z: 0 };
    
    randomPoint = getRandomPointInTriangle(triangle);
    randomLoc = { x: Math.round(randomPoint.x), y: null, z: Math.round(randomPoint.y) };

    return randomLoc;
  }
}
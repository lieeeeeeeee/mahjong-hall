import { Triangle } from './triangle';
import { isConvexVertex, getCenter, Point } from '../Utils/geometry';

export class Polygon {
  private _vertices: Point[];
  private _triangles: Triangle[];
  private _center: Point;

  constructor(vertices: Point[]) {
    this._vertices = vertices;
    this._triangles = this.earClipping();
    this._center = getCenter(vertices);
  }

  get vertices(): Point[] {
    return this._vertices;
  }
  get triangles(): Triangle[] {
    return this._triangles;
  }
  get center(): Point {
    return this._center;
  }

  getArea(): number {
    let area = 0;
    const n = this._vertices.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += this._vertices[i].x * this._vertices[j].y - this._vertices[j].x * this._vertices[i].y;
    }
    return Math.abs(area) / 2;
  }

  private earClipping(): Triangle[] {
    // ポリゴンの頂点座標を配列にコピー
    const polygon = this._vertices.slice();
    const triangles: Triangle[] = [];
 
    // ポリゴンが三角形より小さい場合は空の配列を返す
    if (polygon.length < 3) {
      return triangles;
    }
 
    // ポリゴンが三角形になるまで以下の処理を繰り返す
    while (3 < polygon.length) {

      for (let i = 0; i < polygon.length; i++) {
        const prevIdx = (i - 1 + polygon.length) % polygon.length;
        const nextIdx = (i + 1) % polygon.length;
        const prevPoint = polygon[prevIdx];
        const point = polygon[i];
        const nextPoint = polygon[nextIdx];

        // イアーの条件を満たさない場合はスキップ
        if (!isConvexVertex(prevPoint, point, nextPoint, polygon)) continue;
        const triangleVertices = [prevPoint, point, nextPoint];
        const triangle = new Triangle(triangleVertices);
        triangles.push(triangle);

        // ポリゴンからイアーを削除
        polygon.splice(i, 1);
        break;
      }
    }
 
    // 残りの三角形を追加
    triangles.push(new Triangle(polygon));
 
    return triangles;
  }
}
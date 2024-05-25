import { Triangle } from '../Models/triangle';
import { Polygon } from '../Models/polygon';

export interface Point {
  x: number;
  y: number;
}

function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
  const { x, y } = point;
  const n = polygon.length;
  let { x: p1x, y: p1y } = polygon[0];
  let inside = false;

  for (let i = 0; i <= n; i++) {
    const { x: p2x, y: p2y } = polygon[i % n];

    if (y > Math.min(p1y, p2y) && y <= Math.max(p1y, p2y) && x <= Math.max(p1x, p2x)) {
      if (p1y !== p2y) {
        const xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x;
        if (p1x === p2x || x <= xinters) {
          inside = !inside;
        }
      }
    }

    [p1x, p1y] = [p2x, p2y];
  }

  return inside;
}
export function isPointInsideTriangle(triangle: [Point, Point, Point], point: Point): boolean {
  const [A, B, C] = triangle;
  const P = point;

  const area = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number => {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  };
  const Area1 = area(A.x, A.y, B.x, B.y, C.x, C.y);
  const Area2 = area(P.x, P.y, B.x, B.y, C.x, C.y);
  const Area3 = area(A.x, A.y, P.x, P.y, C.x, C.y);
  const Area4 = area(A.x, A.y, B.x, B.y, P.x, P.y);

  return Area1 === Area2 + Area3 + Area4;
}

function lineSegmentIntersection(p1: Point, p2: Point, q1: Point, q2: Point): Point | null {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: x3, y: y3 } = q1;
  const { x: x4, y: y4 } = q2;

  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (d === 0) {
    return null; // 平行
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;

  if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
    const x = x1 + t * (x2 - x1);
    const y = y1 + t * (y2 - y1);
    return { x, y };
  } else {
    return null; // 交点なし
  }
}
function polygonIntersection(poly1: Point[], poly2: Point[]): Point[] {
  const intersections: Point[] = [];
  for (let i = 0; i < poly1.length; i++) {
    const p1 = poly1[i];
    const p2 = poly1[(i + 1) % poly1.length];
    for (let j = 0; j < poly2.length; j++) {
      const q1 = poly2[j];
      const q2 = poly2[(j + 1) % poly2.length];
      const intersection = lineSegmentIntersection(p1, p2, q1, q2);
      if (intersection) {
        intersections.push(intersection);
      }
    }
  }
  return intersections;
}
export function createRegularPolygon(n: number, radius: number, center: Point): Polygon {
  const vertices: Point[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    vertices.push({ x, y });
  }
  return new Polygon(vertices);
}
export function getCenter(vertices: Point[]): Point {
  const cx = vertices.reduce((sum, { x }) => sum + x, 0) / vertices.length;
  const cy = vertices.reduce((sum, { y }) => sum + y, 0) / vertices.length;
  return { x: cx, y: cy };
}

export function sortVertices(vertices: Point[]): Point[] {
  const center = getCenter(vertices);
  const vertexAngles: [number, Point][] = vertices.map((vertex) => {
    const { x, y } = vertex;
    const dx = x - center.x;
    const dy = y - center.y;
    const angle = Math.atan2(dy, dx);
    return [angle, vertex];
  });
  vertexAngles.sort(([a], [b]) => a - b);
  return vertexAngles.map(([_, vertex]) => vertex);
}
export function calculateEffectiveArea(vertices: Point[], center: Point, safeAreaRadius: number): Point[] {
  const sortedVertices = sortVertices(vertices);
  const decagon = createRegularPolygon(10, safeAreaRadius, center);

  const intersections = polygonIntersection(sortedVertices, decagon.vertices);
  const insidePolygonVerticesDict: { [key: string]: Point[] } = {};
  const insideDecagonVerticesDict: { [key: string]: Point[] } = {};
  
  let currentInsidePolygonVertices: Point[] = [];
  let currentInsideDecagonVertices: Point[] = [];
  
  let newVertices: Point[] = [];
  let sortedNewVertices: Point[] = [];

  for (const vertex of sortedVertices) {
    if (isPointInsidePolygon(vertex, decagon.vertices)) {
      currentInsidePolygonVertices.push(vertex);
    } else {
      if (currentInsidePolygonVertices.length < 0) continue;
      const centroid = getCenter(currentInsidePolygonVertices);
      const key = `${centroid.x},${centroid.y}`;
      insidePolygonVerticesDict[key] = currentInsidePolygonVertices;
      currentInsidePolygonVertices = [];
    }
  }

  for (const vertex of decagon.vertices) {
    if (isPointInsidePolygon(vertex, sortedVertices)) {
      currentInsideDecagonVertices.push(vertex);
    } else {
      if (currentInsideDecagonVertices.length < 0) continue;
      const centroid = getCenter(currentInsideDecagonVertices);
      const key = `${centroid.x},${centroid.y}`;
      insideDecagonVerticesDict[key] = currentInsideDecagonVertices;
      currentInsideDecagonVertices = [];
    }
  }

  if (0 < currentInsidePolygonVertices.length) {
    const centroid = getCenter(currentInsidePolygonVertices);
    const key = `${centroid.x},${centroid.y}`;
    insidePolygonVerticesDict[key] = currentInsidePolygonVertices;
  }

  if (0 < currentInsideDecagonVertices.length) {
    const centroid = getCenter(currentInsideDecagonVertices);
    const key = `${centroid.x},${centroid.y}`;
    insideDecagonVerticesDict[key] = currentInsideDecagonVertices;
  }

  newVertices = intersections;

  // insidePolygonVerticesDictのkeysをnewVerticesに追加
  for (const key of Object.keys(insidePolygonVerticesDict)) {
    const [x, y] = key.split(',').map(Number);
    newVertices.push({ x, y });
  }

  // insideDecagonVerticesDictのkeysをnewVerticesに追加
  for (const key of Object.keys(insideDecagonVerticesDict)) {
    const [x, y] = key.split(',').map(Number);
    newVertices.push({ x, y });
  }
  
  newVertices = sortVertices(newVertices);

  for (const vertex of newVertices) {
    // insidePolygonVerticesDictの中にvertexが含まれているかを確認
    const key = `${vertex.x},${vertex.y}`;
    if (insidePolygonVerticesDict[key]) {
      sortedNewVertices = sortedNewVertices.concat(insidePolygonVerticesDict[key]);
    } else if (insideDecagonVerticesDict[key]) {
      sortedNewVertices = sortedNewVertices.concat(insideDecagonVerticesDict[key]);
    } else {
      sortedNewVertices.push(vertex);
    }
  }

  sortedNewVertices = sortVertices(sortedNewVertices);
  return sortedNewVertices;
}
export function getRandomTriangle(triangles: Triangle[], totalArea: number): Triangle | null {
  if (triangles.length === 0) {
    return null;
  }
  const randomArea = Math.random() * totalArea;
  let currentArea = 0;
  for (const triangle of triangles) {
    currentArea += triangle.getArea();
    if (currentArea >= randomArea) {
      return triangle;
    }
  }
  return null;
}
export function getRandomPointInTriangle(triangle: Triangle): Point {
  const { x: ax, y: ay } = triangle.vertices[0];
  const { x: bx, y: by } = triangle.vertices[1];
  const { x: cx, y: cy } = triangle.vertices[2];
  const s = Math.random();
  const t = Math.random();
  if (s + t >= 1) {
    const u = 1 - s;
    const v = 1 - t;
    return { x: ax * u + bx * v + cx * (1 - u - v), y: ay * u + by * v + cy * (1 - u - v) };
  } else {
    return { x: ax + s * (bx - ax) + t * (cx - ax), y: ay + s * (by - ay) + t * (cy - ay) };
  }
}
export function isConvexVertex(prevPoint: Point, point: Point, nextPoint: Point, polygon: Point[]): boolean {
  // 三角形の内側にある頂点がないかをチェック
  for (const p of polygon) {
    if (p !== prevPoint && p !== point && p !== nextPoint) {
      if (isPointInsideTriangle([prevPoint, point, nextPoint], p)) {
        return false;
      }
    }
  }

  // 頂点の回転方向を確認
  const prevVecX = prevPoint.x - point.x;
  const prevVecY = prevPoint.y - point.y;
  const nextVecX = nextPoint.x - point.x;
  const nextVecY = nextPoint.y - point.y;

  const crossProduct = prevVecX * nextVecY - prevVecY * nextVecX;

  return crossProduct < 0;
}
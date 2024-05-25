import { Point } from '../Utils/geometry';

export class Triangle {
  vertices: [Point, Point, Point]

  constructor(vertices: Point[]) {
    this.vertices = [vertices[0], vertices[1], vertices[2]];
  }

  getArea(): number {
    const [a, b, c] = this.vertices;
    return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
  }
}
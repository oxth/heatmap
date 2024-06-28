import { Point } from './types';

export class Store {
  private _data: number[][];

  constructor() {
    this._data = [];
  }

  private _prepare(point: Point) {
    const store = this._data;
    const { x, y, value } = point;

    if (store[x] === undefined) store[x] = [];
    if (store[x][y] === undefined) {
      store[x][y] = value || 0;
    } else {
      store[x][y] += value;
    }
  }

  private _normalized() {
    const data: Point[] = [];
    this._data.forEach((row, x) => {
      row.forEach((value, y) => {
        if (value > 0) {
          data.push({
            x,
            y,
            value,
          });
        }
      });
    });
    return data;
  }

  add(data: Point[]): void {
    data.forEach((point) => {
      this._prepare(point);
    });
  }

  set(data: Point[]): void {
    this.reset();
    this.add(data);
  }

  reset(): void {
    this._data = [];
  }

  getData(): Point[] {
    return this._normalized();
  }
}

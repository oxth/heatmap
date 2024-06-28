"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
class Store {
    _data;
    constructor() {
        this._data = [];
    }
    _prepare(point) {
        const store = this._data;
        const { x, y, value } = point;
        if (store[x] === undefined)
            store[x] = [];
        if (store[x][y] === undefined) {
            store[x][y] = value || 0;
        }
        else {
            store[x][y] += value;
        }
    }
    _normalized() {
        const data = [];
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
    add(data) {
        data.forEach((point) => {
            this._prepare(point);
        });
    }
    set(data) {
        this.reset();
        this.add(data);
    }
    reset() {
        this._data = [];
    }
    getData() {
        return this._normalized();
    }
}
exports.Store = Store;

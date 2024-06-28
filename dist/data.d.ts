import { Point } from './types';
export declare class Store {
    private _data;
    constructor();
    private _prepare;
    private _normalized;
    add(data: Point[]): void;
    set(data: Point[]): void;
    reset(): void;
    getData(): Point[];
}

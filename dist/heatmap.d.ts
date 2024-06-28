import { HeatmapConfig, Point } from './types';
export default class Heatmap {
    private _config;
    private _store;
    private _renderer;
    constructor(options?: Partial<HeatmapConfig>);
    private _getRenderer;
    private _drawImageWithBG;
    addData(data: Point[]): void;
    setData(data: Point[]): void;
    clearData(): void;
    getData(): Point[];
    configure(options: Partial<HeatmapConfig>): void;
    refresh(): void;
    getValueAt(point: {
        x: number;
        y: number;
    }): number;
    toDataURL(): Promise<string>;
    toBuffer(): Promise<Buffer>;
    save(filename: string): Promise<void>;
}

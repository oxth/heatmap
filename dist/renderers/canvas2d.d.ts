import { GradientColor, HeatmapConfig, Point } from '../types';
export default class Canvas2dRenderer {
    private _config;
    private _currentMinMax;
    private _canvas;
    private _ctx;
    private _shadowCanvas;
    private _shadowCtx;
    private _renderBoundaries;
    private _palette;
    private readonly _templates;
    constructor(options?: Partial<HeatmapConfig>);
    get width(): number;
    get height(): number;
    get min(): number | null;
    get max(): number | null;
    get radius(): number;
    get opacity(): {
        current: number;
        min: number;
        max: number;
    };
    get intensity(): number;
    get gradients(): GradientColor[];
    private _clear;
    private _getColorPalette;
    private _getPointTemplate;
    private _getMinMax;
    private _drawAlpha;
    private _colorize;
    _setStyles(): void;
    _updateGradient(): void;
    render(points: Point[]): void;
    updateConfig(options: Partial<HeatmapConfig>): void;
    getValueAt(point: Omit<Point, 'value'>): number;
    toDataURL(): string;
    toBuffer(): Buffer;
}

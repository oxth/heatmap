import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas,
  ImageData,
} from 'canvas';
import { GradientColor, HeatmapConfig, Point } from '../types';
import { defaultConfigs } from '../config';

export default class Canvas2dRenderer {
  private _config: HeatmapConfig;
  private _currentMinMax: [number, number];

  private _canvas: Canvas;
  private _ctx: CanvasRenderingContext2D;

  private _shadowCanvas: Canvas;
  private _shadowCtx: CanvasRenderingContext2D;

  private _renderBoundaries: [number, number, number, number];

  private _palette: Uint8ClampedArray;
  private readonly _templates: Record<number, Canvas>;

  constructor(options: Partial<HeatmapConfig> = {}) {
    this._config = { ...defaultConfigs, ...options };
    this._currentMinMax = [-Infinity, Infinity];

    this._templates = {};
    this._renderBoundaries = [10000, 10000, 0, 0];

    this._canvas = createCanvas(this.width, this.height);
    this._ctx = this._canvas.getContext('2d');

    this._shadowCanvas = createCanvas(this.width, this.height);
    this._shadowCtx = this._shadowCanvas.getContext('2d');

    this._palette = this._getColorPalette();
  }

  get width(): number {
    return this._config.width;
  }

  get height(): number {
    return this._config.height;
  }

  get min(): number | null {
    return this._config.min;
  }

  get max(): number | null {
    return this._config.max;
  }

  get radius(): number {
    return this._config.radius;
  }

  get opacity(): { current: number; min: number; max: number } {
    return {
      current: this._config.opacity * 255,
      min: this._config.minOpacity * 255,
      max: this._config.maxOpacity * 255,
    };
  }

  get intensity(): number {
    return this._config.intensity;
  }

  get gradients(): GradientColor[] {
    return this._config.gradients;
  }

  private _clear(): void {
    this._ctx.clearRect(0, 0, this.width, this.height);
    this._shadowCtx.clearRect(0, 0, this.width, this.height);
  }

  private _getColorPalette(): Uint8ClampedArray {
    const width = 256;
    const height = 1;

    const paletteCanvas = createCanvas(width, height);
    const paletteCtx = paletteCanvas.getContext('2d');

    const gradient = paletteCtx.createLinearGradient(0, 0, width, height);
    this.gradients.forEach((elem: GradientColor) => {
      let color: string;
      if (typeof elem.color === 'object') {
        if (elem.color.length === 4) {
          color = `rgba(${elem.color.join(',')})`;
        } else {
          color = `rgb(${elem.color.join(',')})`;
        }
      } else {
        color = elem.color;
      }
      gradient.addColorStop(elem.offset, color);
    });

    paletteCtx.fillStyle = gradient;
    paletteCtx.fillRect(0, 0, width, height);

    return paletteCtx.getImageData(0, 0, width, height).data;
  }

  private _getPointTemplate(): Canvas {
    const width = this.radius * 2;
    const height = this.radius * 2;
    const x = this.radius;
    const y = this.radius;

    const tplCanvas = createCanvas(width, height);
    const tplCtx = tplCanvas.getContext('2d');

    if (this.intensity === 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = 'rgba(0,0,0,1)';
      tplCtx.fill();
    } else {
      const gradient = tplCtx.createRadialGradient(
        x,
        y,
        this.radius * this.intensity,
        x,
        y,
        this.radius,
      );
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, width, height);
    }

    return tplCanvas;
  }

  private _getMinMax(points: Point[]): [number, number] {
    if (this.min !== null && this.max !== null) {
      this._currentMinMax = [this.min as number, this.max as number];
    } else {
      const [min, max] = points.reduce(
        ([min, max], c) => {
          min = c.value < min ? c.value : min ?? c.value;
          max = c.value > max ? c.value : max ?? c.value;
          return [min, max];
        },
        [Infinity, -Infinity],
      );

      this._currentMinMax = [
        this.min !== null ? this.min : min,
        this.max !== null ? this.max : max,
      ];
    }

    return this._currentMinMax;
  }

  private _drawAlpha(points: Point[]): void {
    const radius = this.radius;
    const [min, max] = this._getMinMax(points);

    points.forEach(({ x, y, value }: Point) => {
      const dataValue = Math.min(value, max);
      const rectX = x - radius;
      const rectY = y - radius;

      let tpl: Canvas;
      if (!this._templates[radius]) {
        this._templates[radius] = tpl = this._getPointTemplate();
      } else {
        tpl = this._templates[radius];
      }

      const templateAlpha = (dataValue - min) / (max - min);

      this._shadowCtx.globalAlpha = templateAlpha < 0.01 ? 0.01 : templateAlpha;
      this._shadowCtx.drawImage(tpl, rectX, rectY);

      // update renderBoundaries
      if (rectX < this._renderBoundaries[0]) {
        this._renderBoundaries[0] = rectX;
      }
      if (rectY < this._renderBoundaries[1]) {
        this._renderBoundaries[1] = rectY;
      }
      if (rectX + 2 * radius > this._renderBoundaries[2]) {
        this._renderBoundaries[2] = rectX + 2 * radius;
      }
      if (rectY + 2 * radius > this._renderBoundaries[3]) {
        this._renderBoundaries[3] = rectY + 2 * radius;
      }
    });
  }

  private _colorize(): void {
    let x = this._renderBoundaries[0];
    let y = this._renderBoundaries[1];
    let width = this._renderBoundaries[2] - x;
    let height = this._renderBoundaries[3] - y;

    const maxWidth = this.width;
    const maxHeight = this.height;
    const opacity = this.opacity;

    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    if (x + width > maxWidth) {
      width = maxWidth - x;
    }
    if (y + height > maxHeight) {
      height = maxHeight - y;
    }

    const img = this._shadowCtx.getImageData(x, y, width, height);
    const imgData = img.data;
    const len = imgData.length;
    const palette = this._palette;

    for (let i = 3; i < len; i += 4) {
      const alpha = imgData[i];
      const offset = alpha * 4;

      if (!offset) {
        continue;
      }

      let finalAlpha: number;
      if (opacity.current > 0) {
        finalAlpha = opacity.current;
      } else {
        if (alpha < opacity.max) {
          if (alpha < opacity.min) {
            finalAlpha = opacity.min;
          } else {
            finalAlpha = alpha;
          }
        } else {
          finalAlpha = opacity.max;
        }
      }
      imgData[i - 3] = palette[offset];
      imgData[i - 2] = palette[offset + 1];
      imgData[i - 1] = palette[offset + 2];
      imgData[i] = this._config.useGradientOpacity
        ? palette[offset + 3]
        : finalAlpha;
    }

    const newImg = new ImageData(imgData, img.width, img.height);
    this._ctx.putImageData(newImg, x, y);

    this._renderBoundaries = [1000, 1000, 0, 0];
  }

  _setStyles() {
    this._canvas.width = this._shadowCanvas.width = this.width;
    this._canvas.height = this._shadowCanvas.height = this.height;
  }

  _updateGradient() {
    this._palette = this._getColorPalette();
  }

  render(points: Point[]): void {
    this._clear();
    this._drawAlpha(points);
    this._colorize();
  }

  updateConfig(options: Partial<HeatmapConfig>): void {
    this._config = { ...this._config, ...options };

    this._setStyles();
    if (options.gradients) {
      this._updateGradient();
    }
  }

  getValueAt(point: Omit<Point, 'value'>): number {
    const [min, max] = this._currentMinMax;
    const img = this._shadowCtx.getImageData(point.x, point.y, 1, 1);
    const data = img.data[3];

    return (Math.abs(max - min) * (data / 255)) >> 0;
  }

  toDataURL(): string {
    return this._canvas.toDataURL();
  }

  toBuffer(): Buffer {
    return this._canvas.toBuffer();
  }
}

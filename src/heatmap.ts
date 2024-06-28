import { promises as fs } from 'fs';
import { HeatmapConfig, Point } from './types';
import { Store } from './data';
import Canvas2dRenderer from './renderers/canvas2d';
import { defaultConfigs } from './config';
import { createCanvas, loadImage } from 'canvas';

export default class Heatmap {
  private _config: HeatmapConfig;

  private _store: Store;
  private _renderer: Canvas2dRenderer;

  constructor(options: Partial<HeatmapConfig> = {}) {
    this._config = { ...defaultConfigs, ...options };

    this._store = new Store();
    this._renderer = this._getRenderer(this._config.renderer);
  }

  private _getRenderer(renderer: HeatmapConfig['renderer']): Canvas2dRenderer {
    if (renderer === 'canvas2d') {
      return new Canvas2dRenderer(this._config);
    }
    throw new Error(`Renderer '${renderer}' are not supported`);
  }

  private async _drawImageWithBG() {
    const canvas = createCanvas(this._config.width, this._config.height);
    const ctx = canvas.getContext('2d');

    if (this._config.backgroundImage) {
      const bgImg = await loadImage(this._config.backgroundImage);
      ctx.drawImage(bgImg, 0, 0);
    }
    const overlay = await loadImage(this._renderer.toBuffer());
    ctx.drawImage(overlay, 0, 0);
    return canvas;
  }

  addData(data: Point[]): void {
    this._store.add(data);
    this.refresh();
  }

  setData(data: Point[]): void {
    this._store.set(data);
    this.refresh();
  }

  clearData(): void {
    this._store.reset();
    this.refresh();
  }

  getData(): Point[] {
    return this._store.getData();
  }

  configure(options: Partial<HeatmapConfig>): void {
    this._config = { ...this._config, ...options };
    this._renderer.updateConfig(options);
    this.refresh();
  }

  refresh(): void {
    this._renderer.render(this.getData());
  }

  getValueAt(point: { x: number; y: number }): number {
    return this._renderer.getValueAt(point);
  }

  async toDataURL(): Promise<string> {
    const ctx = await this._drawImageWithBG();
    return ctx.toDataURL();
  }

  async toBuffer(): Promise<Buffer> {
    const ctx = await this._drawImageWithBG();
    return ctx.toBuffer();
  }

  async save(filename: string): Promise<void> {
    const ctx = await this._drawImageWithBG();
    await fs.writeFile(filename, ctx.toBuffer());
  }
}

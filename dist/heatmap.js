"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const data_1 = require("./data");
const canvas2d_1 = __importDefault(require("./renderers/canvas2d"));
const config_1 = require("./config");
const canvas_1 = require("canvas");
class Heatmap {
    _config;
    _store;
    _renderer;
    constructor(options = {}) {
        this._config = { ...config_1.defaultConfigs, ...options };
        this._store = new data_1.Store();
        this._renderer = this._getRenderer(this._config.renderer);
    }
    _getRenderer(renderer) {
        if (renderer === 'canvas2d') {
            return new canvas2d_1.default(this._config);
        }
        throw new Error(`Renderer '${renderer}' are not supported`);
    }
    async _drawImageWithBG() {
        const canvas = (0, canvas_1.createCanvas)(this._config.width, this._config.height);
        const ctx = canvas.getContext('2d');
        if (this._config.backgroundImage) {
            const bgImg = await (0, canvas_1.loadImage)(this._config.backgroundImage);
            ctx.drawImage(bgImg, 0, 0);
        }
        const overlay = await (0, canvas_1.loadImage)(this._renderer.toBuffer());
        ctx.drawImage(overlay, 0, 0);
        return canvas;
    }
    addData(data) {
        this._store.add(data);
        this.refresh();
    }
    setData(data) {
        this._store.set(data);
        this.refresh();
    }
    clearData() {
        this._store.reset();
        this.refresh();
    }
    getData() {
        return this._store.getData();
    }
    configure(options) {
        this._config = { ...this._config, ...options };
        this._renderer.updateConfig(options);
        this.refresh();
    }
    refresh() {
        this._renderer.render(this.getData());
    }
    getValueAt(point) {
        return this._renderer.getValueAt(point);
    }
    async toDataURL() {
        const ctx = await this._drawImageWithBG();
        return ctx.toDataURL();
    }
    async toBuffer() {
        const ctx = await this._drawImageWithBG();
        return ctx.toBuffer();
    }
    async save(filename) {
        const ctx = await this._drawImageWithBG();
        await fs_1.promises.writeFile(filename, ctx.toBuffer());
    }
}
exports.default = Heatmap;

export interface Point {
    x: number;
    y: number;
    value: number;
}
export interface GradientColor {
    color: string | [number, number, number, number?];
    offset: number;
}
export interface HeatmapConfig {
    renderer: 'canvas2d';
    width: number;
    height: number;
    min: number | null;
    max: number | null;
    radius: number;
    opacity: number;
    minOpacity: number;
    maxOpacity: number;
    intensity: number;
    useGradientOpacity: boolean;
    gradients: GradientColor[];
    plugins: Record<string, any>;
    backgroundImage?: string;
}

import { HeatmapConfig } from './types';

export const defaultConfigs: HeatmapConfig = {
  renderer: 'canvas2d',
  width: 640,
  height: 640,
  min: null,
  max: null,
  radius: 20,
  opacity: 0,
  minOpacity: 0,
  maxOpacity: 1,
  intensity: 0.25,
  useGradientOpacity: false,
  gradients: [
    {
      color: [0, 0, 255],
      offset: 0,
    },
    {
      color: [0, 0, 255],
      offset: 0.2,
    },
    {
      color: [0, 255, 0],
      offset: 0.45,
    },
    {
      color: [255, 255, 0],
      offset: 0.85,
    },
    {
      color: [255, 0, 0],
      offset: 1.0,
    },
  ],
  plugins: {},
};

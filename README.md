# heatmap.js

Heatmaps for the Node.js.

> This project was fork from [heatmap.js](https://www.patrick-wied.at/static/heatmapjs/) to make support only generate
> heatmap from backend

## How to get started

heatmap is also hosted on npm:

`npm install @oxth/heatmap`

## Importing

`import Heatmap from '@oxth/heatmap'`

## Example

```javascript
const heatmap = new Heatmap({
  width: 640,
  height: 640,
  backgroundImage: 'img_test.jpg',
  radius: 2.2,
  minOpacity: 0.3,
  maxOpacity: 0.5,
});
const points = getCanvasData();
heatmap.setData(points);
await heatmap.save('test.png');
```

## Configurations

| Param              | Type                                                         | Default                                                                                                                                                                                           | Required | Description                                                                                                                 |
|--------------------|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------|
| renderer           | string                                                       | canvas2d                                                                                                                                                                                          | No       | Choose your render type (currently only support `2D` canvas)                                                                |
| width              | number                                                       | 640                                                                                                                                                                                               | No       | Width of your image.                                                                                                        |
| height             | canvas2d                                                     | 640                                                                                                                                                                                               | No       | Height of image.                                                                                                            |
| min                | number                                                       | null                                                                                                                                                                                              | No       | Max data Value for relative gradient computation. if not set, will be derived from data.                                    |
| max                | number                                                       | null                                                                                                                                                                                              | No       | Min data Value for relative gradient computation. if not set, will be derived from data.                                    |
| radius             | number                                                       | 20                                                                                                                                                                                                | No       | Radius of the data point, in pixels.                                                                                        |
| opacity            | number                                                       | 0                                                                                                                                                                                                 | No       | Opacity factor. (This overrides maxOpacity and minOpacity if greater than 0)                                                |
| minOpacity         | number                                                       | 0                                                                                                                                                                                                 | No       | Min opacity factor. (will be overridden if opacity set)                                                                     |
| maxOpacity         | number                                                       | 1                                                                                                                                                                                                 | No       | Max opacity factor. (will be overridden if opacity set)                                                                     |
| intensity          | number                                                       | 0.25                                                                                                                                                                                              | No       | The intensity that will be applied to all datapoints. The lower the intensity factor is, the smoother the gradients will be |
| useGradientOpacity | boolean                                                      | false                                                                                                                                                                                             | No       | A boolean flag to use opacity of Color Gradient instead of specify opacity                                                  |
| gradients          | {color: [number, number, number, number?], offset: number}[] | [{ color: [0, 0, 255], offset: 0, }, { color: [0, 0, 255], offset: 0.2, }, { color: [0, 255, 0], offset: 0.45, }, { color: [255, 255, 0], offset: 0.85, }, { color: [255, 0, 0], offset: 1.0, },] | No       | Color Gradient, an array of objects with color value and offset.                                                            |
| backgroundImage    | string                                                       |                                                                                                                                                                                                   | No       | To set the background for the heatmap.                                                                                      |
| plugins            | object                                                       | {}                                                                                                                                                                                                | No       | The plugin support.                                                                                                         |

## Available API

### instance.addData([])

Accepts an array of data points with 'x', 'y' and 'value'.

`instance.addData([x: , y: , value: ])`

### instance.setData([])

Accepts an array of data points with 'x', 'y' and 'value'.

`instance.setData([x: , y: , value: ])`

### instance.clearData([])

`instance.clearData()`

### instance.configure({})

Update the configuration

`instance.configure({ width: , height: })`

### instance.toDataURL() <Promise>

get output to base64 data url

`await instance.toDataURL()`

### instance.toBuffer() <Promise>

get output to buffer

`await instance.toBuffer()`

### instance.save(filename) <Promise>

get output to file

`await instance.save('test.png')`

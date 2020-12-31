/* jshint esversion: 6 */
import maplibre from 'https://cdn.skypack.dev/pin/maplibre-gl@v1.13.0-rc.4-SIOCqsILuFMvv7MmxTuG/min/maplibre-gl.js';
import '../dist/gaugelegend.js';

const config = {
  layer: 'test',
  property: 'kdensity',
  text1: 'kernel',
  text2: 'density',
  colors: ["#007080", "#546e82", "#7f6984", "#a16287", "#c25689", "#e0448b", "#ff1d8e"],
  breaks: [7,17,32,57,129,253,334]
};

const map = new maplibre.Map({
  container: 'map',
  style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [-3.703793, 40.416687],
  zoom: 12,
  minZoom: 10,
  maxZoom: 21,
});

map.on('load', function () {
  map.addLayer({
    id: 'test',
    type: 'circle',
    source: {
      type: 'vector',
      tiles: ['https://abelvm.carto.com/api/v1/map/named/tpl_55d34678_9879_4bb8_ac58_d3b93056a3cb/mapnik/{z}/{x}/{y}.mvt'],
      maxzoom: 15
    },
    'source-layer': '4bca3307-6917-4394-9261-cda2b92706cf',
    "paint": {
      'circle-radius': 4,
      'circle-color':{
        "property": "kdensity",
        "stops": [
          [config.breaks[0], config.colors[0]],
          [config.breaks[1], config.colors[1]],
          [config.breaks[2], config.colors[2]],
          [config.breaks[3], config.colors[3]],
          [config.breaks[4], config.colors[4]],
          [config.breaks[5], config.colors[5]],
          [config.breaks[6], config.colors[6]]
        ]
      }
      }
  });
  const gauge = new GaugeLegend(config);
  map.addControl(gauge, 'bottom-right');
});
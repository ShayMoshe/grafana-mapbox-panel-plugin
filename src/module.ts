import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { MapboxPanel } from './MapboxPanel';

export const plugin = new PanelPlugin<SimpleOptions>(MapboxPanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'accessToken',
      name: 'Access Token',
      defaultValue: '',
    })
    .addTextInput({
      path: 'style',
      name: 'Style URL',
      defaultValue: 'mapbox://styles/mapbox/streets-v11',
    })
    .addNumberInput({
      path: 'zoom',
      name: 'Initial Zoom',
      defaultValue: 5,
    })
    .addRadio({
      path: 'type',
      defaultValue: 'cluster',
      name: 'Map Type',
      settings: {
        options: [
          {
            value: 'cluster',
            label: 'Cluster',
          },
          {
            value: 'heatmap',
            label: 'Heatmap',
          },
          {
            value: 'track',
            label: 'Track',
          },
        ],
      },
    })
    .addTextInput({
      path: 'lineColor',
      name: 'Line Color',
      defaultValue: 'yellow',
      showIf: config => config.type === 'track',
    })
    .addNumberInput({
      path: 'lineWidth',
      name: 'Line Width',
      defaultValue: 4,
      showIf: config => config.type === 'track',
    })
    .addTextInput({
      path: 'dotColor',
      name: 'Dot Color',
      defaultValue: 'red',
      showIf: config => config.type === 'track',
    })
    .addNumberInput({
      path: 'dotSize',
      name: 'Dot Size',
      defaultValue: 100,
      showIf: config => config.type === 'track',
    })
    .addBooleanSwitch({
      path: 'autoCenter',
      name: 'Auto Center',
      defaultValue: true,
      showIf: config => config.type === 'track',
    });
});

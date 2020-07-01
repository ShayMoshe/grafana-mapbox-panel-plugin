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
    });
});

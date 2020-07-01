import React, { useEffect, useState, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import mapboxgl from 'mapbox-gl';
import 'mapbox.css';

interface Props extends PanelProps<SimpleOptions> {}

export const MapboxPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles();

  const [map, setMap] = useState(null);
  const [type, setType] = useState(options.type);
  const mapContainer = useRef(null);
  const stylesMap = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
  };

  useEffect(() => {
    mapboxgl.accessToken = options.accessToken;
    const initializeMap = ({ setMap, mapContainer }: any) => {
      let map: any = null;
      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: options.style || 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: options.zoom || 5,
      });

      map.on('load', () => {
        setMap(map);
        map.resize();

        let features = [];
        let time: any = data.series[0].fields.filter(field => field.name === 'Time' || field.name === 'time');
        let latitude: any = data.series[0].fields.filter(field => field.name === 'latitude' || field.name === 'lat');
        let longitude: any = data.series[0].fields.filter(field => field.name === 'longitude' || field.name === 'lng');
        let name: any = data.series[0].fields.filter(field => field.name === 'name');
        let value: any = data.series[0].fields.filter(field => field.name === 'value');
        let coordinates = [];
        for (let index = 0; index < data.series[0].length; index++) {
          features.push({
            type: 'Feature',
            properties: {
              id: 'ak16994521',
              mag: value[0].values.buffer[index],
              time: time[0].values.buffer[index],
              felt: null,
              name: name[0].values.buffer[index],
            },
            geometry: {
              type: 'Point',
              coordinates: [longitude[0].values.buffer[index], latitude[0].values.buffer[index], 0.0],
            },
          });
          coordinates.push([longitude[0].values.buffer[index], latitude[0].values.buffer[index]]);
        }
        if (type === 'cluster') {
          map.addSource('earthquakes', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: {
              type: 'FeatureCollection',
              crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
              features: features,
            },
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
          });

          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            paint: {
              // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
              // with three steps to implement three types of circles:
              //   * Blue, 20px circles when point count is less than 100
              //   * Yellow, 30px circles when point count is between 100 and 750
              //   * Pink, 40px circles when point count is greater than or equal to 750
              'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
              'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
            },
          });

          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
          });

          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 4,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          // inspect a cluster on click
          map.on('click', 'clusters', (e: any) => {
            var features = map.queryRenderedFeatures(e.point, {
              layers: ['clusters'],
            });
            var clusterId = features[0].properties.cluster_id;
            map.getSource('earthquakes').getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
              if (err) {
                return;
              }

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
          });

          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
          map.on('click', 'unclustered-point', (e: any) => {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var vl = e.features[0].properties.mag;
            var nm = e.features[0].properties.name;

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(`name ${nm} [value: ${vl}]`)
              .addTo(map);
          });

          map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
          });
        } else if (type === 'heatmap') {
          map.addSource('earthquakes', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
              features: features,
            },
          });

          map.addLayer(
            {
              id: 'earthquakes-heat',
              type: 'heatmap',
              source: 'earthquakes',
              maxzoom: 9,
              paint: {
                // Increase the heatmap weight based on frequency and property magnitude
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.6,
                  'rgb(253,219,199)',
                  0.8,
                  'rgb(239,138,98)',
                  1,
                  'rgb(178,24,43)',
                ],
                // Adjust the heatmap radius by zoom level
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
                // Transition from heatmap to circle layer by zoom level
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
              },
            },
            'waterway-label'
          );

          map.addLayer(
            {
              id: 'earthquakes-point',
              type: 'circle',
              source: 'earthquakes',
              minzoom: 7,
              paint: {
                // Size circle radius by earthquake magnitude and zoom level
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                  16,
                  ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50],
                ],
                // Color circle by earthquake magnitude
                'circle-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'mag'],
                  1,
                  'rgba(33,102,172,0)',
                  2,
                  'rgb(103,169,207)',
                  3,
                  'rgb(209,229,240)',
                  4,
                  'rgb(253,219,199)',
                  5,
                  'rgb(239,138,98)',
                  6,
                  'rgb(178,24,43)',
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                // Transition from heatmap to circle layer by zoom level
                'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
              },
            },
            'waterway-label'
          );
        } else if (type === 'track') {
          // map.on('load', () => {
          // We use D3 to fetch the JSON here so that we can parse and use it separately
          // from GL JS's use in the added source. You can use any request method (library
          // or otherwise) that you want.

          const data = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: coordinates,
                },
              },
            ],
          };
          // add it to the map
          map.addSource('trace', { type: 'geojson', data: data });
          map.addLayer({
            id: 'trace',
            type: 'line',
            source: 'trace',
            paint: {
              'line-color': 'yellow',
              'line-opacity': 0.75,
              'line-width': 4,
            },
          });

          // setup the viewport
          map.jumpTo({ center: coordinates[coordinates.length], zoom: 2 });
          map.setPitch(30);
        }
      });
    };

    if (!map) {
      console.log('initializeMap');
      initializeMap({ setMap, mapContainer });
    }
  }, [map]);

  useEffect(() => {
    console.log('options', options);
    setType(options.type);
    setMap(null);
  }, [options, width, height]);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div>
        <div ref={el => (mapContainer.current = el)} style={stylesMap} />
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
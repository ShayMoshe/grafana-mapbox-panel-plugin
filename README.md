# Grafana mapbox Panel Plugin

[mapbox](https://www.mapbox.com/) map for Grafana

## Configuration
![alt text](https://raw.githubusercontent.com/ShayMoshe/grafana-mapbox-panel-plugin/master/src/img/display.png)

- Access Token: your mapbox access token [more info](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/)
- Style Url: URL style from the Mapbox API (mapbox://styles/:owner/:style) [more info](https://docs.mapbox.com/mapbox-gl-js/api/map/).
for example:
    - mapbox://styles/mapbox/streets-v11
    - mapbox://styles/mapbox/outdoors-v11
    - mapbox://styles/mapbox/light-v10
    - mapbox://styles/mapbox/dark-v10
- Initial Zoom: Starting zoom level of the map (0-24).

## Data
The plugin works, when the Format is set to Table. <br/>
The required rows are: 
- latitude (or lat)
- longitude (or lng)
- Time (or time)
- name
- value

## Map Type


### Cluster
![alt text](https://raw.githubusercontent.com/ShayMoshe/grafana-mapbox-panel-plugin/master/src/img/cluster.png)

### HeatMap
![alt text](https://raw.githubusercontent.com/ShayMoshe/grafana-mapbox-panel-plugin/master/src/img/heatmap.png)

### Track
![alt text](https://raw.githubusercontent.com/ShayMoshe/grafana-mapbox-panel-plugin/master/src/img/track.png)


## Installation
1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```
3. Build plugin in production mode
```BASH
yarn build
```

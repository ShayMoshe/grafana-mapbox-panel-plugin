# Grafana mapbox Panel Plugin

<!-- 
[![CircleCI](https://circleci.com/gh/grafana/simple-react-panel.svg?style=svg)](https://circleci.com/gh/grafana/simple-react-panel)
[![David Dependency Status](https://david-dm.org/grafana/simple-react-panel.svg)](https://david-dm.org/grafana/simple-react-panel)
[![David Dev Dependency Status](https://david-dm.org/grafana/simple-react-panel/dev-status.svg)](https://david-dm.org/grafana/simple-react-panel/?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/grafana/simple-react-panel/badge.svg)](https://snyk.io/test/github/grafana/simple-react-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/1dee2585eb412f913cbb/maintainability)](https://codeclimate.com/github/grafana/simple-react-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1dee2585eb412f913cbb/test_coverage)](https://codeclimate.com/github/grafana/simple-react-panel/test_coverage) -->

[mapbox](https://www.mapbox.com/) map for Grafana

## Configuration
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

### HeatMap

### Track

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

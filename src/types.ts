type SeriesSize = 'sm' | 'md' | 'lg';
type MapType = 'cluster' | 'heatmap' | 'track';

export interface SimpleOptions {
  text: string;
  accessToken: string;
  style: string;
  zoom: number;
  type: MapType;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
  lineColor: string;
  lineWidth: number;
}

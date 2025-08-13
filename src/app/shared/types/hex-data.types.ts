export type GeometryType = 'Polygon' | 'MultiPolygon' | 'Point';

// --RAW - EPSG:3857--
export interface RawHexagonFeatureCollection {
  type: string;
  features: RawHexagonFeature[];
}

export interface RawHexagonFeature {
  type: string;
  properties: RawHexagonProperties;
  geometry: RawPolygon | RawMultiPolygon;
}

export interface RawHexagonProperties {
  COLOR_HEX: string;
  ID: string | number;
}

export interface RawPolygon {
  type: GeometryType;
  coordinates: Position3857[][];
}

export interface RawMultiPolygon {
  type: GeometryType;
  coordinates: Position3857[][][];
}

export type Position3857 = [number, number];



// --CONVERTED - EPSG:4326--
export interface HexagonFeatureCollection {
  type: string;
  features: HexagonFeature[];
}

export interface HexagonFeature {
  type: string;
  properties: HexagonProperties;
  geometry: Polygon | MultiPolygon | Point;
}

export interface HexagonProperties {
  id: string | number;
  color: string;
}

export interface Polygon {
  type: GeometryType;
  coordinates: Position4326[][];
}

export interface MultiPolygon {
  type: GeometryType;
  coordinates: Position4326[][][];
}

export interface Point {
  type: GeometryType;
  coordinates: Position4326;
}

export type Position4326 = [number, number];

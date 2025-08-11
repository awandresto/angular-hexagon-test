export interface RawHexagonCollection {
  type: string;
  features: RawHexagon[];
  crs?: Crs;
}

export interface RawHexagon {
  type: string;
  properties: HexagonPropertiesRaw;
  geometry: RawPolygon | RawMultiPolygon;
}

export interface Crs {
  type: string;
  properties: { name: string };
}


export interface HexagonPropertiesRaw {
  COLOR_HEX: string;
  ID: string | number;
}


export interface RawPolygon {
  type: string;
  coordinates: Position[][];
  crs?: Crs;
}
export interface RawMultiPolygon {
  type: string;
  coordinates: Position[][][];
  crs?: Crs;
}


export type Position = [number, number];

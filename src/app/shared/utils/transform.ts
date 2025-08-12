import proj4 from 'proj4';
import {
  RawHexagonFeatureCollection,
  RawHexagonFeature,
  RawMultiPolygon,
  RawPolygon,
  Position3857,
  HexagonFeatureCollection,
  HexagonFeature,
  MultiPolygon,
  Polygon,
  Position4326,
  HexagonProperties
} from '../types/hex-data.types';

const FROM = 'EPSG:3857';
const TO   = 'EPSG:4326';

export function transformFC3857to4326(
  raw: RawHexagonFeatureCollection
): HexagonFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: raw.features.map(transformFeature),
  };
}

function transformFeature(f: RawHexagonFeature): HexagonFeature {
  const props: HexagonProperties = {
    id: f.properties.ID,
    colorHex: f.properties.COLOR_HEX,
    color: convertColorHex(f.properties.COLOR_HEX),
  };

  if (f.geometry.type === 'Polygon') {
    return { type: 'Feature', properties: props, geometry: transformPolygon(f.geometry as RawPolygon) };
  }
  if (f.geometry.type === 'MultiPolygon') {
    return { type: 'Feature', properties: props, geometry: transformMultiPolygon(f.geometry as RawMultiPolygon) };
  }
  throw new Error(`Unsupported geometry: ${f.geometry.type}`);
}

function convertColorHex(hex: string): string {
  const h = hex?.trim().replace(/^#/, '');
  const six = h?.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return '#' + (six ?? '000000');
}

function transformPolygon(geom: RawPolygon): Polygon {
  return {
    type: 'Polygon',
    coordinates: geom.coordinates.map(
      ring => ring.map(to4326)
    )
  };
}

function transformMultiPolygon(geom: RawMultiPolygon): MultiPolygon {
  return {
    type: 'MultiPolygon',
    coordinates: geom.coordinates.map(
      poly => poly.map(ring => ring.map(to4326))
    )
  };
}

export function to4326([x, y]: Position3857): Position4326 {
  const [lon, lat] = proj4(FROM, TO, [x, y]) as [number, number];
  return [lon, lat];
}

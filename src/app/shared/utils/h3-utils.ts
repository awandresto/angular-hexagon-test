import { cellToBoundary, cellToLatLng, latLngToCell } from 'h3-js';
import { featureToH3Set } from 'geojson2h3';
import * as turf from '@turf/turf';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import { HexagonFeatureCollection, HexagonFeature, HexagonProperties } from '../types/hex-data.types';


export function filterCellsInBounds(
  cells: Map<string, string>,
  containsLatLng: (lat: number, lng: number) => boolean
): HexagonProperties[] {
  const out: HexagonProperties[] = [];

  for (const [id, color] of cells) {
    const [lat, lng] = cellToLatLng(id);
    if (containsLatLng(lat, lng)) out.push({ id, color });
  }
  return out;
}

export function cellBoundaryLatLngs(id: string): Array<{ lat: number; lng: number }> {
  const boundary = cellToBoundary(id, true);
  return boundary.map(([lng, lat]) => ({ lat, lng }));
}

export function buildCellColorMapForRes(
  fc: HexagonFeatureCollection,
  res: number,
  viewportBbox: Feature<Polygon>
): Map<string, string> {
  const cellToColor = new Map<string, string>();

  for (const f of fc.features) {
    if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') {
      continue;
    }

    if (viewportBbox && !turf.booleanIntersects(
      f as unknown as Feature<Polygon | MultiPolygon>,
      viewportBbox
    )) {
      continue;
    }

    const cells = featureToCells(f, res);
    const color = f.properties.color;

    for (const c of cells) {
      if (!cellToColor.has(c)) cellToColor.set(c, color);
    }
  }
  return cellToColor;
}

function estimateCellsForRes(res: number, map: L.Map): number {
  const bounds = map.getBounds();
  const viewportPoly = turf
    .bboxPolygon([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
  const viewportArea = turf.area(viewportPoly);

  const c = bounds.getCenter();
  const cellId = latLngToCell(c.lat, c.lng, res);
  const boundary = cellToBoundary(cellId, true);

  const ring = boundary.map(([lng, lat]) => [lat, lng]);
  ring.push(ring[0]);
  const cellPoly = turf.polygon([ring as [number, number][]]);

  const cellArea = Math.max(turf.area(cellPoly), 1);
  return viewportArea / cellArea;
}

function featureToCells(f: HexagonFeature, res: number): string[] {
  return featureToH3Set(
    f as unknown as Feature<Polygon | MultiPolygon, any>,
    res
  );
}

export function pickResForViewport(map: L.Map, zoom: number, maxCells = 1500): number {
  let res = zoomToH3Res(zoom);

  while (res > 0 && estimateCellsForRes(res, map) > maxCells) res--;
  return res;
}

function zoomToH3Res(zoom: number): number {
  if (zoom <= 4) return 3;
  if (zoom <= 6) return 4;
  if (zoom <= 8) return 5;
  if (zoom <= 10) return 6;
  if (zoom <= 12) return 7;
  return 8;
}

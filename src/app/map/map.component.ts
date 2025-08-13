import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, OnDestroy,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { HexDataService } from '../shared/services/hex-data.service';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { auditTime, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import * as turf from '@turf/turf';
import {
  pickResForViewport,
  buildCellColorMapForRes,
  filterCellsInBounds,
  cellBoundaryLatLngs
} from '../shared/utils/h3-utils';
import { HexagonFeatureCollection } from '../shared/types/hex-data.types';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [
    SpinnerComponent,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit, OnDestroy {
  public  isLoading$ = new BehaviorSubject(false);

  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  private data?: HexagonFeatureCollection;
  private hexLayer = L.layerGroup();
  private map!: L.Map;
  private sub?: Subscription;
  private viewport$ = new Subject<void>();

  private cellMaps = new Map<number, Map<string, string>>();
  private rendered = new Map<string | number, L.Polygon>();

  constructor(private hexagonService: HexDataService) {
  }

  public ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, {
      center: [50.4505, 30.5244],
      zoom: 6,
      minZoom: 2,
      maxZoom: 19,
      preferCanvas: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.hexLayer.addTo(this.map);

    this.map.on('moveend zoomend', () => this.viewport$.next());
    this.sub = this.viewport$.pipe(auditTime(120)).subscribe(() => this.updateHexes());

    setTimeout(() => this.isLoading$.next(true));
    this.hexagonService.getTransformedData()
      .subscribe(data => {
        if (data) {
          const [minX, minY, maxX, maxY] = turf.bbox(data as any);
          this.map.fitBounds([[minY, minX], [maxY, maxX]]);

          this.data = data;
          this.updateHexes();
        }
        this.isLoading$.next(false);
      });
  }

  public ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.map.remove();
  }

  private updateHexes(): void {
    if (!this.data) return;

    const zoom = this.map.getZoom();
    const res = pickResForViewport(this.map, zoom, 1500);

    const bounds = this.map.getBounds();
    const viewportBboxPoly = turf
      .bboxPolygon([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);

    let cellMap = this.cellMaps.get(res);
    if (!cellMap) {
      cellMap = buildCellColorMapForRes(this.data, res, viewportBboxPoly);
      this.cellMaps.set(res, cellMap);
    }

    const visible =
      filterCellsInBounds(cellMap, (lat, lng) => bounds.contains(L.latLng(lat, lng)));

    const nextIds = new Set(visible.map(v => v.id));

    for (const [id, poly] of this.rendered) {
      if (!nextIds.has(id)) {
        this.hexLayer.removeLayer(poly);
        this.rendered.delete(id);
      }
    }

    for (const { id, color } of visible) {
      if (this.rendered.has(id)) continue;

      const latlngs = cellBoundaryLatLngs(String(id)).map(p => L.latLng(p.lat, p.lng));
      const poly = L.polygon(latlngs, {
        fillColor: color,
        fillOpacity: 0.7,
        color: '#000',
        weight: 2,
        interactive: false,
        renderer: L.canvas()
      });

      poly.addTo(this.hexLayer);
      this.rendered.set(id, poly);
    }
  }
}

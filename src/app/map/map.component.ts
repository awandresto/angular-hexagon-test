import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { HexDataService } from '../shared/services/hex-data.service';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
export class MapComponent implements OnInit, AfterViewInit {
  public  isLoading$ = new BehaviorSubject(false);

  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  private map!: L.Map;

  constructor(private hexagonService: HexDataService) {
  }

  public ngOnInit(): void {
    this.isLoading$.next(true);
    this.hexagonService.getRawData().subscribe(data => {
      // Process the hexagon data here
      this.isLoading$.next(false);
    });
  }

  public ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, {
      center: [49.4501, 29.5101],
      zoom: 6,
      minZoom: 2,
      maxZoom: 19,
      preferCanvas: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);
  }
}

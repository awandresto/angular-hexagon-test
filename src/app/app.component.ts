import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MapComponent
  ],
  template: '<app-map></app-map>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-hexagon-test';
}

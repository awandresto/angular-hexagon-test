import { HexagonFeatureCollection, RawHexagonFeatureCollection } from '../types/hex-data.types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, shareReplay } from 'rxjs';
import { transformFC3857to4326 } from '../utils/transform';

@Injectable({ providedIn: 'root' })
export class HexDataService {
  constructor(private http: HttpClient) {}

  public getTransformedData(): Observable<HexagonFeatureCollection> {
    return this.http.get<RawHexagonFeatureCollection>('assets/data.json')
      .pipe(
        delay(1200),
        map(transformFC3857to4326),
        shareReplay(1)
      );
  }
}

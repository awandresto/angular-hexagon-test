import { RawHexagonCollection } from '../types/hex-data.types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HexDataService {
  constructor(private http: HttpClient) {}

  public getRawData(): Observable<RawHexagonCollection> {
    return this.http.get<RawHexagonCollection>('assets/data.json')
      .pipe(delay(1200)); // Simulate network delay
  }
}

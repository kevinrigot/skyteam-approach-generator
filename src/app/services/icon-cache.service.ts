import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';

const FALLBACK =
  `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">` +
  `<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>` +
  `<line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>` +
  `<line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>` +
  `</svg>`;

@Injectable({ providedIn: 'root' })
export class IconCacheService {
  private cache = new Map<string, string>();
  private http = inject(HttpClient);

  load(name: string): Observable<string> {
    if (this.cache.has(name)) {
      return of(this.cache.get(name)!);
    }
    return this.http.get(`/icons/${name}.svg`, { responseType: 'text' }).pipe(
      tap(svg => this.cache.set(name, svg)),
      catchError(() => of(FALLBACK)),
    );
  }
}

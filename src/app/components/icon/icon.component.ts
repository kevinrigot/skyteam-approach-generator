import { Component, input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconCacheService } from '../../services/icon-cache.service';

@Component({
  selector: 'app-icon',
  template: `
    <span class="icon-inner"
      [style.width.px]="width() ?? size()"
      [style.height.px]="size()"
      [style.color]="color()"
      [innerHTML]="svgHtml()">
    </span>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; justify-content: center; }
    .icon-inner { display: inline-flex; align-items: center; justify-content: center; }
    .icon-inner ::ng-deep svg { display: block; width: 100%; height: 100%; }
  `],
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(24);
  width = input<number | undefined>(undefined);
  color = input<string>('currentColor');

  private cache = inject(IconCacheService);
  private sanitizer = inject(DomSanitizer);

  svgHtml = toSignal<SafeHtml>(
    toObservable(this.name).pipe(
      switchMap(name => this.cache.load(name)),
      map(svg => this.sanitizer.bypassSecurityTrustHtml(svg)),
    ),
  );
}

import { Component, input, computed } from '@angular/core';
import { CaseData } from '../../models/card.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card-case',
  imports: [IconComponent],
  templateUrl: './card-case.component.html',
  styleUrl: './card-case.component.scss',
})
export class CardCaseComponent {
  caseData = input.required<CaseData>();
  type = input.required<'top' | 'middle' | 'bottom'>();
  lightVersion = input(false);
  showAlarms = input(false);

  iconWhite    = computed(() => this.lightVersion() ? '#0d1b3e' : '#fff');
  iconAirport  = computed(() => this.lightVersion() ? 'rgba(13,27,62,0.7)' : 'rgba(255,255,255,0.85)');
  iconCloudSm  = computed(() => this.lightVersion() ? 'rgba(13,27,62,0.35)' : 'rgba(255,255,255,0.6)');
  iconCloudMd  = computed(() => this.lightVersion() ? 'rgba(13,27,62,0.5)' : 'rgba(255,255,255,0.75)');

  isTop = computed(() => this.type() === 'top');
  isBottom = computed(() => this.type() === 'bottom');

  // Place each icon on a circular arc of radius R.
  // dx = horizontal offset from center icon; dy = vertical drop along the arc.
  // angle = tangent direction at that point on the circle.
  dirTransform(i: number, active: boolean): string {
    const R = 18;
    const step = 7;
    const dx = (i - 2) * step;
    const dy = R - Math.sqrt(R * R - dx * dx);
    const angle = Math.asin(dx / R) * (180 / Math.PI);
    const rotation = active ? angle : angle / 2;
    return `translateY(${dy.toFixed(1)}px) rotate(${rotation.toFixed(1)}deg)`;
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}

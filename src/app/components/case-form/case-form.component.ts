import { Component, input, output, computed } from '@angular/core';
import { CaseData } from '../../models/card.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-case-form',
  imports: [IconComponent],
  templateUrl: './case-form.component.html',
  styleUrl: './case-form.component.scss',
})
export class CaseFormComponent {
  caseData = input.required<CaseData>();
  caseIndex = input.required<number>();
  totalCases = input.required<number>();
  showAlarms = input(false);
  caseChange = output<CaseData>();

  isTop = computed(() => this.caseIndex() === 0);
  isBottom = computed(() => this.caseIndex() === this.totalCases() - 1);

  label = computed(() => {
    if (this.isTop()) return 'Airport';
    if (this.isBottom()) return 'Clouds';
    return `Case ${this.caseIndex()}`;
  });

  readonly directionIndices = [0, 1, 2, 3, 4];
  readonly planeSlots = [0, 1, 2];
  readonly diceSlots = [0, 1, 2, 3];
  readonly alarmSlots = [0, 1, 2];

  dirTransform(i: number, active: boolean): string {
    const R = 18;
    const step = 7;
    const dx = (i - 2) * step;
    const dy = R - Math.sqrt(R * R - dx * dx);
    const angle = Math.asin(dx / R) * (180 / Math.PI);
    const rotation = active ? angle : angle / 2;
    return `translateY(${dy.toFixed(1)}px) rotate(${rotation.toFixed(1)}deg)`;
  }

  toggleDirection(index: number) {
    const dir = [...this.caseData().direction];
    if (dir[index]) {
      dir[index] = false;
    } else {
      if (dir.filter(Boolean).length >= 3) return;
      dir[index] = true;
    }
    this.caseChange.emit({ ...this.caseData(), direction: dir });
  }

  clickPlane(slot: number) {
    const next = this.caseData().planes === slot + 1 ? 0 : slot + 1;
    this.caseChange.emit({ ...this.caseData(), planes: next });
  }

  clickDice(slot: number) {
    const next = this.caseData().dices === slot + 1 ? 0 : slot + 1;
    this.caseChange.emit({ ...this.caseData(), dices: next });
  }

  clickAlarm(slot: number) {
    const next = this.caseData().alarms === slot + 1 ? 0 : slot + 1;
    this.caseChange.emit({ ...this.caseData(), alarms: next });
  }

  toggleFullTrust() {
    this.caseChange.emit({ ...this.caseData(), fullTrust: !this.caseData().fullTrust });
  }
}

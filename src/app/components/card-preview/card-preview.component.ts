import { Component, input, computed } from '@angular/core';
import { CardData, Difficulty } from '../../models/card.model';
import { CardTitleComponent } from '../card-title/card-title.component';
import { CardCaseComponent } from '../card-case/card-case.component';
import { CardFooterComponent } from '../card-footer/card-footer.component';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  green:  '#4CAF50',
  yellow: '#F5C518',
  red:    '#E53935',
  black:  '#1a1a1a',
};

@Component({
  selector: 'app-card-preview',
  imports: [CardTitleComponent, CardCaseComponent, CardFooterComponent],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss',
})
export class CardPreviewComponent {
  card = input.required<CardData>();
  lightVersion = input(false);

  middleCases = computed(() => {
    const cases = this.card().cases;
    return cases.slice(1, cases.length - 1);
  });

  topCase    = computed(() => this.card().cases[0]);
  bottomCase = computed(() => this.card().cases[this.card().cases.length - 1]);
  showAlarms = computed(() => this.card().scenarioModules.includes('alarms'));

  casesBackground = computed(() => {
    const color = this.getColorForDifficulty(this.card().difficulty);
    return `linear-gradient(to bottom, ${color} 0%, #666 2.75cm)`;
  });

  getColorForDifficulty(difficulty: Difficulty){
    return DIFFICULTY_COLORS[difficulty];
  }
}

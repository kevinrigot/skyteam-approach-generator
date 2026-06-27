import { Component, output, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { CardData } from '../../models/card.model';
import { ApproachCardsService } from '../../services/approach-cards.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-public-cards-dialog',
  imports: [NgClass, IconComponent],
  templateUrl: './public-cards-dialog.component.html',
  styleUrl: './public-cards-dialog.component.scss',
})
export class PublicCardsDialogComponent {
  close = output<void>();
  select = output<CardData>();

  private svc = inject(ApproachCardsService);
  cards = signal<CardData[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor() {
    this.svc.getAll().then(cards => {
      this.cards.set(cards.sort((a, b) => a.titleFull.localeCompare(b.titleFull)));
      this.loading.set(false);
    }).catch(() => {
      this.error.set(true);
      this.loading.set(false);
    });
  }

  pick(card: CardData) {
    this.select.emit(card);
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.close.emit();
    }
  }
}

import { Injectable } from '@angular/core';
import { CardData, defaultCard } from '../models/card.model';

const STORAGE_KEY = 'skyteam_cards';
const MAX_CARDS = 10;

@Injectable({ providedIn: 'root' })
export class CardStorageService {
  loadAll(): CardData[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  loadLast(): CardData {
    const cards = this.loadAll();
    return cards.length ? cards[cards.length - 1] : defaultCard();
  }

  save(card: CardData): void {
    let cards = this.loadAll().filter(c => c.id !== card.id);
    cards.push(card);
    if (cards.length > MAX_CARDS) {
      cards = cards.slice(cards.length - MAX_CARDS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  delete(id: string): void {
    const cards = this.loadAll().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }
}

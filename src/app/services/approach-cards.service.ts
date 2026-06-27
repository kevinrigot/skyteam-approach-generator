import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { CardData } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class ApproachCardsService {
  private db = getFirestore();

  async getAll(): Promise<CardData[]> {
    const snap = await getDocs(collection(this.db, 'approach_cards'));
    return snap.docs.map(d => d.data() as CardData);
  }
}

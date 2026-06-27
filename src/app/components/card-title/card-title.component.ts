import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { CardData } from '../../models/card.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card-title',
  imports: [NgClass, IconComponent],
  templateUrl: './card-title.component.html',
  styleUrl: './card-title.component.scss',
})
export class CardTitleComponent {
  card = input.required<CardData>();
}

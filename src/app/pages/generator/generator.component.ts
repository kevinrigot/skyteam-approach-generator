import {
  Component, signal, effect, Injector, inject,
  ViewChild, ElementRef, AfterViewInit, OnDestroy,
} from '@angular/core';
import { CardData, defaultCard } from '../../models/card.model';
import { CardFormComponent } from '../../components/card-form/card-form.component';
import { CardPreviewComponent } from '../../components/card-preview/card-preview.component';

@Component({
  selector: 'app-generator',
  imports: [CardFormComponent, CardPreviewComponent],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
})
export class GeneratorComponent implements AfterViewInit, OnDestroy {
  card = signal<CardData>(defaultCard());
  backCard = signal<CardData>(defaultCard());
  twinMode = signal(false);
  lightVersion = signal(false);
  previewScale = signal(2);

  @ViewChild('previewArea') previewAreaRef!: ElementRef<HTMLElement>;
  @ViewChild('cardPreview', { read: ElementRef }) cardPreviewRef!: ElementRef<HTMLElement>;

  private ro: ResizeObserver | null = null;
  private injector = inject(Injector);

  ngAfterViewInit() {
    this.ro = new ResizeObserver(() => this.recalcScale());
    this.ro.observe(this.previewAreaRef.nativeElement);

    effect(() => {
      this.card().cases.length;
      this.twinMode();
      requestAnimationFrame(() => this.recalcScale());
    }, { injector: this.injector });

    requestAnimationFrame(() => this.recalcScale());
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }

  private recalcScale() {
    const area = this.previewAreaRef?.nativeElement;
    const cardEl = this.cardPreviewRef?.nativeElement;
    if (!area || !cardEl) return;

    const singleW = cardEl.offsetWidth;
    const naturalW = this.twinMode() ? singleW * 2 + 2 : singleW;
    const naturalH = cardEl.offsetHeight;
    if (!naturalW || !naturalH) return;

    const padH = 80;
    const padW = 64;
    const availW = area.clientWidth - padW;
    const availH = area.clientHeight - padH;

    const scale = Math.min(availW / naturalW, availH / naturalH, 3);
    this.previewScale.set(Math.max(scale, 0.3));
  }

  onCardChange(updated: CardData) {
    this.card.set(updated);
  }

  onBackCardChange(card: CardData) {
    this.backCard.set(card);
  }

  onTwinModeChange(value: boolean) {
    this.twinMode.set(value);
  }

  onLightVersionChange(value: boolean) {
    this.lightVersion.set(value);
  }
}

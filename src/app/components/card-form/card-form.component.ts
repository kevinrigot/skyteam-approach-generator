import { Component, signal, computed, effect, output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, TitleCasePipe } from '@angular/common';
import { CardData, CaseData, Difficulty, ScenarioModuleType, defaultCard, defaultCase } from '../../models/card.model';
import { CardStorageService } from '../../services/card-storage.service';
import { ApproachCardsService } from '../../services/approach-cards.service';
import { CaseFormComponent } from '../case-form/case-form.component';
import { IconComponent } from '../icon/icon.component';
import { PublicCardsDialogComponent } from '../public-cards-dialog/public-cards-dialog.component';

interface ModuleOption {
  type: ScenarioModuleType;
  label: string;
  wide?: boolean;
  iconWidth?: number;
}

interface ModuleGroup {
  label: string;
  options: ModuleOption[];
}

@Component({
  selector: 'app-card-form',
  imports: [FormsModule, NgClass, TitleCasePipe, CaseFormComponent, IconComponent, PublicCardsDialogComponent],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.scss',
})
export class CardFormComponent {
  cardChange = output<CardData>();
  lightVersionChange = output<boolean>();
  twinModeChange = output<boolean>();
  backCardChange = output<CardData>();

  lightVersion = signal(false);
  activeTab = signal<'front' | 'back'>('front');

  private storage = inject(CardStorageService);
  private approachCards = inject(ApproachCardsService);
  showPublicDialog = signal(false);

  private _last = this.storage.loadLast();
  card = signal<CardData>({ ...this._last, backCard: undefined });
  backCard = signal<CardData>(this._last.backCard ?? defaultCard());
  twinMode = signal(!!this._last.backCard);
  savedCards = signal<CardData[]>(this.storage.loadAll());

  readonly difficulties: Difficulty[] = ['green', 'yellow', 'red', 'black'];

  readonly moduleGroups: ModuleGroup[] = [
    {
      label: 'Altitude',
      options: [
        { type: 'altitude_5000', label: 'Altitude 5000', wide: true, iconWidth: 34 },
        { type: 'altitude_a', label: 'Altitude A' },
        { type: 'altitude_b', label: 'Altitude B' },
        { type: 'altitude_c', label: 'Altitude C' },
        { type: 'altitude_d', label: 'Altitude D' },
      ],
    },
    {
      label: 'Modules',
      options: [
        { type: 'capability1', label: 'Capability 1' },
        { type: 'capability2', label: 'Capability 2' },
        { type: 'fuel', label: 'Fuel' },
        { type: 'fuel_leakage', label: 'Fuel Leakage' },
        { type: 'wind', label: 'Wind' },
        { type: 'reverse_wind', label: 'Reverse Wind' },
        { type: 'intern', label: 'Intern' },
        { type: 'time', label: 'Time' },
        { type: 'ice_brake', label: 'Ice Brake' },
        { type: 'alarms', label: 'Alarms' },
        { type: 'specific_rules', label: 'Specific Rules' },
      ],
    },
  ];

  private readonly mutexGroups: ScenarioModuleType[][] = [
    ['altitude_a', 'altitude_b', 'altitude_c', 'altitude_d'],
    ['wind', 'reverse_wind'],
    ['fuel', 'fuel_leakage'],
    ['capability1', 'capability2'],
  ];

  activeCard = computed(() => this.activeTab() === 'front' ? this.card() : this.backCard());
  casesCount = computed(() => this.card().cases.length);

  constructor() {
    effect(() => {
      const c = this.twinMode()
        ? { ...this.card(), backCard: this.backCard() }
        : { ...this.card(), backCard: undefined };
      this.storage.save(c);
      this.savedCards.set(this.storage.loadAll());
      this.cardChange.emit(this.card());
    });

    effect(() => {
      this.twinModeChange.emit(this.twinMode());
      if (this.twinMode()) {
        this.backCardChange.emit(this.backCard());
      }
    });
  }

  private updateActiveCard(fn: (c: CardData) => CardData) {
    if (this.activeTab() === 'front') this.card.update(fn);
    else this.backCard.update(fn);
  }

  setTitleAbbr(abbr: string) {
    this.card.update(c => ({ ...c, titleAbbr: abbr }));
    this.backCard.update(b => ({ ...b, titleAbbr: abbr }));
  }

  setTitleFull(full: string) {
    this.card.update(c => ({ ...c, titleFull: full }));
    this.backCard.update(b => ({ ...b, titleFull: full }));
  }

  setCardName(name: string) {
    this.card.update(c => ({ ...c, name }));
    this.backCard.update(b => ({ ...b, name }));
  }

  setDifficulty(d: Difficulty) {
    this.updateActiveCard(c => ({ ...c, difficulty: d }));
  }

  toggleModule(type: ScenarioModuleType) {
    this.updateActiveCard(c => {
      const has = c.scenarioModules.includes(type);
      if (has) {
        return { ...c, scenarioModules: c.scenarioModules.filter(m => m !== type) };
      }
      const mutex = this.mutexGroups.find(g => g.includes(type)) ?? [];
      const filtered = c.scenarioModules.filter(m => !mutex.includes(m));
      return { ...c, scenarioModules: [...filtered, type] };
    });
  }

  isModuleActive(type: ScenarioModuleType): boolean {
    return this.activeCard().scenarioModules.includes(type);
  }

  setCasesCount(n: number) {
    const syncCases = (current: CaseData[]) => {
      if (n > current.length) {
        const extras = Array.from({ length: n - current.length }, () => defaultCase());
        return [...current, ...extras];
      }
      return current.slice(0, n);
    };
    this.card.update(c => ({ ...c, cases: syncCases(c.cases) }));
    this.backCard.update(b => ({ ...b, cases: syncCases(b.cases) }));
  }

  updateCase(index: number, updated: CaseData) {
    this.updateActiveCard(c => {
      const cases = [...c.cases];
      cases[index] = updated;
      return { ...c, cases };
    });
  }

  openPublicDialog() {
    this.showPublicDialog.set(true);
  }

  closePublicDialog() {
    this.showPublicDialog.set(false);
  }

  loadPublicCard(card: CardData) {
    const localCard: CardData = { ...card, id: crypto.randomUUID(), publicCardId: card.id, backCard: undefined };
    this.card.set(localCard);
    if (card.backCard) {
      this.backCard.set({ ...card.backCard, id: crypto.randomUUID(), publicCardId: card.backCard.id });
      this.twinMode.set(true);
    } else {
      this.backCard.set(defaultCard());
      this.twinMode.set(false);
    }
    this.activeTab.set('front');
    this.closePublicDialog();
  }

  newCard() {
    this.card.set(defaultCard());
    this.twinMode.set(false);
    this.activeTab.set('front');
  }

  loadCard(saved: CardData) {
    this.card.set({ ...saved, backCard: undefined });
    if (saved.backCard) {
      this.backCard.set(saved.backCard);
      this.twinMode.set(true);
    } else {
      this.backCard.set(defaultCard());
      this.twinMode.set(false);
    }
    this.activeTab.set('front');
  }

  deleteCard(id: string, event: Event) {
    event.stopPropagation();
    this.storage.delete(id);
    this.savedCards.set(this.storage.loadAll());
    if (this.card().id === id) {
      const remaining = this.savedCards();
      this.card.set(remaining.length ? remaining[remaining.length - 1] : defaultCard());
      this.twinMode.set(false);
      this.activeTab.set('front');
    }
  }

  toggleLightVersion() {
    const next = !this.lightVersion();
    this.lightVersion.set(next);
    this.lightVersionChange.emit(next);
  }

  selectFrontTab() {
    this.activeTab.set('front');
  }

  selectBackTab() {
    if (this.twinMode() && this.activeTab() === 'back') {
      this.twinMode.set(false);
      this.activeTab.set('front');
    } else {
      if (!this.twinMode()) {
        this.twinMode.set(true);
        this.backCard.set({ ...this.card(), id: crypto.randomUUID(), backCard: undefined });
      }
      this.activeTab.set('back');
    }
  }

  print() {
    window.print();
  }
}

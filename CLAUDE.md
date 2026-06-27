# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
ng serve           # same as above
ng build           # production build → dist/
ng test            # run unit tests with Vitest
ng generate component components/my-component --standalone --skip-tests
```

The project uses Angular CLI 22 with Vitest as the test runner. `skipTests: true` is set for all schematics in `angular.json`, so `--skip-tests` is already the default.

## Architecture

**Purpose:** Printable card generator for the SkyTeam board game. No backend — all state lives in `localStorage` (max 10 cards).

**Stack:** Angular 22, standalone components, SCSS, signals-first (no NgRx/RxJS for state). SVG icons are loaded from `public/icons/*.svg` via HTTP and cached by `IconCacheService`.

**Routing** (`src/app/app.routes.ts`):
- `/` → `LandingComponent` (splash page with CTA)
- `/generator` → `GeneratorComponent` (two-panel layout)

**Component tree:**

```
GeneratorComponent
├── CardFormComponent          ← left panel, owns all card signals
│   └── CaseFormComponent      ← repeated per case
└── CardPreviewComponent       ← right panel, pure display, signal inputs
    ├── CardTitleComponent
    ├── CardCaseComponent
    └── CardFooterComponent
```

**Signal flow:** `CardFormComponent` owns `card`, `backCard`, `twinMode`, and `lightVersion` as signals. It emits these via `output()` to `GeneratorComponent`, which passes them down to `CardPreviewComponent` as `input()`. Immutable updates only: always `signal.update(c => ({ ...c, field: value }))`.

**Twin mode:** When enabled, the generator shows a double-sided card (front + back). The back card shares `titleAbbr`/`titleFull`/`name` with the front but has its own difficulty, scenario modules, and cases. The `casesCount` control drives both cards simultaneously.

**Mutex groups** (`card-form.component.ts:75`): Certain scenario modules are mutually exclusive — selecting one auto-removes its mutex siblings:
- `altitude_a/b/c/d`
- `wind` / `reverse_wind`
- `fuel` / `fuel_leakage`
- `capability1` / `capability2`

**Icon system:** `IconComponent` takes a `name` input, fetches `/icons/{name}.svg` via `IconCacheService` (HTTP + in-memory cache), and renders via `[innerHTML]` with `DomSanitizer.bypassSecurityTrustHtml`. SVG files live in `public/icons/`. Adding a new icon = drop the `.svg` file there; no code changes needed.

**Physical dimensions:** The card preview uses `width: 5cm` so it prints at exact physical size. `GeneratorComponent` uses a `ResizeObserver` to compute a `previewScale` transform so the card fills the right panel at any screen size — at print time the transform is removed by `styles.scss` (`@media print`).

**Data model** (`src/app/models/card.model.ts`):
- `CardData` — top-level card; `backCard?: CardData` stores the twin
- `CaseData` — one row: `planes` (0–3), `dices` (0–4), `direction` (5 booleans: `true`=arrow↓, `false`=✕), `alarms` (0–3), `fullTrust` (boolean)
- `Difficulty` — `'green' | 'yellow' | 'red' | 'black'`

**Persistence:** `CardStorageService` reads/writes `localStorage` under key `skyteam_cards` (JSON array, max 10 entries, oldest evicted). Auto-save is wired in `CardFormComponent`'s `effect()` constructor.

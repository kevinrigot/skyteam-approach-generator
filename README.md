# Skyteam Approach Generator

A printable approach card generator for the SkyTeam board game. No backend — cards are stored locally in `localStorage` (max 10).

## Stack

- Angular 22, standalone components, signals-first state
- SCSS

## Development

```bash
npm start        # dev server at http://localhost:4200
ng build         # production build → dist/
ng test          # run unit tests
```

## Generating components

```bash
ng generate component components/my-component --standalone
```

(`skipTests` is set as the default in `angular.json`, so `--skip-tests` is not needed.)

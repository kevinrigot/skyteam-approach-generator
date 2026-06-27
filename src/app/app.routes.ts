import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'generator',
    loadComponent: () =>
      import('./pages/generator/generator.component').then(m => m.GeneratorComponent),
  },
  { path: '**', redirectTo: '' },
];

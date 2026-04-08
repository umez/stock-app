import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full',
  },
  {
    path: 'stock',
    loadComponent: () => import('./features/stock/page').then((m) => m.Page),
  },
];

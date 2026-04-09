import { Routes } from '@angular/router';
import { Layout } from './layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'stock',
        pathMatch: 'full',
      },
      {
        path: 'stock',
        loadComponent: () => import('../features/stock/page').then(m => m.Page)
      }
    ],
  },
];

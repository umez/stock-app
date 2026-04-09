import { Route } from '@angular/router';
import { Layout } from './layout/layout';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./layout/layout.routes').then((m) => m.routes)
  },

];

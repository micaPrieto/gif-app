import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent:() => import('./gifs/pages/dashboard-page/dashboard-page.component'),
    // Si quiero que sea solo cargado bajo demanda

      children: [ //arreglo de RUTAS HIJAS
        {
          path: 'trending',
          loadComponent:() => import('./gifs/pages/trending-page/trending-page.component')
        },
        {
          path: 'search',
          loadComponent:() => import('./gifs/pages/search-page/search-page.component')
        },
        {
          path: 'history/:query',
          loadComponent:() => import('./gifs/pages/gif-history/gif-history.component')
        },
        {
          path: '**',
          redirectTo: 'trending'
        },
      ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

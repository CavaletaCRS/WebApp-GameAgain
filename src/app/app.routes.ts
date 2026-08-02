import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Game Again - Videogiochi usati',
    loadComponent: () =>
      import('./pages/home/home').then((component) => component.Home),
  },
  {
    path: 'categoria/:category',
    title: 'Categoria - Game Again',
    loadComponent: () =>
      import('./pages/category/category').then(
        (component) => component.Category,
      ),
  },
  {
    path: '**',
    title: 'Pagina non trovata - Game Again',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(
        (component) => component.NotFound,
      ),
  },
];
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    title: 'Carrello - Game Again',
    loadComponent: () => import('./carrello').then(component => component.Carrello),
  },
  {
    path: 'checkout',
    title: 'Riepilogo e spedizione - Game Again',
    loadComponent: () => import('../checkout/checkout').then(component => component.Checkout),
  },
] satisfies Routes;

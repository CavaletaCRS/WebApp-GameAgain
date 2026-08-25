import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Game Again - Videogiochi usati',
    loadComponent: () =>
      import('./pages/home/home').then((component) => component.Home),
  },
  {
    path: 'playstation',
    title: 'PlayStation - Game Again',
    loadComponent: () =>
      import('./pages/playstation/home-play/home-play').then(
        (component) => component.HomePlay,
      ),
  },
  {
    path: 'playstation/ps1',
    title: 'PlayStation 1 - Game Again',
    loadComponent: () =>
      import('./pages/playstation/play1/play1').then((component) => component.Play1),
  },
  {
    path: 'playstation/ps2',
    title: 'PlayStation 2 - Game Again',
    loadComponent: () =>
      import('./pages/playstation/play2/play2').then((component) => component.Play2),
  },
  {
    path: 'playstation/ps3',
    title: 'PlayStation 3 - Game Again',
    loadComponent: () =>
      import('./pages/playstation/play3/play3').then((component) => component.Play3),
  },
  {
    path: 'playstation/ps4',
    title: 'PlayStation 4 - Game Again',
    loadComponent: () =>
      import('./pages/playstation/play4/play4').then((component) => component.Play4),
  },
  {
    path: 'nintendo',
    title: 'Nintendo - Game Again',
    loadComponent: () =>
      import('./pages/nintendo/home-nintendo/home-nintendo').then(
        (component) => component.HomeNintendo,
      ),
  },
  {
    path: 'nintendo/gameboy',
    title: 'Game Boy - Game Again',
    loadComponent: () =>
      import('./pages/nintendo/gameboy/gameboy').then((component) => component.Gameboy),
  },
  {
    path: 'nintendo/gameboy-advance',
    title: 'Game Boy Advance - Game Again',
    loadComponent: () =>
      import('./pages/nintendo/gameboy-advance/gameboy-advance').then(
        (component) => component.GameboyAdvance,
      ),
  },
  {
    path: 'nintendo/ds-3ds',
    title: 'Nintendo DS e 3DS - Game Again',
    loadComponent: () =>
      import('./pages/nintendo/nintendo-ds-treds/nintendo-ds-treds').then(
        (component) => component.NintendoDsTreds,
      ),
  },
  {
    path: 'nintendo/switch',
    title: 'Nintendo Switch - Game Again',
    loadComponent: () =>
      import('./pages/nintendo/switch/switch').then((component) => component.Switch),
  },
  {
    path: 'carte-collezionabili',
    title: 'Carte collezionabili - Game Again',
    loadComponent: () =>
      import('./pages/carteCollezionabili/home-carte/home-carte').then(
        (component) => component.HomeCarte,
      ),
  },
  {
    path: 'carte-collezionabili/pokemon',
    title: 'Carte Pokemon - Game Again',
    loadComponent: () =>
      import('./pages/carteCollezionabili/pokemon/pokemon').then(
        (component) => component.Pokemon,
      ),
  },
  {
    path: 'carte-collezionabili/varie',
    title: 'Carte collezionabili - Game Again',
    loadComponent: () =>
      import('./pages/carteCollezionabili/varie/varie').then(
        (component) => component.Varie,
      ),
  },
  {
    path: 'miniature-oggettistica',
    title: 'Miniature e oggettistica - Game Again',
    loadComponent: () =>
      import(
        './pages/miniature-oggettistica/miniature-oggettistica/miniature-oggettistica'
      ).then((component) => component.MiniatureOggettistica),
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
    path: 'chisiamo',
    title: 'Chi siamo',
    loadComponent: () =>
      import('./pages/chiSiamo/chi-siamo/chi-siamo').then(
        (component) => component.ChiSiamo,
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

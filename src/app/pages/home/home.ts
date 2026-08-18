import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  CarouselGame,
  CarouselGamecard,
} from '../../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';

interface BootstrapCarouselInstance {
  cycle(): void;
  dispose(): void;
}

declare const bootstrap: {
  Carousel: {
    getOrCreateInstance(
      element: HTMLElement,
      options: { interval: number; pause: boolean; ride: string }
    ): BootstrapCarouselInstance;
  };
};

@Component({
  selector: 'app-home',
  imports: [NgFor, CarouselGamecard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {

  @ViewChild('carouselElement') carouselElement!: ElementRef<HTMLElement>;

  private carousel?: BootstrapCarouselInstance;

  photos = [
    { src: 'img/foto_console.png', alt: 'Console per videogiochi' },
    { src: 'img/foto_nostalgia.png', alt: 'Videogiochi nostalgici' },
    { src: 'img/foto_promo.png', alt: 'Promozioni Game Again' }
  ];

  featuredGames: CarouselGame[] = [
    {
      title: 'Asteroids',
      condition: 'Usato',
      price: '24,99 €',
      image: 'img/ps1-Asteroids.png',
    },
    {
      title: 'Crash Bandicoot Warped',
      condition: 'Usato',
      price: '34,99 €',
      image: 'img/ps1-CrashBandicootWarped.png',
    },
    {
      title: 'Toonenstein',
      condition: 'Usato',
      price: '19,99 €',
      image: 'img/ps1-Toonenstein.png',
    },
    {
      title: 'Asteroids',
      condition: 'Usato',
      price: '24,99 €',
      image: 'img/ps1-Asteroids.png',
    },
    {
      title: 'Crash Bandicoot Warped',
      condition: 'Usato',
      price: '34,99 €',
      image: 'img/ps1-CrashBandicootWarped.png',
    },
    {
      title: 'Toonenstein',
      condition: 'Usato',
      price: '19,99 €',
      image: 'img/ps1-Toonenstein.png',
    },
  ];

  categories = [
    {
      name: 'Giochi',
      icon: 'img/IconSet_GamesAllPlatforms.svg',
      link: '#',
    },
    {
      name: 'Console',
      icon: 'img/IconSet_Playstation5Consoles.svg',
      link: '#',
    },
    {
      name: 'Controller e accessori',
      icon: 'img/IconSet_PlayStationAccessoriesGeneric.svg',
      link: '#',
    },
    {
      name: 'Miniature e oggettistica',
      icon: 'img/icons8-preferiti-50.png',
      link: '#',
    },
    {
      name: 'Carte collezionabili',
      icon: 'img/icons8-puntatore-50.png',
      link: '#',
    },
  ];

  ngAfterViewInit(): void {
    this.carousel = bootstrap.Carousel.getOrCreateInstance(this.carouselElement.nativeElement, {
      interval: 5000,
      pause: false,
      ride: 'carousel'
    });

    this.carousel.cycle();
  }

  ngOnDestroy(): void {
    this.carousel?.dispose();
  }
}

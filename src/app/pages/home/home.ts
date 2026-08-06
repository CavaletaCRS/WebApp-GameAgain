import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';

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
  imports: [NgFor],
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

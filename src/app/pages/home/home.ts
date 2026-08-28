import {
  AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild
  } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  CarouselGame,
  CarouselGamecard,
} from '../../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { Product } from '../../models/product.model';
import { ProductService } from '../../service/product.service';

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

export class Home implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('carouselElement') carouselElement!: ElementRef<HTMLElement>;

  private carousel?: BootstrapCarouselInstance;
  private productService = inject(ProductService);

  products: Product[] = [];

  constructor() {
    this.productService = inject(ProductService);
  }


  photos = [
    { src: 'img/foto_console.png', alt: 'Console per videogiochi' },
    { src: 'img/foto_nostalgia.png', alt: 'Videogiochi nostalgici' },
    { src: 'img/foto_promo.png', alt: 'Promozioni Game Again' }
  ];

  featuredGames: CarouselGame[] = [];

  
  categories = [
    {
      name: 'Giochi',
      icon: 'img/cd_logo.png',
      link: '#',
    },
    {
      name: 'Console',
      icon: 'img/console_logo.png',
      link: '#',
    },
    {
      name: 'Controller e accessori',
      icon: 'img/controller_logo.png',
      link: '#',
    },
    {
      name: 'Miniature e oggettistica',
      icon: 'img/cuore_logo.png',
      link: '#',
    },
    // {
    //   name: 'Carte collezionabili',
    //   icon: 'img/poke_logo.png',
    //   link: '#',
    // },
  ];

  async ngOnInit(): Promise<void> {

    const products = await this.productService.getProducts();
 
    
    this.featuredGames = products.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));
    console.log('Prodotti recuperati:', this.featuredGames);

  }

   private formatPrice(price: number | string | null | undefined): string {
    const numericPrice = Number(price);

    if (price == null || !Number.isFinite(numericPrice)) {
      return 'Prezzo non disponibile';
    }

    return numericPrice.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });
  }

  private resolveImagePath(image: string): string {
    const path = image.trim().replaceAll('\\', '/');
    const driveFileId = path.match(
      /^https?:\/\/drive\.google\.com\/file\/d\/([^/?]+)/i
    )?.[1];

    if (driveFileId) {
      return `https://lh3.googleusercontent.com/d/${driveFileId}=w1200`;
    }

    if (/^(https?:|data:|blob:)/i.test(path)) {
      return path;
    }

    return `/${path
      .replace(/^\.\//, '')
      .replace(/^public\//, '')
      .replace(/^\/+/, '')}`;
  }

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

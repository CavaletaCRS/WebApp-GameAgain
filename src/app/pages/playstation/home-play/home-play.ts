import { Component, inject } from '@angular/core';
import {
  CarouselGame,
  CarouselGamecard,
} from '../../../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-home-play',
  imports: [CarouselGamecard],
  templateUrl: './home-play.html',
  styleUrl: './home-play.scss',
})
export class HomePlay {

  private readonly productService = inject(ProductService);

  featuredGames: CarouselGame[] = [];
  gamesPlayStation1: CarouselGame[] = [];
  gamesPlayStation2: CarouselGame[] = [];
  gamesPlayStation3: CarouselGame[] = [];
  gamesPlayStation4: CarouselGame[] = [];

  async ngOnInit(): Promise<void> {
    const [
      products,
      productsPlayStation1,
      productsPlayStation2,
      productsPlayStation3,
      productsPlayStation4,
    ] = await Promise.all([
      this.productService.getProducts({ brand: 'Playstation' }),
      this.productService.getProducts({ brand: 'Playstation', platform: 'Playstation 1' }),
      this.productService.getProducts({ brand: 'Playstation', platform: 'Playstation 2' }),
      this.productService.getProducts({ brand: 'Playstation', platform: 'Playstation 3' }),
      this.productService.getProducts({ brand: 'Playstation', platform: 'Playstation 4' }),
    ]);

    this.featuredGames = products.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesPlayStation1 = productsPlayStation1.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesPlayStation2 = productsPlayStation2.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesPlayStation3 = productsPlayStation3.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesPlayStation4 = productsPlayStation4.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    console.log('Featured Games:', this.featuredGames);
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
  // featuredGames: CarouselGame[] = [
  //     {
  //       title: 'Asteroids',
  //       condition: 'Usato',
  //       price: '24,99 €',
  //       image: 'img/ps1-Asteroids.png',
  //     },
  //     {
  //       title: 'Crash Bandicoot Warped',
  //       condition: 'Usato',
  //       price: '34,99 €',
  //       image: 'img/ps1-CrashBandicootWarped.png',
  //     },
  //     {
  //       title: 'Toonenstein',
  //       condition: 'Usato',
  //       price: '19,99 €',
  //       image: 'img/ps1-Toonenstein.png',
  //     },
  //     {
  //       title: 'Asteroids',
  //       condition: 'Usato',
  //       price: '24,99 €',
  //       image: 'img/ps1-Asteroids.png',
  //     },
  //     {
  //       title: 'Crash Bandicoot Warped',
  //       condition: 'Usato',
  //       price: '34,99 €',
  //       image: 'img/ps1-CrashBandicootWarped.png',
  //     },
  //     {
  //       title: 'Toonenstein',
  //       condition: 'Usato',
  //       price: '19,99 €',
  //       image: 'img/ps1-Toonenstein.png',
  //     },
  //   ];
  
}

import { Component, inject, OnInit } from '@angular/core';
import {
  CarouselGame,
  CarouselGamecard,
} from '../../../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { ProductService } from '../../../service/product.service';


@Component({
  selector: 'app-home-nintendo',
  imports: [CarouselGamecard],
  templateUrl: './home-nintendo.html',
  styleUrl: './home-nintendo.scss',
})
export class HomeNintendo implements OnInit {
  private readonly productService = inject(ProductService);

  featuredGames: CarouselGame[] = [];
  gamesGameBoy: CarouselGame[] = [];
  gamesGameBoyAdvance: CarouselGame[] = [];
  gamesNintendoDS3DS: CarouselGame[] = [];
  gamesNintendoSwitch: CarouselGame[] = [];

  async ngOnInit(): Promise<void> {
    const [
      products,
      productsGameBoy,
      productsGameBoyAdvance,
      productsNintendoDS3DS,
      productsNintendoSwitch,
    ] = await Promise.all([
      this.productService.getProducts({ brand: 'Nintendo' }),
      this.productService.getProducts({ brand: 'Nintendo', platform: 'Game Boy' }),
      this.productService.getProducts({ brand: 'Nintendo', platform: 'Game Boy Advance' }),
      this.productService.getProducts({ brand: 'Nintendo', platform: 'Nintendo DS/DS3' }),
      this.productService.getProducts({ brand: 'Nintendo', platform: 'Nintendo Switch' }),
    ]);

    this.featuredGames = products.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesGameBoy = productsGameBoy.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesGameBoyAdvance = productsGameBoyAdvance.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesNintendoDS3DS = productsNintendoDS3DS.map(product => ({
      title: product.name,
      condition: product.condition,
      price: this.formatPrice(product.price),
      image: this.resolveImagePath(product.image),
      description: product.description,
    }));

    this.gamesNintendoSwitch = productsNintendoSwitch.map(product => ({
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

  /*
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
  */
}

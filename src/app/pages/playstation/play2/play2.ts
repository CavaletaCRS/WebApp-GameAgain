import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { CarouselGame } from '../../../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { GameCard } from '../../../shared/components/game-card/game-card';

@Component({
  selector: 'app-play2',
  imports: [GameCard],
  templateUrl: './play2.html',
  styleUrl: './play2.scss',
})
export class Play2 implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  gamesPlayStation2: CarouselGame[] = [];
  loading = true;
  loadError = false;

  async ngOnInit(): Promise<void> {
    try {
      const products = await this.productService.getProducts({
        brand: 'Playstation',
        platform: 'Playstation 2',
      });

      this.gamesPlayStation2 = products.map(product => ({
        title: product.name,
        condition: product.condition,
        price: this.formatPrice(product.price),
        image: this.resolveImagePath(product.image),
        description: product.description,
      }));
    } catch {
      this.loadError = true;
    } finally {
      this.loading = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  private formatPrice(price: number | string | null | undefined): string {
    const numericPrice = Number(price);
    if (price == null || !Number.isFinite(numericPrice)) return 'Prezzo non disponibile';
    return numericPrice.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
  }

  private resolveImagePath(image: string): string {
    const path = image.trim().replaceAll('\\', '/');
    const driveFileId = path.match(/^https?:\/\/drive\.google\.com\/file\/d\/([^/?]+)/i)?.[1];
    if (driveFileId) return `https://lh3.googleusercontent.com/d/${driveFileId}=w600`;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `/${path.replace(/^\.\//, '').replace(/^public\//, '').replace(/^\/+/, '')}`;
  }
}

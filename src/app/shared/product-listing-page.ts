import { ChangeDetectorRef, Directive, inject } from '@angular/core';
import { ProductFilters } from '../models/product.model';
import { ProductService } from '../service/product.service';
import { CarouselGame } from './components/carousel-gamecard/carousel-gamecard/carousel-gamecard';

@Directive()
export abstract class ProductListingPage {
  private readonly productService = inject(ProductService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  games: CarouselGame[] = [];
  loading = true;
  loadError = false;

  protected async loadProducts(filters: ProductFilters): Promise<void> {
    this.loading = true;
    this.loadError = false;

    try {
      const products = await this.productService.getProducts(filters);
      this.games = products.map(product => ({
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

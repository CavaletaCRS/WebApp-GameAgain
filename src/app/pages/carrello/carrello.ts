import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-carrello',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './carrello.html',
  styleUrl: './carrello.scss',
})
export class Carrello {
  readonly cartService = inject(CartService);
  readonly pageSize = 10;
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.cartService.items().length / this.pageSize)));
  readonly currentPage = linkedSignal<number, number>({
    source: this.pageCount,
    computation: (count, previous) => Math.min(previous?.value ?? 1, count),
  });
  readonly visibleItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.cartService.items().slice(start, start + this.pageSize);
  });

  changePage(page: number): void {
    this.currentPage.set(Math.max(1, Math.min(page, this.pageCount())));
  }

  clearCart(): void {
    this.cartService.clear();
    this.currentPage.set(1);
  }
}

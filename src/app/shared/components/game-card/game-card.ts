import { Component, Input, ViewChild } from '@angular/core';
import { CarouselGame } from '../carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { ProductDialog } from '../product-dialog/product-dialog';

@Component({
  selector: 'app-game-card',
  imports: [ProductDialog],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
})
export class GameCard {
  @ViewChild(ProductDialog) private productDialog!: ProductDialog;

  @Input() games: CarouselGame[] = [];
  @Input() productsPerPage = 20;

  selectedGame?: CarouselGame;
  currentPage = 1;

  get paginatedGames(): CarouselGame[] {
    const firstProduct = (this.currentPage - 1) * this.productsPerPage;
    return this.games.slice(firstProduct, firstProduct + this.productsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.games.length / this.productsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  openProductDialog(game: CarouselGame): void {
    this.selectedGame = game;
    this.productDialog.open();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

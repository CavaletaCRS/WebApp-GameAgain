import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { ProductDialog } from '../../product-dialog/product-dialog';
import { CartService } from '../../../../service/cart.service';

export interface CarouselGame {
  title: string;
  condition: string;
  price: string;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-carousel-gamecard',
  imports: [NgFor, ProductDialog],
  templateUrl: './carousel-gamecard.html',
  styleUrl: './carousel-gamecard.scss',
})
export class CarouselGamecard implements AfterViewInit, OnDestroy {
  constructor(private readonly cartService: CartService) {}

  @ViewChild('cardTrack') private cardTrack!: ElementRef<HTMLElement>;
  @ViewChild(ProductDialog) private productDialog!: ProductDialog;

  @Input() games: CarouselGame[] = [];
  @Input() autoplayInterval = 4000;

  private autoplayTimer?: ReturnType<typeof setInterval>;
  selectedGame?: CarouselGame;

  openProductDialog(game: CarouselGame): void {
    this.selectedGame = game;
    this.stopAutoplay();
    this.productDialog.open();
  }

  addToCart(game: CarouselGame): void {
    this.cartService.add(game);
  }

  ngAfterViewInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.stopAutoplay();

    if (this.autoplayInterval <= 0) {
      return;
    }

    this.autoplayTimer = setInterval(() => this.scroll(1), this.autoplayInterval);
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  scroll(direction: -1 | 1): void {
    const track = this.cardTrack.nativeElement;
    const card = track.querySelector<HTMLElement>('.game-card');
    const gap = 16;
    const distance = card ? card.offsetWidth + gap : track.clientWidth;
    const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    const reachedStart = track.scrollLeft <= 1;

    if (direction === 1 && reachedEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (direction === -1 && reachedStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      return;
    }

    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  }
}

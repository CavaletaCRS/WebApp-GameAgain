import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CarouselGame } from '../carousel-gamecard/carousel-gamecard/carousel-gamecard';

@Component({
  selector: 'app-game-card',
  imports: [],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
})
export class GameCard {
    @ViewChild('cardTrack') private cardTrack!: ElementRef<HTMLElement>;

  @Input() games: CarouselGame[] = [];
  @Input() autoplayInterval = 4000;

  private autoplayTimer?: ReturnType<typeof setInterval>;

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
  scroll(arg0: number) {
    throw new Error('Method not implemented.');
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  // scroll(direction: -1 | 1): void {
  //   const track = this.cardTrack.nativeElement;
  //   const card = track.querySelector<HTMLElement>('.game-card');
  //   const gap = 16;
  //   const distance = card ? card.offsetWidth + gap : track.clientWidth;
  //   const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  //   const reachedStart = track.scrollLeft <= 1;

  //   if (direction === 1 && reachedEnd) {
  //     track.scrollTo({ left: 0, behavior: 'smooth' });
  //     return;
  //   }

  //   if (direction === -1 && reachedStart) {
  //     track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
  //     return;
  //   }

  //   track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  // }
}


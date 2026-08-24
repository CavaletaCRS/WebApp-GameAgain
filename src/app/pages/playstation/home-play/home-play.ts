import { Component } from '@angular/core';
import {
  CarouselGame,
  CarouselGamecard,
} from '../../../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';

@Component({
  selector: 'app-home-play',
  imports: [CarouselGamecard],
  templateUrl: './home-play.html',
  styleUrl: './home-play.scss',
})
export class HomePlay {
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
  
}

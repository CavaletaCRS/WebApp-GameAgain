import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-gameboy-advance',
  imports: [GameCard],
  templateUrl: './gameboy-advance.html',
  styleUrl: './gameboy-advance.scss',
})
export class GameboyAdvance extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Nintendo', platform: 'Game Boy Advance' }); }
}

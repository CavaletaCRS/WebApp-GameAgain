import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-gameboy',
  imports: [GameCard],
  templateUrl: './gameboy.html',
  styleUrl: './gameboy.scss',
})
export class Gameboy extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Nintendo', platform: 'Game Boy' }); }
}

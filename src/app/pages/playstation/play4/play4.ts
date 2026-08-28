import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-play4',
  imports: [GameCard],
  templateUrl: './play4.html',
  styleUrl: './play4.scss',
})
export class Play4 extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Playstation', platform: 'Playstation 4' }); }
}

import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-play1',
  imports: [GameCard],
  templateUrl: './play1.html',
  styleUrl: './play1.scss',
})
export class Play1 extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Playstation', platform: 'Playstation 1' }); }
}

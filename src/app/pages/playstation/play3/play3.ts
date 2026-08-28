import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-play3',
  imports: [GameCard],
  templateUrl: './play3.html',
  styleUrl: './play3.scss',
})
export class Play3 extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Playstation', platform: 'Playstation 3' }); }
}

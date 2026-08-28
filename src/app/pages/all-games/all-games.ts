import { Component, OnInit } from '@angular/core';
import { ProductListingPage } from '../../shared/product-listing-page';
import { GameCard } from '../../shared/components/game-card/game-card';

@Component({
  selector: 'app-all-games',
  imports: [GameCard],
  templateUrl: './all-games.html',
  styleUrl: './all-games.scss',
})
export class AllGames extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ category: 'game' }); }
}

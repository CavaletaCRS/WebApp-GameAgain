import { Component, OnInit } from '@angular/core';
import { ProductListingPage } from '../../../shared/product-listing-page';
import { GameCard } from '../../../shared/components/game-card/game-card';

@Component({
  selector: 'app-miniature-oggettistica',
  imports: [GameCard],
  templateUrl: './miniature-oggettistica.html',
  styleUrl: './miniature-oggettistica.scss',
})
export class MiniatureOggettistica extends ProductListingPage implements OnInit {
   ngOnInit(): void { void this.loadProducts({ category: 'Miniature' }); }
}

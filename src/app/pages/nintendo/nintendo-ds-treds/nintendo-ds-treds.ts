import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-nintendo-ds-treds',
  imports: [GameCard],
  templateUrl: './nintendo-ds-treds.html',
  styleUrl: './nintendo-ds-treds.scss',
})
export class NintendoDsTreds extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Nintendo', platform: 'Nintendo DS/DS3' }); }
}

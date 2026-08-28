import { Component, OnInit } from '@angular/core';
import { GameCard } from '../../../shared/components/game-card/game-card';
import { ProductListingPage } from '../../../shared/product-listing-page';

@Component({
  selector: 'app-switch',
  imports: [GameCard],
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
})
export class Switch extends ProductListingPage implements OnInit {
  ngOnInit(): void { void this.loadProducts({ brand: 'Nintendo', platform: 'Nintendo Switch' }); }
}

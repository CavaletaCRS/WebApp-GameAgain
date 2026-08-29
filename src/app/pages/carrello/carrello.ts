import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-carrello',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './carrello.html',
  styleUrl: './carrello.scss',
})
export class Carrello {
  constructor(readonly cartService: CartService) {}
}

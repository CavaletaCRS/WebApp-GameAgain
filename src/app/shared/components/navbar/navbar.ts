import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../service/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(
    private readonly router: Router,
    readonly cartService: CartService,
  ) {}

  search(value: string): void {
    const query = value.trim();
    if (!query) return;

    void this.router.navigate(['/cerca'], { queryParams: { q: query } });
  }
}

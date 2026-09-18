import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  mobileSearchOpen = false;

  toggleSearch(input: HTMLInputElement): void {
    this.mobileSearchOpen = !this.mobileSearchOpen;
    if (this.mobileSearchOpen) setTimeout(() => input.focus());
  }

  constructor(
    private readonly router: Router,
    readonly cartService: CartService,
    readonly authService: AuthService,
  ) {}

  async logout(): Promise<void> {
    await this.authService.logout();
    void this.router.navigate(['/']);
  }

  search(value: string): void {
    const query = value.trim();
    if (!query) return;

    this.mobileSearchOpen = false;
    void this.router.navigate(['/cerca'], { queryParams: { q: query } });
  }
}

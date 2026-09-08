import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

describe('CartService', () => {
  const product = {
    title: 'Crash Bandicoot',
    condition: 'Usato',
    price: '19,99 €',
    image: '/img/crash.png',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: { user: signal(null).asReadonly() } },
      ],
    });
  });
  afterEach(() => localStorage.clear());

  it('clears only the visible cache when there is no authenticated user', () => {
    localStorage.setItem('game-again-cart', JSON.stringify([product]));
    localStorage.setItem('game-again-cart:user-1', JSON.stringify([product]));

    const cart = TestBed.inject(CartService);
    TestBed.tick();

    expect(cart.items()).toEqual([]);
    expect(cart.itemCount()).toBe(0);
    expect(localStorage.getItem('game-again-cart')).toBeNull();
    expect(localStorage.getItem('game-again-cart:user-1')).not.toBeNull();
  });
});

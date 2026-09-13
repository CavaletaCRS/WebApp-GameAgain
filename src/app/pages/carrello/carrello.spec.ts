import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartItem, CartService } from '../../service/cart.service';
import { Carrello } from './carrello';

describe('Carrello pagination', () => {
  const items = signal<CartItem[]>([]);
  const products = (count: number): CartItem[] => Array.from({ length: count }, (_, index) => ({
    key: String(index), title: `Gioco ${index + 1}`, condition: 'Usato',
    image: '/game.png', unitPrice: 10, quantity: 1,
  }));

  beforeEach(() => {
    registerLocaleData(localeIt);
    items.set([]);
    TestBed.configureTestingModule({
      imports: [Carrello],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: {
          items,
          itemCount: computed(() => items().length),
          total: computed(() => items().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)),
          remove: (key: string) => items.update(value => value.filter(item => item.key !== key)),
          clear: () => items.set([]),
        } },
      ],
    });
  });

  it('shows 15 products without pagination at the page boundary', () => {
    items.set(products(15));
    const fixture = TestBed.createComponent(Carrello);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.cart-item').length).toBe(15);
    expect(fixture.nativeElement.querySelector('.cart-pagination')).toBeNull();
  });

  it('navigates through all products while keeping the full cart total', () => {
    items.set(products(31));
    const fixture = TestBed.createComponent(Carrello);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const buttons = () => element.querySelectorAll<HTMLButtonElement>('.cart-pagination button');
    expect(buttons()[0].disabled).toBe(true);
    buttons()[1].click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.cart-item').length).toBe(15);
    expect(element.querySelector('.cart-item h2')?.textContent).toBe('Gioco 16');
    buttons()[1].click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.cart-item').length).toBe(1);
    expect(element.querySelector('.cart-item h2')?.textContent).toBe('Gioco 31');
    expect(buttons()[1].disabled).toBe(true);
    expect(element.querySelector('.summary-total strong')?.textContent).toContain('310,00');
    buttons()[0].click();
    fixture.detectChanges();
    expect(element.querySelector('.cart-item h2')?.textContent).toBe('Gioco 16');
  });

  it('returns to the preceding page when the last item is removed and resets after clearing', () => {
    items.set(products(16));
    const fixture = TestBed.createComponent(Carrello);
    fixture.componentInstance.changePage(2);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.remove-button').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.cart-item').length).toBe(15);
    expect(fixture.nativeElement.querySelector('.cart-pagination')).toBeNull();
    items.set(products(31));
    fixture.componentInstance.changePage(3);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.clear-button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state')).not.toBeNull();
    items.set(products(16));
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.cart-item').length).toBe(15);
  });
});

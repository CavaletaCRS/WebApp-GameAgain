import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../service/auth.service';
import { CartService } from '../../service/cart.service';
import { Checkout } from './checkout';

describe('Checkout demo', () => {
  const profile = { nome: 'Mario', cognome: 'Rossi', indirizzo: 'Via Roma 1', cap: '00100', citta: 'Roma', provincia: 'RM', stato: 'Italia', numeroTelefono: '3331234567' };
  const product = { key: 'game', title: 'Gioco', condition: 'Usato', image: '/game.png', unitPrice: 20, quantity: 2 };
  const items = signal([product]);
  const clear = vi.fn();

  beforeEach(() => {
    registerLocaleData(localeIt);
    items.set([product]);
    clear.mockReset();
    TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { user: signal({ uid: 'test-user' }), userProfile: signal(profile) } },
        { provide: CartService, useValue: { items, itemCount: () => 2, total: () => 40, clear } },
      ],
    });
  });

  async function setup() {
    const fixture = TestBed.createComponent(Checkout);
    fixture.detectChanges();
    await fixture.whenStable();
    const popup = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const showModal = vi.fn();
    popup.showModal = showModal;
    const form = fixture.debugElement.query(By.directive(NgForm))?.injector.get(NgForm);
    return { fixture, component: fixture.componentInstance, popup, showModal, form: form! };
  }

  it('prefills shipping and shows the full cart recap', async () => {
    const { fixture, component } = await setup();
    expect(component.shipping()).toEqual(profile);
    expect(fixture.nativeElement.querySelector('.recap').textContent).toContain('Quantità: 2');
    component.shipping().indirizzo = 'Via Milano 2';
    expect(profile.indirizzo).toBe('Via Roma 1');
  });

  it('requires confirmation and invalidates it when the address changes', async () => {
    const { component, form, popup, showModal } = await setup();
    component.completeOrder(form, popup);
    expect(showModal).not.toHaveBeenCalled();
    expect(component.errorMessage()).not.toBe('');
    component.confirmed = true;
    component.addressChanged();
    expect(component.confirmed).toBe(false);
  });

  it('opens only the demo popup and preserves the cart after confirmation', async () => {
    const { fixture, component, form, popup, showModal } = await setup();
    component.confirmed = true;
    fixture.detectChanges();
    await fixture.whenStable();
    component.completeOrder(form, popup);
    expect(showModal).toHaveBeenCalledOnce();
    expect(popup.textContent).toContain('NON SARÀ ACQUISTATO NÉ INVIATO NULLA');
    expect(clear).not.toHaveBeenCalled();
    expect(items()).toEqual([product]);
  });

  it('blocks incomplete shipping information', async () => {
    const { fixture, component, form, popup, showModal } = await setup();
    component.shipping().indirizzo = '   ';
    component.confirmed = true;
    fixture.detectChanges();
    await fixture.whenStable();
    component.completeOrder(form, popup);
    expect(showModal).not.toHaveBeenCalled();
  });

  it('shows an empty state without an order button when the cart is empty', async () => {
    items.set([]);
    const { fixture } = await setup();
    expect(fixture.nativeElement.querySelector('.empty-state')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });
});

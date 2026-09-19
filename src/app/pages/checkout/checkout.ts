import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly shipping = signal({
    nome: '', cognome: '', indirizzo: '', cap: '', citta: '',
    provincia: '', stato: 'Italia', numeroTelefono: '',
  });
  private readonly syncShipping = effect(() => {
    const profile = this.authService.userProfile();
    this.shipping.set({
      nome: profile?.nome ?? '',
      cognome: profile?.cognome ?? '',
      indirizzo: profile?.indirizzo ?? '',
      cap: profile?.cap ?? '',
      citta: profile?.citta ?? '',
      provincia: profile?.provincia ?? '',
      stato: profile?.stato || 'Italia',
      numeroTelefono: profile?.numeroTelefono ?? '',
    });
    this.confirmed = false;
  });
  confirmed = false;
  readonly errorMessage = signal('');

  addressChanged(): void {
    this.confirmed = false;
    this.errorMessage.set('');
  }

  completeOrder(form: NgForm, popup: HTMLDialogElement): void {
    if (!this.cartService.items().length) return;
    if (form.invalid || Object.values(this.shipping()).some(value => !value.trim())) {
      this.errorMessage.set('Controlla i dati di spedizione e clicca su conferma.');
      return;
    }
    if (!this.confirmed) {
      this.errorMessage.set('Conferma l’indirizzo di spedizione per continuare.');
      return;
    }
    this.errorMessage.set('');
    popup.showModal();
  }
}

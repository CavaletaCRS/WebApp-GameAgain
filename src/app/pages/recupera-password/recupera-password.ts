import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-recupera-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './recupera-password.html',
  styleUrls: ['../profilo/profilo.scss', './recupera-password.scss'],
})
export class RecuperaPassword {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private popupTimer?: ReturnType<typeof setTimeout>;
  email = '';
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly showPopup = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.popupTimer));
  }

  async submit(form: NgForm): Promise<void> {
    if (this.loading() || this.showPopup()) return;
    this.errorMessage.set('');
    if (form.invalid || !this.email.trim()) {
      this.errorMessage.set('Inserisci un indirizzo email valido.');
      return;
    }

    this.loading.set(true);
    try {
      await this.authService.resetPassword(this.email.trim());
      if (this.destroyRef.destroyed) return;
      this.showPopup.set(true);
      this.popupTimer = setTimeout(() => this.showPopup.set(false), 3_000);
    } catch (error) {
      if (this.destroyRef.destroyed) return;
      const code = (error as { code?: string })?.code;
      const messages: Record<string, string> = {
        'auth/invalid-email': 'Inserisci un indirizzo email valido.',
        'auth/too-many-requests': 'Troppi tentativi. Attendi qualche minuto e riprova.',
        'auth/network-request-failed': 'Errore di rete. Controlla la connessione e riprova.',
      };
      this.errorMessage.set(messages[code ?? ''] ?? "Non è stato possibile inviare l'email. Verifica l'indirizzo e riprova.");
    } finally {
      if (!this.destroyRef.destroyed) this.loading.set(false);
    }
  }
}

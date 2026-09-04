import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthError } from 'firebase/auth';
import { AuthService, UserAddress } from '../../service/auth.service';

@Component({
  selector: 'app-profilo',
  imports: [FormsModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.scss',
})
export class Profilo {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  registerMode = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  statusMessage = '';
  addressLoading = false;
  addressSuccessMessage = '';
  addressErrorMessage = '';
  address: UserAddress = this.emptyAddress();

  constructor(
    readonly authService: AuthService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  private readonly syncAddressFromProfile = effect(() => {
    const profile = this.authService.userProfile();
    if (profile) {
      this.address = {
        indirizzo: profile.indirizzo,
        cap: profile.cap,
        citta: profile.citta,
        provincia: profile.provincia,
        stato: profile.stato,
        numeroTelefono: profile.numeroTelefono,
      };
    }
  });

  async submit(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.statusMessage = this.registerMode ? 'Creazione dell\'account in corso…' : 'Verifica delle credenziali…';

    try {
      if (this.registerMode) {
        await this.authService.register(
          this.email.trim().toLowerCase(),
          this.password,
          this.firstName.trim(),
          this.lastName.trim(),
        );
        this.successMessage = 'Registrazione completata con successo.';
      } else {
        await this.authService.login(this.email.trim(), this.password);
        this.successMessage = 'Accesso effettuato con successo.';
      }
      this.password = '';
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.loading = false;
      this.statusMessage = '';
      this.changeDetector.detectChanges();
    }
  }

  async logout(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.logout();
    } catch {
      this.errorMessage = 'Non è stato possibile effettuare il logout. Riprova.';
    }
  }

  async saveAddress(): Promise<void> {
    if (this.addressLoading) return;

    this.addressLoading = true;
    this.addressErrorMessage = '';
    this.addressSuccessMessage = '';

    try {
      await this.authService.updateAddress({
        indirizzo: this.address.indirizzo.trim(),
        cap: this.address.cap.trim(),
        citta: this.address.citta.trim(),
        provincia: this.address.provincia.trim(),
        stato: this.address.stato.trim(),
        numeroTelefono: this.address.numeroTelefono.trim(),
      });
      this.addressSuccessMessage = 'Indirizzo salvato con successo.';
    } catch (error) {
      this.addressErrorMessage = this.getErrorMessage(error);
    } finally {
      this.addressLoading = false;
      this.changeDetector.detectChanges();
    }
  }

  switchMode(): void {
    this.registerMode = !this.registerMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
  }

  private getErrorMessage(error: unknown): string {
    const code = (error as AuthError)?.code;
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Questa email è già registrata.',
      'auth/invalid-email': 'Inserisci un indirizzo email valido.',
      'auth/invalid-credential': 'Email o password non corretti.',
      'auth/invalid-login-credentials': 'Email o password non corretti.',
      'auth/user-not-found': 'Email o password non corretti.',
      'auth/wrong-password': 'Email o password non corretti.',
      'auth/weak-password': 'La password deve contenere almeno 6 caratteri.',
      'auth/too-many-requests': 'Troppi tentativi. Attendi qualche minuto e riprova.',
      'auth/network-request-failed': 'Errore di rete. Controlla la connessione e riprova.',
      'auth/operation-not-allowed': 'L’accesso con email e password non è ancora abilitato su Firebase.',
      'permission-denied': 'Non è stato possibile salvare il profilo. Verifica le regole di Firestore.',
    };
    return messages[code] ?? 'Si è verificato un errore. Riprova.';
  }

  private emptyAddress(): UserAddress {
    return { indirizzo: '', cap: '', citta: '', provincia: '', stato: '', numeroTelefono: '' };
  }
}

import { Injectable, signal } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { app, db } from '../app.config';

export interface UserAddress {
  indirizzo: string;
  cap: string;
  citta: string;
  provincia: string;
  stato: string;
  numeroTelefono: string;
}

interface UserProfile extends UserAddress {
  nome: string;
  cognome: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly inactivityTimeoutMs = 30 * 60 * 1_000;
  private readonly activityEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
  private readonly auth = getAuth(app);
  private readonly currentUser = signal<User | null>(
    this.auth.currentUser?.emailVerified ? this.auth.currentUser : null,
  );
  private readonly currentUserProfile = signal<UserProfile | null>(null);
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  private activityListenersActive = false;
  private readonly handleActivity = (): void => this.resetInactivityTimer();

  readonly user = this.currentUser.asReadonly();
  readonly userProfile = this.currentUserProfile.asReadonly();

  constructor() {
    onAuthStateChanged(this.auth, user => {
      if (user && !user.emailVerified) {
        this.currentUser.set(null);
        this.currentUserProfile.set(null);
        this.stopInactivityTracking();
        return;
      }

      this.currentUser.set(user);
      void this.loadUserProfile(user?.uid);

      if (user) {
        this.startInactivityTracking();
      } else {
        this.stopInactivityTracking();
      }
    });
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<boolean> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    try {
      await setDoc(doc(db, 'users', credential.user.uid), {
        id: credential.user.uid,
        email: credential.user.email,
        nome: firstName,
        cognome: lastName,
        verified: false,
        createdAt: serverTimestamp(),
        ultimoAccesso: serverTimestamp(),
      });
      this.currentUserProfile.set({ nome: firstName, cognome: lastName, ...this.emptyAddress() });
    } catch (error) {
      await deleteUser(credential.user).catch(() => undefined);
      throw error;
    }

    try {
      await sendEmailVerification(credential.user);
      return true;
    } catch (error) {
      console.warn('Impossibile inviare l’email di verifica.', error);
      return false;
    } finally {
      await signOut(this.auth);
    }
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);

    await credential.user.reload();
    if (!credential.user.emailVerified) {
      await signOut(this.auth);
      throw { code: 'auth/email-not-verified' };
    }

    await credential.user.getIdToken(true);
    await setDoc(
      doc(db, 'users', credential.user.uid),
      { verified: true, ultimoAccesso: serverTimestamp() },
      { merge: true },
    );
  }

  async logout(): Promise<void> {
    this.stopInactivityTracking();
    const user = this.auth.currentUser;

    if (user) {
      const saveLogoutTime = setDoc(
        doc(db, 'users', user.uid),
        { ultimoLogout: serverTimestamp() },
        { merge: true },
      ).catch(error => console.warn('Impossibile aggiornare ultimoLogout su Firestore.', error));

      // Un'estensione del browser o una rete offline non deve impedire il logout.
      await Promise.race([
        saveLogoutTime,
        new Promise<void>(resolve => setTimeout(resolve, 1_500)),
      ]);
    }

    await signOut(this.auth);
  }

  // Avvia il controllo dell'inattività e registra gli eventi che indicano attività dell'utente.
  private startInactivityTracking(): void {
    if (typeof window === 'undefined') return;

    if (!this.activityListenersActive) {
      for (const eventName of this.activityEvents) {
        window.addEventListener(eventName, this.handleActivity, { passive: true });
      }
      this.activityListenersActive = true;
    }

    this.resetInactivityTimer();
  }

  // Interrompe il timer di inattività e rimuove gli eventi registrati durante la sessione.
  private stopInactivityTracking(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }

    if (typeof window !== 'undefined' && this.activityListenersActive) {
      for (const eventName of this.activityEvents) {
        window.removeEventListener(eventName, this.handleActivity);
      }
      this.activityListenersActive = false;
    }
  }

  // Fa ripartire il conteggio dei 30 minuti ogni volta che l'utente interagisce con la pagina.
  private resetInactivityTimer(): void {
    if (!this.auth.currentUser) return;

    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.inactivityTimer = undefined;
      void this.logout().catch(error => {
        console.warn('Impossibile effettuare il logout automatico.', error);
      });
    }, this.inactivityTimeoutMs);
  }

  async updateAddress(address: UserAddress): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('auth/user-not-found');

    await setDoc(doc(db, 'users', user.uid), address, { merge: true });
    this.currentUserProfile.update(profile => profile ? { ...profile, ...address } : profile);
  }

  private async loadUserProfile(uid?: string): Promise<void> {
    if (!uid) {
      this.currentUserProfile.set(null);
      return;
    }

    const snapshot = await getDoc(doc(db, 'users', uid));
    if (this.currentUser()?.uid !== uid) return;

    const data = snapshot.data();
    this.currentUserProfile.set(
      snapshot.exists() && typeof data?.['nome'] === 'string' && typeof data?.['cognome'] === 'string'
        ? {
            nome: data['nome'],
            cognome: data['cognome'],
            indirizzo: typeof data['indirizzo'] === 'string' ? data['indirizzo'] : '',
            cap: typeof data['cap'] === 'string' ? data['cap'] : '',
            citta: typeof data['citta'] === 'string' ? data['citta'] : '',
            provincia: typeof data['provincia'] === 'string' ? data['provincia'] : '',
            stato: typeof data['stato'] === 'string' ? data['stato'] : '',
            numeroTelefono: typeof data['numeroTelefono'] === 'string' ? data['numeroTelefono'] : '',
          }
        : null,
    );
  }

  private emptyAddress(): UserAddress {
    return { indirizzo: '', cap: '', citta: '', provincia: '', stato: '', numeroTelefono: '' };
  }
}

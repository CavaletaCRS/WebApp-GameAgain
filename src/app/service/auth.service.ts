import { Injectable, signal } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
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
  private readonly auth = getAuth(app);
  private readonly currentUser = signal<User | null>(this.auth.currentUser);
  private readonly currentUserProfile = signal<UserProfile | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly userProfile = this.currentUserProfile.asReadonly();

  constructor() {
    onAuthStateChanged(this.auth, user => {
      this.currentUser.set(user);
      void this.loadUserProfile(user?.uid);
    });
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    try {
      await setDoc(doc(db, 'users', credential.user.uid), {
        id: credential.user.uid,
        email: credential.user.email,
        nome: firstName,
        cognome: lastName,
        createdAt: serverTimestamp(),
        ultimoAccesso: serverTimestamp(),
      });
      this.currentUserProfile.set({ nome: firstName, cognome: lastName, ...this.emptyAddress() });
    } catch (error) {
      await deleteUser(credential.user).catch(() => undefined);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    await setDoc(
      doc(db, 'users', credential.user.uid),
      { ultimoAccesso: serverTimestamp() },
      { merge: true },
    );
  }

  async logout(): Promise<void> {
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

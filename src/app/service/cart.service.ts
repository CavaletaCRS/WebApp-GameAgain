import { Injectable, computed, effect, signal } from '@angular/core';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { CarouselGame } from '../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { db } from '../app.config';
import { AuthService } from './auth.service';

export interface CartItem {
  key: string;
  title: string;
  condition: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'game-again-cart';
  private readonly storageOwnerKey = 'game-again-cart-owner';
  private readonly cartItems = signal<CartItem[]>(this.loadCart());
  private readonly cartNotification = signal<string | null>(null);
  private notificationTimer?: ReturnType<typeof setTimeout>;
  private activeUserId: string | null = null;
  private syncVersion = 0;

  readonly items = this.cartItems.asReadonly();
  readonly notification = this.cartNotification.asReadonly();
  readonly itemCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));
  readonly total = computed(() => this.cartItems().reduce((total, item) => total + item.unitPrice * item.quantity, 0));

  constructor(private readonly authService: AuthService) {
    effect(() => {
      const userId = this.authService.user()?.uid ?? null;
      this.activeUserId = userId;

      if (userId) {
        void this.loadUserCart(userId);
      } else {
        this.clearVisibleCart();
      }
    });
  }

  add(product: CarouselGame): void {
    const unitPrice = this.parsePrice(product.price);
    if (unitPrice === null) return;
    const key = `${product.title}|${product.condition}|${product.image}`;
    const existingItem = this.cartItems().find(item => item.key === key);
    if (existingItem) {
      this.updateQuantity(key, existingItem.quantity + 1);
      this.showAddedNotification();
      return;
    }
    this.save([...this.cartItems(), { key, title: product.title, condition: product.condition, image: product.image, unitPrice, quantity: 1 }]);
    this.showAddedNotification();
  }

  updateQuantity(key: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(key);
      return;
    }
    this.save(this.cartItems().map(item => item.key === key ? { ...item, quantity } : item));
  }

  remove(key: string): void {
    this.save(this.cartItems().filter(item => item.key !== key));
  }

  clear(): void {
    this.save([]);
  }

  dismissNotification(): void {
    this.cartNotification.set(null);
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
  }

  private save(items: CartItem[]): void {
    this.cartItems.set(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      if (this.activeUserId) {
        localStorage.setItem(this.userStorageKey(this.activeUserId), JSON.stringify(items));
        localStorage.setItem(this.storageOwnerKey, this.activeUserId);
      }
    }

    this.syncVersion++;
    const userId = this.activeUserId;
    if (userId) void this.saveUserCart(userId, items);
  }

  // Svuota il carrello mostrato dopo il logout senza cancellare quello personale salvato su Firestore.
  private clearVisibleCart(): void {
    this.cartItems.set([]);
    this.dismissNotification();

    // Elimina solo la cache mostrata senza utente. Il carrello personale su
    // Firestore e la sua cache namespaced restano intatti per il prossimo login.
    if (typeof localStorage !== 'undefined') localStorage.removeItem(this.storageKey);
  }

  // Carica da Firestore il carrello associato all'utente e usa la cache locale come fallback.
  private async loadUserCart(userId: string): Promise<void> {
    const versionBeforeLoad = this.syncVersion;
    const cachedUserCart = this.loadStoredCart(this.userStorageKey(userId));
    const cachedOwner = typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageOwnerKey) : null;
    const fallbackItems = cachedUserCart
      ?? (cachedOwner === null || cachedOwner === userId ? this.loadStoredCart(this.storageKey) : null)
      ?? [];

    this.cartItems.set(fallbackItems);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(fallbackItems));
      localStorage.setItem(this.userStorageKey(userId), JSON.stringify(fallbackItems));
      localStorage.setItem(this.storageOwnerKey, userId);
    }

    try {
      const snapshot = await getDoc(doc(db, 'users', userId, 'cart', 'current'));
      if (this.activeUserId !== userId) return;

      // Se il carrello è cambiato durante la lettura, la versione locale più recente ha la precedenza.
      if (this.syncVersion !== versionBeforeLoad) {
        await this.saveUserCart(userId, this.cartItems());
        return;
      }

      if (snapshot.exists()) {
        const items = this.sanitizeItems(snapshot.data()['items']);
        this.cartItems.set(items);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.storageKey, JSON.stringify(items));
          localStorage.setItem(this.userStorageKey(userId), JSON.stringify(items));
          localStorage.setItem(this.storageOwnerKey, userId);
        }
        return;
      }

      // Migra su Firestore l'eventuale carrello che esisteva già nel browser.
      await this.saveUserCart(userId, this.cartItems());
    } catch (error) {
      // La cache locale mantiene utilizzabile il carrello anche temporaneamente offline.
      console.warn('Impossibile caricare il carrello da Firestore.', error);
    }
  }

  // Salva su Firestore lo stato aggiornato del carrello dell'utente autenticato.
  private async saveUserCart(userId: string, items: CartItem[]): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId, 'cart', 'current'), {
        items,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      // La modifica resta nella cache locale e verrà risalvata alla prossima operazione/login.
      console.warn('Impossibile salvare il carrello su Firestore.', error);
    }
  }

  private loadCart(): CartItem[] {
    return this.loadStoredCart(this.storageKey) ?? [];
  }

  // Legge e convalida un carrello presente nella cache locale del browser.
  private loadStoredCart(key: string): CartItem[] | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const storedCart = localStorage.getItem(key);
      return storedCart === null ? null : this.sanitizeItems(JSON.parse(storedCart));
    } catch {
      return null;
    }
  }

  // Genera una chiave di cache distinta per ciascun utente.
  private userStorageKey(userId: string): string {
    return `${this.storageKey}:${userId}`;
  }

  // Scarta dalla cache o dal database eventuali elementi con una struttura non valida.
  private sanitizeItems(value: unknown): CartItem[] {
    if (!Array.isArray(value)) return [];

    return value.filter((item): item is CartItem => Boolean(
      item
      && typeof item.key === 'string'
      && typeof item.title === 'string'
      && typeof item.condition === 'string'
      && typeof item.image === 'string'
      && typeof item.unitPrice === 'number'
      && Number.isFinite(item.unitPrice)
      && typeof item.quantity === 'number'
      && Number.isInteger(item.quantity)
      && item.quantity > 0,
    ));
  }

  private showAddedNotification(): void {
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
    this.cartNotification.set('Articolo aggiunto al carrello!');
    this.notificationTimer = setTimeout(() => {
      this.cartNotification.set(null);
      this.notificationTimer = undefined;
    }, 3000);
  }

  private parsePrice(price: string): number | null {
    const normalized = price.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
    const value = Number(normalized);
    return Number.isFinite(value) ? value : null;
  }
}

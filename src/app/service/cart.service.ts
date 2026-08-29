import { Injectable, computed, signal } from '@angular/core';
import { CarouselGame } from '../shared/components/carousel-gamecard/carousel-gamecard/carousel-gamecard';

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
  private readonly cartItems = signal<CartItem[]>(this.loadCart());
  private readonly cartNotification = signal<string | null>(null);
  private notificationTimer?: ReturnType<typeof setTimeout>;

  readonly items = this.cartItems.asReadonly();
  readonly notification = this.cartNotification.asReadonly();
  readonly itemCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));
  readonly total = computed(() => this.cartItems().reduce((total, item) => total + item.unitPrice * item.quantity, 0));

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
    if (typeof localStorage !== 'undefined') localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const storedCart = localStorage.getItem(this.storageKey);
      return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
    } catch {
      return [];
    }
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

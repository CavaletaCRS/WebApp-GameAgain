import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CarouselGame } from '../carousel-gamecard/carousel-gamecard/carousel-gamecard';
import { CartService } from '../../../service/cart.service';

@Component({
  selector: 'app-product-dialog',
  imports: [],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.scss',
})
export class ProductDialog {
  constructor(private readonly cartService: CartService) {}

  @ViewChild('dialog') private dialog?: ElementRef<HTMLDialogElement>;

  @Input() product?: CarouselGame;

  open(): void {
    const dialog = this.dialog?.nativeElement;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  close(): void {
    this.dialog?.nativeElement.close();
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.add(this.product);
    this.close();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog?.nativeElement) {
      this.close();
    }
  }
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CarouselGame } from '../carousel-gamecard/carousel-gamecard/carousel-gamecard';

@Component({
  selector: 'app-product-dialog',
  imports: [],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.scss',
})
export class ProductDialog {
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

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog?.nativeElement) {
      this.close();
    }
  }
}

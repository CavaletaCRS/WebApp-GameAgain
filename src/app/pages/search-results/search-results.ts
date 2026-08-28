import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductListingPage } from '../../shared/product-listing-page';
import { GameCard } from '../../shared/components/game-card/game-card';

@Component({
  selector: 'app-search-results',
  imports: [GameCard],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults extends ProductListingPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  query = '';

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.query = params.get('q')?.trim() ?? '';
        void this.loadProducts({ search: this.query });
      });
  }
}

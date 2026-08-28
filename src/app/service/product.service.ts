import { Injectable } from '@angular/core';
import {
  collection,
  getDocs
} from 'firebase/firestore';

import { db } from '../app.config';
import { Product, ProductFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsRequest?: Promise<Product[]>;

  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const products = await this.getAllProducts();
    const platform = filters.platform?.trim();
    const category = filters.category?.trim();
    const brand = filters.brand?.trim();

    return products.filter(product =>
      (!platform || product.platform === platform) &&
      (!category || product.category === category) &&
      (!brand || product.brand === brand)
    );
  }

  private getAllProducts(): Promise<Product[]> {
    if (!this.productsRequest) {
      this.productsRequest = getDocs(collection(db, 'products'))
        .then(snapshot => snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[])
        .catch(error => {
          this.productsRequest = undefined;
          throw error;
        });
    }

    return this.productsRequest;
  }
}

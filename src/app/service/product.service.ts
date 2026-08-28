import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  query,
  QueryConstraint,
  where
} from 'firebase/firestore';

import { db } from '../app.config';
import { Product, ProductFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const productsCollection = collection(db, 'products');
    const constraints: QueryConstraint[] = [];

    if (filters.platform?.trim()) {
      constraints.push(where('platform', '==', filters.platform.trim()));
    }

    if (filters.category?.trim()) {
      constraints.push(where('category', '==', filters.category.trim()));
    }

    if (filters.brand?.trim()) {
      constraints.push(where('brand', '==', filters.brand.trim()));
    }

    const productsQuery = query(productsCollection, ...constraints);
    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }
}

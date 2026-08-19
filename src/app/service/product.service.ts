import { Injectable } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../app.config';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  async getProducts(): Promise<Product[]> {
    const productsCollection = collection(db, 'products');

    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }
}
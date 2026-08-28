export interface Product {
  id?: string;
  name: string;
  brand: string;
  platform: string;
  category: string;
  price: number;
  condition: string;
  available: boolean;
  image: string;
  link: string;
  description?: string;
}

export interface ProductFilters {
  platform?: string;
  category?: string;
  brand?: string;
  search?: string;
}

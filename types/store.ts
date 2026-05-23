import type { StoreProduct } from '../lib/admin-merge';

export type { StoreProduct };
export type Product = StoreProduct;

export type CartItem = StoreProduct & { quantity: number };

export type SectionKey = 'inicio' | 'categorias' | 'productos' | 'como' | 'contacto';

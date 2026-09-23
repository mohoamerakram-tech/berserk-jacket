import type { Collection, Product } from '@/lib/types';
import type { Logo } from '@/lib/studio/types';

export interface CatalogState {
  collections: Collection[];
  products: Product[];
  logos: Logo[];
  updatedAt: string;
}

export type PublicCatalogState = CatalogState;

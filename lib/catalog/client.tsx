'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '@/lib/products';
import { LOGOS } from '@/lib/studio/logos';
import { DEFAULT_COLLECTIONS } from '@/lib/collections';
import type { Collection, Product } from '@/lib/types';
import type { Logo } from '@/lib/studio/types';

const ACTIVE_DEFAULT_COLLECTIONS = DEFAULT_COLLECTIONS.filter((collection) => collection.status === 'active');

interface CatalogContextValue {
  products: Product[];
  logos: Logo[];
  collections: Collection[];
  loading: boolean;
}

const CatalogContext = createContext<CatalogContextValue>({ products: PRODUCTS, logos: LOGOS, collections: ACTIVE_DEFAULT_COLLECTIONS, loading: true });

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [logos, setLogos] = useState<Logo[]>(LOGOS);
  const [collections, setCollections] = useState<Collection[]>(ACTIVE_DEFAULT_COLLECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetch('/api/catalog', { signal: controller.signal, cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Catalog unavailable')))
      .then((catalog: { products: Product[]; logos: Logo[]; collections: Collection[] }) => {
        if (!active) return;
        setProducts(catalog.products);
        setLogos(catalog.logos);
        setCollections(catalog.collections?.length ? catalog.collections : ACTIVE_DEFAULT_COLLECTIONS);
      })
      .catch((failure) => {
        if ((failure as Error).name !== 'AbortError') console.error('[catalog]', failure);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const value = useMemo(() => ({ products, logos, collections, loading }), [products, logos, collections, loading]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

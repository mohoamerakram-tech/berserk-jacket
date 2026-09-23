/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Server Component page rendering the /shop route (product catalog).
 *
 * WHY IT EXISTS:
 * Serves as the primary merchandise destination for the Berserk Jacket Archive,
 * responding to category filtering via URL query parameters.
 *
 * HOW IT CONNECTS:
 * - Reads search parameters via Next.js 15 Promise resolution.
 * - Fetches products from `lib/products.ts`.
 * - Integrates `ShopHeader`, `ShopMargins`, `CategoryFilter`, and `ProductGrid`.
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicCollections, getPublicProducts } from '@/lib/catalog/server';
import { ProductCategory } from '@/lib/types';
import ShopHeader from '@/app/components/shop/ShopHeader';
import ShopMargins from '@/app/components/shop/ShopMargins';
import CategoryFilter from '@/app/components/shop/CategoryFilter';
import ProductGrid from '@/app/components/shop/ProductGrid';

export const metadata: Metadata = {
  title: 'Shop All Artifacts — Berserk Jacket Archive',
  description: 'Browse authentic heavy-gauge embroidered jackets, hoodies, tees, and accessories.',
};

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  /**
   * IMPORTANT FOR NEXT.JS 15:
   * In Next.js 15, `searchParams` is a Promise that must be awaited before accessing its keys.
   */
  searchParams: Promise<{
    category?: string;
    collection?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await the searchParams Promise per Next.js 15 App Router requirements
  const resolvedParams = await searchParams;
  const activeCategory = (resolvedParams?.category as ProductCategory | 'all') || 'all';

  // Retrieve products matching the requested category
  const [catalog, collections] = await Promise.all([getPublicProducts(), getPublicCollections()]);
  const activeCollection = collections.find((collection) => collection.slug === resolvedParams.collection);
  const collectionProducts = activeCollection ? catalog.filter((product) => (product.collectionId || 'berserk') === activeCollection.id) : catalog;
  const products = activeCategory === 'all'
    ? collectionProducts
    : collectionProducts.filter((product) => product.category === activeCategory);

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-6 sm:py-10 px-3 sm:px-6 overflow-x-hidden flex justify-center">
      {/* Centered Manga Tankobon Spread Container */}
      <div className="w-full max-w-6xl mx-auto flex items-stretch justify-center gap-3 sm:gap-6">
        
        {/* Vertical Japanese Margin Notes */}
        <ShopMargins />

        {/* Central Manuscript Editorial Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Manga Manuscript Top Bar */}
          <ShopHeader totalCount={products.length} />

          {activeCollection && <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-[3px] border-black bg-[#dc2626] px-4 py-3 text-white"><div><p className="font-mono text-[9px] font-black uppercase tracking-widest">Filtered collection // 作品選択</p><p className="text-xl font-black uppercase">{activeCollection.name} · {activeCollection.japaneseName}</p></div><Link href="/collection" className="border-2 border-white px-3 py-2 font-mono text-[10px] font-black uppercase hover:bg-white hover:text-black">Change collection</Link></div>}

          {/* Interactive URL-Driven Category Filter Bar */}
          <CategoryFilter />

          {/* Responsive Manga Panel Product Grid */}
          <ProductGrid products={products} />

          {/* Bottom Manga Publishing Footer */}
          <footer className="flex items-center justify-between pt-3 mt-10 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black">白泉社 (HAKUSENSHA)</span>
              <span>/</span>
              <span>スタジオ我画 (STUDIO GAGA)</span>
            </div>
            <div className="hidden sm:block font-serif italic text-stone-500 text-[11px]">
              「夜明けが来るまで、足掻き続けろ」
            </div>
            <div className="font-bold text-black">
              三浦建太郎 (KENTARO MIURA)
            </div>
          </footer>
        </div>

      </div>
    </main>
  );
}

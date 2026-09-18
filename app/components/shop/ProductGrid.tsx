/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Displays the collection of products inside a responsive manga-panel grid.
 *
 * WHY IT EXISTS:
 * Encapsulates grid layout calculations and provides an authentic empty state
 * panel whenever active search or category filters yield zero results.
 *
 * HOW IT CONNECTS:
 * Rendered by `app/shop/page.tsx` as a Server Component. Maps data to `ProductCard`.
 * ============================================================================
 */

import React from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Fallback state if the user filters to an empty category
  if (products.length === 0) {
    return (
      <div className="border-[3px] border-black bg-stone-950 text-white p-12 text-center space-y-4 shadow-sm">
        <div className="inline-block bg-[#dc2626] text-white font-mono font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-widest border border-white/40">
          PANEL EMPTY // 該当なし
        </div>
        <h3 className="font-sans font-black text-xl uppercase tracking-tight text-white">
          NO ARTIFACTS FOUND
        </h3>
        <p className="font-mono text-xs text-stone-400 max-w-sm mx-auto uppercase">
          No embroidered items forged under this category yet. Check back soon for upcoming chapters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

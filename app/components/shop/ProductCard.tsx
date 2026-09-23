/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Renders an individual product item formatted as an authentic manga panel.
 *
 * WHY IT EXISTS:
 * Bridges e-commerce product listings with the tankobon manuscript visual style,
 * using panel labels, hard drop-shadows, and text-over-image typography.
 *
 * HOW IT CONNECTS:
 * Imported and rendered in a loop by `app/components/shop/ProductGrid.tsx`.
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';
import { getProductStock, Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const soldOut = !product.inStock || getProductStock(product) <= 0;
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block w-full aspect-[3/4] bg-stone-950 border-[3px] border-black overflow-hidden select-none transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#dc2626]"
    >
      {/* 1. Base Layer: Photography with subtle manga desaturation */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        className="absolute inset-0 h-full w-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
      />

      {/* 2. Gradient Overlay: Enhances bottom typography readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

      {/* 3. Top-Left Manga Panel Label */}
      <div className="absolute top-2 left-2 z-10">
        <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-white/40">
          PANEL {product.panelNumber} {'//'} {product.japaneseName}
        </span>
      </div>

      {/* 4. Optional Top-Right Marketing Badge */}
      {product.badge && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-[#dc2626] text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-white/60 shadow-sm">
            {product.badge}
          </span>
        </div>
      )}

      {/* 5. Out of Stock Stamp (Rotated Manga Seal) */}
      {soldOut && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="border-2 border-[#dc2626] text-[#dc2626] bg-black/80 font-mono font-black text-xs px-3 py-1 uppercase tracking-widest -rotate-12">
            OUT OF STOCK // 完売
          </span>
        </div>
      )}

      {/* 6. Bottom Information Layer: Name, Specs & Pricing */}
      <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
        <h3 className="font-sans font-black text-sm uppercase tracking-tight text-white leading-tight [text-shadow:_0_2px_4px_black,_0_0_12px_black]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-1 border-t border-stone-700/80">
          <span className="text-[10px] font-mono text-stone-300 uppercase">
            {product.category}
          </span>
          <span className="font-mono font-bold text-sm text-[#dc2626]">
            {product.price} DH
          </span>
        </div>
      </div>
    </Link>
  );
}

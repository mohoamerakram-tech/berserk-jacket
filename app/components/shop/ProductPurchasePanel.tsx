'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Interactive purchase control panel for the product detail page.
 *
 * WHY IT EXISTS:
 * Manages the `selectedSize` state in one centralized location. By housing the
 * size state here, child components like `AddToCartButton` can remain purely
 * presentational and receive the state as a prop, avoiding fragmented state.
 *
 * HOW IT CONNECTS:
 * - Rendered by `app/shop/[slug]/page.tsx` as the right-hand manga column.
 * - Passes `product` and `selectedSize` to `AddToCartButton`.
 * - Houses `WhatsAppButton` directly underneath the cart action.
 * ============================================================================
 */

import React, { useState } from 'react';
import { getProductStock, isProductSizeAvailable, Product } from '@/lib/types';
import AddToCartButton from '@/app/components/cart/AddToCartButton';
import WhatsAppButton from '@/app/components/shop/WhatsAppButton';
import SizeGuideButton from '@/app/components/shop/SizeGuideButton';

interface ProductPurchasePanelProps {
  product: Product;
}

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  // Centralized size selection state (single source of truth for this product)
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const soldOut = !product.inStock || getProductStock(product) <= 0;

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div className="space-y-3">
        {/* Spec Label Line */}
        <div className="text-[10px] font-mono text-[#dc2626] font-bold tracking-widest uppercase flex items-center gap-1.5">
          <span>◆</span>
          <span>{product.japaneseName} {'//'} SPECIFICATION</span>
        </div>

        {/* Product Heading */}
        <h1 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
          {product.name}
        </h1>

        {/* Pricing */}
        <div className="text-xl font-mono font-bold text-[#dc2626]">
          {product.price} DH
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="ml-3 text-sm text-stone-500 line-through">{product.compareAtPrice} DH</span>
          ) : null}
        </div>

        {soldOut && (
          <div role="status" className="border-2 border-[#dc2626] bg-red-950 px-3 py-2 font-mono text-xs font-black uppercase text-red-300">
            Sold out // 完売 — this piece is currently unavailable.
          </div>
        )}

        {/* Product Description */}
        <p className="font-mono text-xs text-stone-300 leading-relaxed uppercase pt-2 border-t border-stone-800">
          {product.description}
        </p>

        {(product.materials || product.embroideryDetails || product.fit || product.careInstructions) && (
          <dl className="grid gap-2 border-t border-stone-800 pt-3 font-mono text-[10px] uppercase">
            {product.materials && <div><dt className="font-black text-stone-500">Materials</dt><dd className="mt-0.5 text-stone-300">{product.materials}</dd></div>}
            {product.embroideryDetails && <div><dt className="font-black text-stone-500">Embroidery</dt><dd className="mt-0.5 text-stone-300">{product.embroideryDetails}</dd></div>}
            {product.fit && <div><dt className="font-black text-stone-500">Fit</dt><dd className="mt-0.5 text-stone-300">{product.fit}</dd></div>}
            {product.careInstructions && <div><dt className="font-black text-stone-500">Care</dt><dd className="mt-0.5 text-stone-300">{product.careInstructions}</dd></div>}
          </dl>
        )}

        {/* Sizing Matrix: Interactive Size Badges */}
        <div className="space-y-2 pt-2">
          {/* Size guide sits on the same row as the label so customers can quickly look up their size without scrolling. */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-stone-400 font-bold">
              AVAILABLE SIZES:
            </span>
            <SizeGuideButton />
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const available = isProductSizeAvailable(product, size);
              return (
              <button
                type="button"
                key={size}
                onClick={() => available && setSelectedSize(size)}
                disabled={!available}
                className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-all cursor-pointer border-2 border-black ${
                  !available
                    ? 'bg-stone-800 text-stone-600 cursor-not-allowed line-through'
                    : selectedSize === size
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
                    : 'bg-white text-black hover:bg-stone-200'
                }`}
              >
                {size}{!available ? ' · SOLD' : ''}
              </button>
            )})}
          </div>
          {!soldOut && getProductStock(product) !== Number.MAX_SAFE_INTEGER && (
            <p className="font-mono text-[10px] font-bold uppercase text-stone-500">{getProductStock(product)} total units available</p>
          )}
        </div>
      </div>

      {/* CTA, WhatsApp, and Shipping Footnote */}
      <div className="space-y-3 pt-4 border-t border-stone-800">
        <AddToCartButton product={product} size={selectedSize} />
        
        {/* Visual WhatsApp Order CTA */}
        {!soldOut && <WhatsAppButton
          href={`/checkout?productId=${encodeURIComponent(product.id)}&size=${encodeURIComponent(selectedSize || product.sizes.find((size) => isProductSizeAvailable(product, size)) || '')}`}
          label="ORDER VIA WHATSAPP"
        />}

        <p className="font-mono text-[10px] text-stone-500 text-center uppercase tracking-wider">
          FAST EXPRESS SHIPPING · PREPAYMENT VIA VIREMENT / CASH PLUS / WAFACASH
        </p>
      </div>
    </div>
  );
}

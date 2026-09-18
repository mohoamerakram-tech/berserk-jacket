'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Interactive Add To Cart button component with size validation.
 *
 * WHY IT EXISTS:
 * Handles the user action to add a specific product and size variant to the cart.
 * Enforces size selection validation and out-of-stock guards before dispatching.
 *
 * HOW IT CONNECTS:
 * - Rendered by `ProductPurchasePanel.tsx` receiving `product` and `selectedSize`.
 * - Dispatches `addItem()` and `openCart()` to `useCart()`.
 * ============================================================================
 */

import React from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/CartProvider';

interface AddToCartButtonProps {
  product: Product;
  size: string | null;
}

export default function AddToCartButton({ product, size }: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  // Handle addition: dispatches item to context and opens drawer for immediate visual confirmation
  const handleAddToCart = () => {
    if (!size || !product.inStock) return;
    addItem(product, size);
    openCart();
  };

  // Branch 1: Out of Stock Guard
  if (!product.inStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full bg-stone-900 text-stone-500 font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3.5 px-6 border-2 border-stone-800 cursor-not-allowed"
      >
        OUT OF STOCK {'//'} 完売
      </button>
    );
  }

  // Branch 2 & 3: In Stock with either size chosen or size pending
  const isSizeSelected = Boolean(size);

  return (
    <div className="space-y-1.5 w-full">
      {/* Warning prompt displayed when user hasn't selected a size yet */}
      {!isSizeSelected && (
        <div className="text-[#dc2626] text-[10px] font-mono font-bold tracking-widest uppercase">
          SELECT A SIZE {'//'} サイズを選択してください
        </div>
      )}

      <button
        type="button"
        disabled={!isSizeSelected}
        onClick={handleAddToCart}
        className={`w-full font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3.5 px-6 border-2 border-black transition-all whitespace-nowrap ${
          isSizeSelected
            ? 'bg-white hover:bg-stone-200 active:bg-stone-300 text-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer'
            : 'bg-stone-200 text-stone-400 opacity-50 cursor-not-allowed shadow-none'
        }`}
      >
        ADD TO CART — {product.price} DH
      </button>
    </div>
  );
}

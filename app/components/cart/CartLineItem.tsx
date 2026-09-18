'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Renders a single cart line item styled as an authentic mini manga panel.
 *
 * WHY IT EXISTS:
 * Encapsulates the visual display and item-specific actions (increment,
 * decrement, remove) for a specific product variant line.
 *
 * HOW IT CONNECTS:
 * - Rendered by `CartDrawer.tsx` inside the items list loop.
 * - Calls `updateQuantity()` and `removeItem()` from `useCart()`.
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/lib/cart/types';
import { useCart } from '@/lib/cart/CartProvider';

interface CartLineItemProps {
  item: CartItem;
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-3 p-3 border-2 border-black bg-stone-50">
      {/* Product Thumbnail (80x80 with 2px black border) */}
      <div className="relative w-20 h-20 shrink-0 border-2 border-black bg-black overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Middle Specs Column: Name, Japanese Name, Size Badge, Unit Price */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h2 className="font-sans font-bold text-xs sm:text-sm text-black uppercase truncate leading-tight">
            {item.name}
          </h2>
          <p className="font-mono text-[9px] text-black/50 uppercase truncate">
            {item.japaneseName}
          </p>
          <div className="mt-1">
            <span className="inline-block bg-black text-white font-mono text-[9px] font-bold px-1.5 py-0.2 tracking-wider">
              SIZE: {item.size}
            </span>
          </div>
        </div>

        <div className="font-mono text-xs text-[#dc2626] font-bold">
          {item.price} DH
        </div>
      </div>

      {/* Right Controls Column: Quantity [-] [n] [+] and Remove Button */}
      <div className="flex flex-col justify-between items-end shrink-0">
        <div className="flex items-center border border-black bg-white">
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="w-6 h-6 flex items-center justify-center font-mono text-xs font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-6 text-center font-mono text-xs font-bold text-black select-none">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
            aria-label="Increase quantity"
            className="w-6 h-6 flex items-center justify-center font-mono text-xs font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <div className="text-right">
          <div className="font-mono text-xs font-black text-[#dc2626]">
            {lineTotal} DH
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.size)}
            className="text-[9px] font-mono text-[#dc2626] hover:underline uppercase tracking-wider cursor-pointer"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Slide-in drawer rendering the user's active shopping cart and subtotal.
 *
 * WHY IT EXISTS:
 * Provides the central interactive shopping basket interface without forcing
 * navigation away from current browsing context.
 *
 * HOW IT CONNECTS:
 * - Rendered once at the root level in `app/layout.tsx`.
 * - Controlled by `isOpen` and `closeCart()` from `useCart()`.
 * ============================================================================
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartProvider';
import CartLineItem from './CartLineItem';
import WhatsAppButton from '@/app/components/shop/WhatsAppButton';

export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, clearCart } = useCart();

  // BODY SCROLL LOCK:
  // Prevents background page scrolling while the drawer overlay is active.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Guard: Avoid rendering unnecessary DOM when closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Dimmed backdrop overlay: Clicking outside closes the drawer */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Manga Slide-In Panel (CSS-only animation without external JS libraries) */}
      <aside className="relative z-10 w-full sm:w-[420px] h-full bg-white border-l-[3px] border-black flex flex-col shadow-2xl transition-transform duration-300 translate-x-0">
        
        {/* Drawer Header: Manga-styled black title bar */}
        <div className="h-14 bg-black text-white px-4 flex items-center justify-between border-b-2 border-black shrink-0">
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
            YOUR CART {'//'} 買い物かご
          </span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart drawer"
            className="font-mono text-lg font-bold hover:text-[#dc2626] transition-colors p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body: Line items list or empty state */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <span className="bg-black text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1">
                PANEL 00 {'//'} EMPTY
              </span>
              <h2 className="font-sans font-black text-xl uppercase tracking-tight text-black">
                CART IS EMPTY {'//'} 空
              </h2>
              <p className="font-mono text-xs text-stone-600 uppercase max-w-xs">
                Your scroll contains no artifacts. Equip a heavyweight hoodie to continue your journey.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 inline-block bg-black text-white font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-black hover:bg-stone-800 transition-colors shadow-[2px_2px_0px_0px_#dc2626]"
              >
                BROWSE HOODIES ◄
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartLineItem key={`${item.productId}::${item.size}`} item={item} />
            ))
          )}
        </div>

        {/* Drawer Footer: Subtotal and Checkout action (rendered only when cart has items) */}
        {items.length > 0 && (
          <div className="border-t-2 border-black p-4 bg-stone-50 space-y-3 shrink-0">
            <div className="flex items-center justify-between font-mono text-sm font-bold">
              <span className="uppercase text-black">SUBTOTAL</span>
              <span className="text-[#dc2626] text-base">{subtotal} DH</span>
            </div>

            <p className="font-mono text-[10px] text-stone-500 uppercase tracking-wider">
              PREPAYMENT REQUIRED (BANK TRANSFER, CASH PLUS, OR WAFACASH) · NO COD
            </p>

            <WhatsAppButton
              label="ORDER VIA WHATSAPP"
              href="/checkout?source=cart"
              onClick={closeCart}
              className="w-full"
            />

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={clearCart}
                className="text-[10px] font-mono text-[#dc2626] hover:underline uppercase tracking-wider cursor-pointer"
              >
                CLEAR CART
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Persistent interactive cart button placed in the Navbar header.
 *
 * WHY IT EXISTS:
 * Gives users immediate visual feedback on their cart item quantity and allows
 * one-click opening of the slide-in cart drawer from any page.
 *
 * HOW IT CONNECTS:
 * - Rendered inside `app/components/navigation/Navbar.tsx`.
 * - Reads `totalCount` and triggers `openCart()` from `useCart()`.
 * ============================================================================
 */

import React, { useSyncExternalStore } from 'react';
import { useCart } from '@/lib/cart/CartProvider';

/**
 * React 19 hydration guard:
 * Prevents SSR from rendering localStorage-dependent badge counts by returning
 * false on the server and true on the client without triggering setState in effect.
 */
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CartIcon() {
  const { totalCount, openCart } = useCart();
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open cart"
      className="relative p-1.5 sm:p-2 border-2 border-black bg-white hover:bg-stone-100 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer flex items-center justify-center transition-all"
    >
      {/* 24px Inline Cart SVG Glyph (No external icon packages) */}
      <svg
        className="w-5 h-5 text-black"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Red Count Badge: Shown only when mounted on client and count > 0 */}
      {mounted && totalCount > 0 && (
        <span
          className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-[#dc2626] text-white font-mono text-[10px] font-bold rounded-full border-2 border-black flex items-center justify-center leading-none"
          aria-live="polite"
        >
          {totalCount}
        </span>
      )}
    </button>
  );
}

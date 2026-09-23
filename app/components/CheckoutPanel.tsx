/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Centerpiece Manga Panel (Panel 03) displayed on the homepage spread.
 *
 * WHY IT EXISTS:
 * Showcases the hero product (front embroidery design) with direct-on-image
 * manga typography and an immediate call-to-action to buy or explore the shop.
 *
 * HOW IT CONNECTS:
 * - Rendered in `app/page.tsx` (Row 2 of the 5-panel homepage layout).
 * - Links to `/shop` or invokes custom `onBuyNow` handler.
 * ============================================================================
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatalog } from '@/lib/catalog/client';
import { getProductStock } from '@/lib/types';

/**
 * Shared tactile manga CTA button styling.
 * Black/white/red with hard offset drop-shadow (#dc2626) and active depression.
 */
const CTA_BUTTON_CLASSES =
  'bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-2.5 px-5 sm:px-6 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';

interface CheckoutPanelProps {
  /** Optional custom handler when the user clicks 'BUY NOW - 300 Dh' */
  onBuyNow?: () => void;
  /** Optional Tailwind class overrides */
  className?: string;
}

export default function CheckoutPanel({ onBuyNow, className = '' }: CheckoutPanelProps) {
  const { products } = useCatalog();
  const product = products.find((entry) => entry.id === 'prod-001' || entry.slug === 'berserker-armor-jacket');
  const soldOut = product ? getProductStock(product) === 0 : false;
  const buttonContent = (
    <>
      <span>{soldOut ? 'SOLD OUT' : product ? `BUY NOW - ${product.price} Dh` : 'VIEW AVAILABLE PIECES'}</span>
      <span aria-hidden="true">→</span>
    </>
  );

  return (
    <div
      className={`relative w-full h-[260px] sm:h-[300px] md:h-[340px] border-[3px] border-black bg-black overflow-hidden shadow-sm ${className}`}
    >
      {/* Background Image filling the entire panel completely */}
      <Image
        src="/images/front-designe-new.jpg"
        alt="Berserk Embroidered Jacket Front Design"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Subtle dark vignette for contrast and legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Top Manga Panel Tag Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-white/60 drop-shadow-[0_1px_3px_black]">
          PANEL 03 // 珠玉の刺繍
        </span>
      </div>

      {/* Manga Typography & CTA directly overlaid over the image (NO opaque box) */}
      <div className="absolute bottom-4 left-4 sm:left-6 z-10 max-w-sm sm:max-w-md space-y-2.5">
        {/* Authentic Manga Narrative Typography */}
        <div className="space-y-1">
          <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-red-500 uppercase flex items-center gap-1.5 drop-shadow-[0_1px_3px_black]">
            <span>◆</span>
            <span>ARMOR SPEC // 珠玉の刺繍</span>
          </div>
          <h3 className="font-sans font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_0_2px_4px_black,_0_0_12px_black]">
            PREMIUM HEAVY-GAUGE EMBROIDERY.
          </h3>
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-stone-300 font-bold drop-shadow-[0_1px_3px_black] [text-shadow:_0_1px_3px_black]">
            INDESTRUCTIBLE THREAD RELIEF — NEVER PRINTED.
          </p>
        </div>

        {/* High-Contrast Manga CTA Button */}
        <div>
          {onBuyNow ? (
            <button
              type="button"
              onClick={onBuyNow}
              disabled={soldOut}
              id="panel3-buy-now-cta"
              className={CTA_BUTTON_CLASSES}
            >
              {buttonContent}
            </button>
          ) : (
            soldOut ? (
              <span id="panel3-buy-now-cta" aria-disabled="true" className={`${CTA_BUTTON_CLASSES} cursor-not-allowed opacity-70`}>{buttonContent}</span>
            ) : (
              <Link
                href={product ? `/checkout?productId=${encodeURIComponent(product.id)}` : '/shop'}
                id="panel3-buy-now-cta"
                className={CTA_BUTTON_CLASSES}
              >
                {buttonContent}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

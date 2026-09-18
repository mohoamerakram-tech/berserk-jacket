/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Renders the manga manuscript editorial header for the /shop catalogue page.
 *
 * WHY IT EXISTS:
 * Recreates the authentic Young Animal serialized tankobon header styling
 * (chapter citations, total count badge, page index, and reading direction).
 *
 * HOW IT CONNECTS:
 * Rendered at the top of `app/shop/page.tsx` as a Server Component.
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';

interface ShopHeaderProps {
  /** Total number of items displayed under current filter criteria */
  totalCount: number;
}

export default function ShopHeader({ totalCount }: ShopHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-2 mb-4 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
      {/* Left editorial badges */}
      <div className="flex items-center gap-2">
        <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
          FUTURE STITCH MANU
        </span>
        <span className="font-bold text-black uppercase">
          コレクション // COLLECTION
        </span>
        <span className="text-stone-400 hidden sm:inline">|</span>
        {/* Dynamic total count badge */}
        <span className="hidden sm:inline bg-stone-100 border border-stone-400 px-1 font-bold text-stone-900">
          全 {totalCount} 点
        </span>
      </div>

      {/* Right editorial metadata: reading direction and page number */}
      <div className="flex items-center gap-2 text-stone-600 shrink-0">
        <Link href="/" className="text-stone-800 hover:text-black font-bold hidden md:inline">
          ◄ 読書方向 [ HOME ]
        </Link>
        <span className="hidden sm:inline">【 読み方向 ◄ 右から左へ 】</span>
        {/* Manga page numbering marker */}
        <span className="font-bold text-black border border-black px-1.5 py-0.2 bg-white">
          P. 043
        </span>
      </div>
    </header>
  );
}

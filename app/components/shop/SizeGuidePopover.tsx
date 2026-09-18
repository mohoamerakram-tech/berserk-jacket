'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Floating popover panel presenting the weight-vs-height Size Guide matrix image.
 *
 * WHY IT EXISTS:
 * Replaces the modal dialog with a frictionless hover card.
 * Positioned absolutely in the margin space, opening downward, right-aligned to the button.
 *
 * HOW IT CONNECTS:
 * Rendered by `SizeGuideButton.tsx` as a child inside the hoverable group container.
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';

export default function SizeGuidePopover() {
  return (
    <div
      role="tooltip"
      aria-label="Size guide recommendations"
      // Reasoning: the "SIZE GUIDE" button lives on the right side of the "AVAILABLE SIZES:" row, near the right edge of the dark column. Right-aligning the popover and shifting it rightward lets it naturally escape into the empty white margin instead of pushing left over the product photo.
      // On mobile (below sm), centered with max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[92vw] to prevent off-screen clipping.
      className="absolute top-full pt-2 z-[60] transition-all duration-150 ease-out pointer-events-auto
        max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[92vw]
        sm:right-0 sm:translate-x-[50%] sm:w-[540px] max-w-[90vw]
        animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {/* Popover Card: Manga Tankobon style with 3px black border, hard red shadow, and max-h-[70vh] cap */}
      <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#dc2626] p-3 select-none max-h-[70vh] flex flex-col">
        
        {/* Header Strip: Bold black banner with Japanese editorial label */}
        <div className="bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mb-2 shrink-0">
          SIZE GUIDE {'//'} サイズ表
        </div>

        {/* Popover Graphic Region: Internally scrollable (overflow-y-auto) on short viewports */}
        <div className="flex-1 overflow-y-auto bg-stone-50 border-2 border-black p-2 flex justify-center">
          <Image
            src="/images/size-guide.png"
            alt="Size Guide Recommendation Matrix (Weight vs Height)"
            width={1200}
            height={1114}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Footer Guidance: Explanatory measurement legend */}
        <div className="border-t-2 border-black pt-2 mt-2 text-[10px] font-mono uppercase tracking-widest text-black/60 shrink-0">
          WEIGHT / HEIGHT → RECOMMENDED SIZE {'//'} 体重・身長 → 推奨サイズ
        </div>

      </div>
    </div>
  );
}

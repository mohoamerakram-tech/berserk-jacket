'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Manga badge trigger button that displays the SizeGuidePopover on hover.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Manages touch tap state for mobile devices while relying on pure CSS hover
 * on desktop. Positioned as a relative anchor for the absolute popover.
 *
 * HOW IT CONNECTS:
 * Rendered next to the "AVAILABLE SIZES:" heading in `ProductPurchasePanel.tsx`.
 * Mounts `SizeGuidePopover` as an absolutely-positioned floating child.
 * ============================================================================
 */

import React, { useState } from 'react';
import SizeGuideIcon from './SizeGuideIcon';
import SizeGuidePopover from './SizeGuidePopover';

export default function SizeGuideButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOpen, setIsTouchOpen] = useState(false);

  // Handle touch tap for mobile devices where hover is unavailable
  const handleTouchToggle = (e: React.MouseEvent) => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      e.preventDefault();
      setIsTouchOpen((prev) => !prev);
    }
  };

  return (
    // The relative container serves as the anchor point for the downward popover.
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsTouchOpen(false);
      }}
      className="relative inline-block group"
    >
      {/* Trigger Button: Styled as high-contrast manga badge */}
      <button
        type="button"
        onClick={handleTouchToggle}
        aria-haspopup="true"
        aria-expanded={isHovered || isTouchOpen}
        aria-label="Size guide table"
        className="inline-flex items-center gap-1.5 bg-white group-hover:bg-black text-black group-hover:text-white border-2 border-black font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 transition-all cursor-pointer shadow-none group-hover:shadow-[3px_3px_0px_0px_#dc2626] active:translate-x-0.5 active:translate-y-0.5 select-none"
      >
        <SizeGuideIcon className="w-3.5 h-3.5 shrink-0" />
        <span>SIZE GUIDE {'//'} サイズ表</span>
      </button>

      {/* Popover: Shown via group-hover on desktop or isTouchOpen on touch tap */}
      {/* Reasoning: the "SIZE GUIDE" button lives on the right side of the "AVAILABLE SIZES:" row, near the right edge of the dark column. Right-aligning the popover lets it naturally grow into the empty white margin outside the column, instead of pushing left over the product image. */}
      <div className={isTouchOpen ? 'block' : 'hidden group-hover:block'}>
        <SizeGuidePopover />
      </div>
    </div>
  );
}

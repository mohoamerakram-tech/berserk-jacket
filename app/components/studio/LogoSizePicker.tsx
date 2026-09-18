'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Discrete scale selector for the embroidery motif (Small, Medium, Large).
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Attaches click handlers to update the active logo size.
 *
 * DESIGN NOTE:
 * Adheres strictly to the manga pill-less button aesthetic used for size selection
 * on the hoodie product detail page.
 *
 * HOW IT CONNECTS:
 * - Rendered by `StudioPanel.tsx`.
 * - Reads size metadata from `LOGO_SIZES` in `lib/studio/options.ts`.
 * ============================================================================
 */

import React from 'react';
import { LogoSize } from '@/lib/studio/types';
import { LOGO_SIZES } from '@/lib/studio/options';

interface LogoSizePickerProps {
  /** Currently selected size tier */
  value: LogoSize;
  /** Callback triggered when user picks a size */
  onChange: (size: LogoSize) => void;
}

export default function LogoSizePicker({ value, onChange }: LogoSizePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2 select-none">
      {LOGO_SIZES.map((size) => {
        const isActive = value === size.id;

        return (
          <button
            key={size.id}
            type="button"
            onClick={() => onChange(size.id)}
            aria-pressed={isActive}
            className={`py-2 px-3 border-2 border-black font-mono transition-all cursor-pointer flex flex-col items-center justify-center ${
              isActive
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
                : 'bg-white text-black hover:bg-stone-100'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              {size.label}
            </span>
            <span className={`text-[10px] ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
              {size.japanese}
            </span>
          </button>
        );
      })}
    </div>
  );
}

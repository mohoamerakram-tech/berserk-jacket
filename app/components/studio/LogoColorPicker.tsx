'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Thread color swatch selector for the active embroidery motif.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Handles user swatch clicks and manages disabled state when motifs cannot be recolored.
 *
 * DESIGN EXCEPTION — CIRCULAR SWATCHES:
 * Standard UI rule for the manga aesthetic forbids rounded corners (all panels
 * and buttons have 0px radius). Circular swatches (`rounded-full`) are permitted
 * EXCLUSIVELY here, because square color chips are easily confused with buttons
 * or thumbnails, whereas circular beads naturally communicate thread spools / color swatches.
 *
 * HOW IT CONNECTS:
 * - Rendered by `StudioPanel.tsx`.
 * - Reads palette from `LOGO_COLORS` in `lib/studio/options.ts`.
 * ============================================================================
 */

import React from 'react';
import { LOGO_COLORS } from '@/lib/studio/options';

interface LogoColorPickerProps {
  /** Selected color ID (e.g. "crimson") */
  value: string;
  /** Callback when user selects a color swatch */
  onChange: (id: string) => void;
  /** Whether color selection is disabled (e.g. multi-color logo) */
  disabled: boolean;
}

export default function LogoColorPicker({ value, onChange, disabled }: LogoColorPickerProps) {
  // If the active motif cannot be recolored via CSS mask-image, lock the control
  if (disabled) {
    return (
      <div className="p-3 bg-stone-100 border border-stone-300 text-stone-600 font-mono text-xs uppercase tracking-wider">
        COLOR LOCKED FOR THIS MOTIF // このロゴは色変更不可
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 items-center select-none">
      {LOGO_COLORS.map((color) => {
        const isActive = value === color.id;

        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color.id)}
            aria-pressed={isActive}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            {/* 32px Circular Thread Swatch */}
            <div
              style={{ backgroundColor: color.hex }}
              className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                isActive
                  ? 'outline-[3px] outline-[#dc2626] scale-110 shadow-sm'
                  : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
              }`}
            >
              {/* Checkmark glyph on active selection */}
              {isActive && (
                <span
                  className={`text-xs font-bold leading-none ${
                    color.id === 'white' || color.id === 'silver' ? 'text-black' : 'text-white'
                  }`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </div>

            {/* Micro Caption */}
            <span
              className={`font-mono text-[9px] uppercase tracking-wider ${
                isActive ? 'font-black text-black' : 'text-stone-500 group-hover:text-black'
              }`}
            >
              {color.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

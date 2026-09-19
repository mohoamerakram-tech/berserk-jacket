'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Color swatch selector for the base garment hoodie fabric.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Handles user click interactions to select the active garment base.
 *
 * DESIGN NOTE:
 * Features only 2 curated fabrics (Black, White) to keep customer choice
 * simple, uncluttered, and authentic to the atelier inventory.
 *
 * HOW IT CONNECTS:
 * - Rendered by `StudioPanel.tsx`.
 * - Reads options from `JACKET_COLORS` in `lib/studio/options.ts`.
 * ============================================================================
 */

import React from 'react';
import { JACKET_COLORS } from '@/lib/studio';

interface JacketColorPickerProps {
  /** Selected jacket color ID (e.g. "black") */
  value: string;
  /** Callback triggered when user selects a color */
  onChange: (id: string) => void;
}

export default function JacketColorPicker({ value, onChange }: JacketColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {JACKET_COLORS.map((jacket) => {
        const isActive = value === jacket.id;

        return (
          <button
            key={jacket.id}
            type="button"
            onClick={() => onChange(jacket.id)}
            aria-pressed={isActive}
            className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
          >
            {/* 36x36 Sharp Square Fabric Swatch */}
            <div
              style={{ backgroundColor: jacket.hex }}
              className={`w-9 h-9 border-2 border-black transition-all ${
                isActive
                  ? 'outline-[3px] outline-[#dc2626] scale-105 shadow-[2px_2px_0px_0px_#000000]'
                  : 'group-hover:scale-105 hover:border-black/80'
              }`}
            />
            {/* Bilingual Label */}
            <span
              className={`font-mono text-[10px] uppercase tracking-wider ${
                isActive ? 'font-black text-black' : 'text-stone-500 group-hover:text-black'
              }`}
            >
              {jacket.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

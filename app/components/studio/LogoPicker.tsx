'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Visual catalog grid for selecting the desired Berserk embroidery motif.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Handles user selection clicks and manages active thumbnail state.
 *
 * SCROLLABLE CONTAINER DESIGN:
 * Wrapped in `max-h-[280px] overflow-y-auto` with a border. As the workshop adds
 * more embroidery motifs over time, this prevents the options column from blowing
 * up and pushing contact inputs off the page.
 *
 * HOW IT CONNECTS:
 * - Rendered by `StudioPanel.tsx`.
 * - Receives motifs list from `LOGOS` in `lib/studio/logos.ts`.
 * ============================================================================
 */

import React from 'react';
import { Logo, LOGOS } from '@/lib/studio';

interface LogoPickerProps {
  /** Currently selected logo ID */
  value: string;
  /** Callback triggered when user picks a logo */
  onChange: (id: string) => void;
  /** Available logo options (defaults to workshop catalogue LOGOS) */
  logos?: Logo[];
}

export default function LogoPicker({
  value,
  onChange,
  logos = LOGOS,
}: LogoPickerProps) {
  return (
    <div className="border-2 border-black p-2 bg-stone-100 max-h-[280px] overflow-y-auto select-none">
      <div className="grid grid-cols-3 gap-2">
        {logos.map((logo) => {
          const isActive = value === logo.id;

          return (
            <button
              key={logo.id}
              type="button"
              onClick={() => onChange(logo.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center justify-between p-2 bg-white transition-all cursor-pointer group text-center ${
                isActive
                  ? 'border-[3px] border-[#dc2626] shadow-[2px_2px_0px_0px_#dc2626]'
                  : 'border-2 border-black hover:bg-stone-50'
              }`}
            >
              {/* Motif Preview Thumbnail Box */}
              <div className="relative w-full aspect-square mb-1.5 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.path}
                  alt={logo.label}
                  className="absolute inset-0 h-full w-full object-contain p-1 transition-transform group-hover:scale-105"
                />
              </div>

              {/* Bilingual Title */}
              <div className="w-full">
                <span
                  className={`block font-mono text-[9px] font-bold uppercase truncate leading-tight ${
                    isActive ? 'text-[#dc2626]' : 'text-black'
                  }`}
                >
                  {logo.label}
                </span>
                <span className="block font-mono text-[8px] text-stone-500 truncate leading-tight">
                  {logo.japaneseLabel}
                </span>
                {!logo.canRecolor && (
                  <span className="mt-1 block font-mono text-[8px] leading-tight text-stone-600">
                    Original colors
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

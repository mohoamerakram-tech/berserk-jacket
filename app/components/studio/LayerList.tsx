'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Displays the list of embroidery layers placed on the current perspective.
 * Allows selecting a layer to activate the editing toolbar, or deleting it.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Handles user selection and layer deletion clicks.
 *
 * HOW IT CONNECTS:
 * - Rendered in `StudioPanel.tsx` in the right column beneath `AddLogoButton`.
 * ============================================================================
 */

import React from 'react';
import { Logo, LogoColorSwatch, StudioLayer } from '@/lib/studio/types';

interface LayerListProps {
  /** Layers placed on the current view */
  layers: StudioLayer[];
  /** Motif catalog for thumbnail asset lookup */
  logos: Logo[];
  /** Thread palette catalog for color dot lookup */
  colors: LogoColorSwatch[];
  /** Currently selected layer ID (if any) */
  selectedLayerId: string | null;
  /** Maximum capacity for current view */
  max: number;
  /** Callback when user clicks a layer to select it */
  onSelect: (id: string) => void;
  /** Callback when user clicks delete */
  onDelete: (id: string) => void;
}

export default function LayerList({
  layers,
  logos,
  colors,
  selectedLayerId,
  max,
  onSelect,
  onDelete,
}: LayerListProps) {
  return (
    <div className="space-y-2 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between font-mono text-[11px] font-bold tracking-wider text-black border-b border-stone-300 pb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[#dc2626]">◆</span>
          <span>PLACED LOGOS ON THIS SIDE // 配置済みロゴ</span>
        </div>
        <span className="text-stone-500 font-mono text-[10px]">
          {layers.length} / {max}
        </span>
      </div>

      {/* Layer Rows or Empty State */}
      {layers.length === 0 ? (
        <div className="p-4 border-2 border-dashed border-stone-300 bg-stone-50 text-center">
          <p className="font-mono text-[11px] text-stone-500 uppercase tracking-wider">
            NO LOGOS YET — PICK A MOTIF AND CLICK ADD // まだロゴがありません
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
          {layers.map((layer, index) => {
            const logo = logos.find((l) => l.id === layer.logoId) || logos[0];
            const color =
              colors.find((c) => c.id === layer.colorId) || colors[0];
            const isSelected = selectedLayerId === layer.id;

            return (
              <div
                key={layer.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(layer.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(layer.id);
                  }
                }}
                className={`p-2 border-2 border-black flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-100 border-l-[6px] border-l-[#dc2626] shadow-[2px_2px_0px_0px_#000000]'
                    : 'bg-white hover:bg-stone-50'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Layer index tag */}
                  <span className="font-mono text-[10px] text-stone-400 font-bold shrink-0">
                    #{index + 1}
                  </span>

                  {/* 32x32 Thumbnail */}
                  <div className="w-8 h-8 shrink-0 bg-stone-900 border border-black flex items-center justify-center p-0.5 relative overflow-hidden">
                    {logo.canRecolor ? (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: color.hex,
                          WebkitMaskImage: `url(${logo.path})`,
                          maskImage: `url(${logo.path})`,
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${logo.path})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-xs text-black truncate uppercase leading-tight">
                      {logo.label}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-stone-500 uppercase mt-0.5">
                      <span className="bg-black text-white px-1 py-0.2 text-[9px] font-bold">
                        SIZE: {layer.size[0].toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full border border-black/50"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.label}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Delete Action */}
                <button
                  type="button"
                  aria-label={`Remove ${logo.label} from garment`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(layer.id);
                  }}
                  className="px-2 py-1 font-mono text-xs font-bold text-[#dc2626] hover:bg-red-50 hover:text-red-700 active:bg-red-100 border border-transparent hover:border-[#dc2626] transition-all cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Compact floating action toolbar for the currently selected embroidery layer.
 * Allows instant in-context editing (size tier, thread color, and deletion)
 * directly above the preview canvas without searching through the right column.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Handles inline click events to mutate the active layer in place.
 *
 * BEHAVIOR WHEN NO LAYER IS SELECTED:
 * Returns `null` so it cleanly disappears when clicking off layers.
 *
 * HOW IT CONNECTS:
 * - Mounted in `StudioPreview.tsx` directly above `JacketPreview`.
 * ============================================================================
 */

import React from 'react';
import { Logo, LogoColor, LogoSize, StudioLayer } from '@/lib/studio/types';
import { LOGO_COLORS, LOGO_SIZES } from '@/lib/studio/options';

interface LayerToolbarProps {
  /** Currently selected layer (null if none selected) */
  layer: StudioLayer | null;
  /** Resolved motif details for the selected layer */
  logo: Logo | null;
  /** Callback to update properties on the selected layer */
  onChange: (patch: Partial<StudioLayer>) => void;
  /** Callback to delete the selected layer */
  onDelete: () => void;
}

export default function LayerToolbar({
  layer,
  logo,
  onChange,
  onDelete,
}: LayerToolbarProps) {
  // If no layer is actively selected, do not render the toolbar
  if (!layer || !logo) {
    return null;
  }

  return (
    <div
      role="toolbar"
      aria-label="Layer quick edit controls"
      className="w-full bg-white border-2 border-black p-2.5 shadow-[3px_3px_0px_0px_#dc2626] flex flex-wrap items-center justify-between gap-3 select-none transition-all"
    >
      {/* Label indicating which motif is currently selected */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="w-2 h-2 bg-[#dc2626]" />
        <span className="font-mono font-black text-[11px] text-black uppercase truncate">
          EDITING: {logo.label}
        </span>
      </div>

      {/* Control cluster: Size buttons, Color swatches, and Delete button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Mini Size Selector */}
        <div className="flex items-center border border-black overflow-hidden">
          {LOGO_SIZES.map((sizeOpt) => {
            const isSizeActive = layer.size === sizeOpt.id;
            return (
              <button
                key={sizeOpt.id}
                type="button"
                onClick={() => onChange({ size: sizeOpt.id as LogoSize })}
                className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase transition-all cursor-pointer ${
                  isSizeActive
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-stone-200'
                }`}
              >
                {sizeOpt.label[0]}
              </button>
            );
          })}
        </div>

        {/* Mini Thread Color Swatches (hidden if motif is non-recolorable) */}
        {logo.canRecolor && (
          <div className="flex items-center gap-1">
            {LOGO_COLORS.map((c) => {
              const isColorActive = layer.colorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  onClick={() => onChange({ colorId: c.id as LogoColor })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-5 h-5 rounded-full border border-black cursor-pointer transition-transform ${
                    isColorActive
                      ? 'scale-110 ring-2 ring-[#dc2626] ring-offset-1'
                      : 'hover:scale-110'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Delete Layer Action */}
        <button
          type="button"
          onClick={onDelete}
          className="font-mono text-[10px] font-bold text-[#dc2626] hover:text-white hover:bg-[#dc2626] border border-[#dc2626] px-1.5 py-0.5 uppercase transition-all cursor-pointer"
        >
          ✕ DELETE
        </button>
      </div>
    </div>
  );
}

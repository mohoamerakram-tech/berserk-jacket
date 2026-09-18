'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Big tactile manga button to commit the currently configured motif (pendingLogoId,
 * pendingColorId, pendingSize) as a new independent layer on the active perspective.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Receives click events and dynamic capacity states (`canAddMore`, count, limit).
 *
 * HOW IT CONNECTS:
 * - Rendered in `StudioPanel.tsx` directly under the pending option pickers
 *   (Motif, Thread Color, Size).
 * ============================================================================
 */

import React from 'react';
import { StudioView } from '@/lib/studio/types';

interface AddLogoButtonProps {
  /** Active perspective orientation ('front' | 'back') */
  view: StudioView;
  /** Current number of layers on this view */
  count: number;
  /** Maximum layers permitted on this view (3 for front, 6 for back) */
  max: number;
  /** Whether additional layers can be added (count < max) */
  canAdd: boolean;
  /** Callback to append the pending configuration as a new layer */
  onAdd: () => void;
}

export default function AddLogoButton({
  view,
  count,
  max,
  canAdd,
  onAdd,
}: AddLogoButtonProps) {
  const viewLabel = view === 'front' ? 'FRONT' : 'BACK';
  const viewJapanese = view === 'front' ? '表面' : '裏面';

  return (
    <div className="space-y-1.5 select-none">
      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        className={`w-full py-3.5 px-4 font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black transition-all flex items-center justify-center gap-2 ${
          canAdd
            ? 'bg-black text-white hover:bg-stone-900 active:bg-stone-800 shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer'
            : 'bg-stone-200 text-stone-500 border-stone-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>＋ ADD LOGO TO {viewLabel}</span>
        <span className="text-[11px] opacity-80">
          ({count}/{max})
        </span>
        <span className="text-xs text-[#dc2626] font-bold ml-1">
          [{viewJapanese}]
        </span>
      </button>

      <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase tracking-widest px-0.5">
        <span>MAX 3 LOGOS ON FRONT // MAX 6 LOGOS ON BACK</span>
        {!canAdd && (
          <span className="text-[#dc2626] font-bold">
            LIMIT REACHED // 上限到達
          </span>
        )}
      </div>
    </div>
  );
}

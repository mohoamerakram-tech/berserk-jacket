'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Two-state toggle button allowing the customer to switch between the FRONT
 * and BACK perspectives of the garment.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Attaches `onClick` event handlers to notify the parent studio container of
 * view orientation changes.
 *
 * WHY THIS REPLACES 3D ROTATION:
 * Full 3D rendering with Three.js requires megabytes of 3D meshes, orbital
 * touch controls, and runs slowly on mobile devices.
 * In production e-commerce (Printful, Printify, Redbubble), two crisp 2D studio
 * photography perspectives give customers the "rotation" they need instantly
 * with zero lag or cognitive friction.
 *
 * HOW IT CONNECTS:
 * - Mounted in `app/components/studio/StudioPreview.tsx` directly above the preview canvas.
 * ============================================================================
 */

import React from 'react';
import { StudioView } from '@/lib/studio';

interface ViewToggleProps {
  /** Active perspective view */
  view: StudioView;
  /** Callback when user clicks FRONT or BACK */
  onViewChange: (view: StudioView) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-3 select-none">
      {/* FRONT Perspective Button */}
      <button
        type="button"
        onClick={() => onViewChange('front')}
        aria-pressed={view === 'front'}
        className={`px-5 py-2 font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
          view === 'front'
            ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
            : 'bg-white text-black hover:bg-stone-100 hover:shadow-[2px_2px_0px_0px_#000000]'
        }`}
      >
        FRONT // 表
      </button>

      {/* BACK Perspective Button */}
      <button
        type="button"
        onClick={() => onViewChange('back')}
        aria-pressed={view === 'back'}
        className={`px-5 py-2 font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
          view === 'back'
            ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
            : 'bg-white text-black hover:bg-stone-100 hover:shadow-[2px_2px_0px_0px_#000000]'
        }`}
      >
        BACK // 裏
      </button>
    </div>
  );
}

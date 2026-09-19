'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * High-definition garment preview canvas displaying the selected jacket mockup
 * (front or back perspective) overlaid with all configured embroidery layers.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * - Uses `next/image`'s `onError` to provide graceful degradation if jacket photo
 *   assets are missing.
 * - Handles pointer move/up events for dragging individual layers with
 *   pointer capture and coordinate clamping (3%–97%).
 *
 * PERSPECTIVE ISOLATION:
 * Front and Back maintain separate layer arrays. Switching views swaps which
 * array is rendered. Nothing is lost, nothing is copied.
 *
 * HOW IT CONNECTS:
 * - Rendered inside `app/components/studio/StudioPreview.tsx`.
 * ============================================================================
 */

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  JacketColor,
  MAX_LAYERS,
  StudioLayer,
  StudioView,
  LOGOS,
  LOGO_COLORS,
  LOGO_SIZE_SCALE,
} from '@/lib/studio';
import LogoOverlay from './LogoOverlay';

interface JacketPreviewProps {
  /** Active garment color option */
  jacket: JacketColor;
  /** Active perspective orientation ('front' | 'back') */
  view: StudioView;
  /** Placed layers for THIS view only */
  layers: StudioLayer[];
  /** Currently selected layer ID */
  selectedLayerId: string | null;
  /** Callback when a layer is clicked/selected */
  onSelectLayer: (id: string) => void;
  /** Callback when a layer property (e.g. coordinates) changes */
  onChangeLayer: (id: string, patch: Partial<StudioLayer>) => void;
}

export default function JacketPreview({
  jacket,
  view,
  layers,
  selectedLayerId,
  onSelectLayer,
  onChangeLayer,
}: JacketPreviewProps) {
  // Determine the active mockup path based on current front/back orientation
  const activeImagePath = view === 'front' ? jacket.frontImage : jacket.backImage;

  // Track image load failures per image path so missing files gracefully degrade
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});
  const imageError = activeImagePath ? Boolean(failedSrcs[activeImagePath]) : false;

  const handleImageError = () => {
    if (activeImagePath) {
      setFailedSrcs((prev) => ({ ...prev, [activeImagePath]: true }));
    }
  };

  // Ref to the jacket canvas wrapper for measuring bounding box during drag
  const jacketWrapRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------------------------------------
  // DRAGGING STATE VIA REF:
  // We store the actively dragged layer ID in a ref instead of state so high-frequency
  // pointermove events can execute calculations smoothly without intermediate re-renders.
  // --------------------------------------------------------------------------
  const draggingIdRef = useRef<string | null>(null);

  const handlePointerDownLayer = (
    e: React.PointerEvent<HTMLDivElement>,
    layerId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    draggingIdRef.current = layerId;
    onSelectLayer(layerId);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Gracefully handled if browser denies capture
    }
  };

  const handleWrapperPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingIdRef.current || !jacketWrapRef.current) return;
    const rect = jacketWrapRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp coordinates to 3%–97% so the embroidery motif never clips or escapes the jacket frame
    const xPercent = Math.min(97, Math.max(3, rawX));
    const yPercent = Math.min(97, Math.max(3, rawY));

    onChangeLayer(draggingIdRef.current, { xPercent, yPercent });
  };

  const handleWrapperPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingIdRef.current) {
      if (
        e.target instanceof HTMLElement &&
        typeof e.target.hasPointerCapture === 'function' &&
        e.target.hasPointerCapture(e.pointerId)
      ) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch {
          // Gracefully handled if browser state already released
        }
      }
      draggingIdRef.current = null;
    }
  };

  const maxCapacity = MAX_LAYERS[view];
  const isAtCapacity = layers.length >= maxCapacity;

  // The height cap keeps the entire preview visible while its column is sticky.
  return (
    <div
      ref={jacketWrapRef}
      onPointerMove={handleWrapperPointerMove}
      onPointerUp={handleWrapperPointerUp}
      onPointerCancel={handleWrapperPointerUp}
      className="relative w-full aspect-[4/5] max-h-[70vh] bg-stone-950 border-[3px] border-black overflow-hidden select-none shadow-sm flex items-center justify-center"
      role="region"
      aria-label="Garment Embroidery Live Preview Canvas"
      style={{
        // touchAction: 'none' ensures single-finger mobile drag does NOT scroll the page
        touchAction: 'none',
      }}
    >
      {/* Background Jacket Mockup Photography */}
      {!imageError && activeImagePath ? (
        <Image
          src={activeImagePath}
          alt={`${jacket.label} - ${view.toUpperCase()} Perspective`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain object-center transition-all duration-200"
          onError={handleImageError}
        />
      ) : (
        /* Graceful Missing Mockup Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-950 text-white space-y-2">
          <div className="w-24 h-28 border-2 border-dashed border-stone-700 flex items-center justify-center text-xs font-mono text-stone-500 mb-1">
            {view.toUpperCase()}
          </div>
          <span className="bg-black text-white font-mono text-xs font-bold px-2 py-1 uppercase tracking-wider border border-white/40">
            JACKET MOCKUP MISSING // 画像準備中
          </span>
          <span className="text-[#dc2626] font-mono text-[11px] font-bold uppercase tracking-wide">
            ADD FILE: public/images/studio/jacket-{jacket.id}-{view}.png
          </span>
          <p className="font-mono text-[10px] text-stone-500 max-w-xs">
            Drop your mockup into public/images/studio/ to display real photography.
          </p>
        </div>
      )}

      {/* Subtle vignette layer for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Top-Left Manga Tag Badge */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-white/40">
          PREVIEW // プレビュー
        </span>
      </div>

      {/* Bottom-Left Perspective Watermark */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <span className="bg-black/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-white/40">
          VIEW: {view.toUpperCase()} {'//'} {view === 'front' ? '表' : '裏'}
        </span>
      </div>

      {/* Bottom-Right Layer Capacity Counter Badge */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
        <span
          className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-white/40 transition-colors ${
            isAtCapacity
              ? 'bg-[#dc2626] text-white'
              : 'bg-black text-white'
          }`}
        >
          {layers.length} / {maxCapacity} ELEMENTS
        </span>
      </div>

      {/* Dynamic logo and text overlays for all layers on this side. */}
      {layers.map((layer) => {
        // Text layers skip the logo catalog entirely.
        const logo =
          layer.type === 'logo'
            ? LOGOS.find((item) => item.id === layer.logoId) || LOGOS[0]
            : undefined;
        const colorSwatch =
          LOGO_COLORS.find((c) => c.id === layer.colorId) || LOGO_COLORS[0];
        const sizePercent = LOGO_SIZE_SCALE[layer.size] ?? 22;
        const isSelected = selectedLayerId === layer.id;

        return (
          <LogoOverlay
            key={layer.id}
            layer={layer}
            logo={logo}
            colorHex={colorSwatch.hex}
            sizePercent={sizePercent}
            isSelected={isSelected}
            onPointerDown={(e) => handlePointerDownLayer(e, layer.id)}
          />
        );
      })}
    </div>
  );
}

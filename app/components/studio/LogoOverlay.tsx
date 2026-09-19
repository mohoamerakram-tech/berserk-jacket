'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Projects a logo or text embroidery layer onto the jacket preview canvas.
 * Both branches share positioning, selection outlines, and drag behavior.
 * Supports pointer-down drag initiation and dynamic selection outlines.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Receives pointer interaction events and renders selection states.
 *
 * HOW IT CONNECTS:
 * - Rendered by `JacketPreview.tsx` for each layer in the active view's layer array.
 * ============================================================================
 */

import React from 'react';
import { Logo, StudioLayer, TEXT_FONTS } from '@/lib/studio';

interface LogoOverlayProps {
  /** The layer configuration instance (coordinates, size, color) */
  layer: StudioLayer;
  /** Resolved motif details; text layers intentionally omit this prop */
  logo?: Logo;
  /** Resolved CSS hex color for thread stencil */
  colorHex: string;
  /** Logo width in percent of jacket width */
  sizePercent: number;
  /** Whether this layer is actively selected for editing */
  isSelected: boolean;
  /** Pointer down handler to initiate drag gesture on the jacket wrapper */
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  /** Container aspect ratio (defaults to 1:1) */
  aspect?: number;
}

export default function LogoOverlay({
  layer,
  logo,
  colorHex,
  sizePercent,
  isSelected,
  onPointerDown,
  aspect = 1,
}: LogoOverlayProps) {
  // Resolve the chosen font only for customer-entered text layers.
  const textFont =
    layer.type === 'text'
      ? TEXT_FONTS.find((font) => font.id === layer.fontId) || TEXT_FONTS[0]
      : null;
  const accessibleLabel =
    layer.type === 'text' ? layer.text : logo?.label || 'Embroidery logo';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${accessibleLabel} - Drag to reposition or click to edit`}
      onPointerDown={onPointerDown}
      className={`absolute select-none z-10 transition-[outline] active:cursor-grabbing cursor-grab ${
        isSelected
          ? 'outline-2 outline-dashed outline-[#dc2626] outline-offset-4'
          : 'hover:outline-1 hover:outline-dashed hover:outline-stone-400 hover:outline-offset-2'
      }`}
      style={{
        left: `${layer.xPercent}%`,
        top: `${layer.yPercent}%`,
        width: `${sizePercent}%`,
        aspectRatio: `${aspect}`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
        touchAction: 'none',
        // Container units make text scale with the same size tiers as logo artwork.
        containerType: 'inline-size',
      }}
    >
      {layer.type === 'text' ? (
        // Text uses the same scalable box while preserving a single unbroken line.
        <div className="flex h-full w-full items-center justify-center pointer-events-none">
          <span
            className="uppercase"
            style={{
              color: colorHex,
              fontFamily: textFont?.cssFamily,
              fontSize: '18cqw',
              fontWeight: 900,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {layer.text}
          </span>
        </div>
      ) : logo?.canRecolor ? (
        // Dynamic thread stencil: background color filled through CSS mask-image
        <div
          aria-hidden="true"
          className="w-full h-full pointer-events-none"
          style={{
            backgroundColor: colorHex,
            WebkitMaskImage: `url(${logo.path})`,
            maskImage: `url(${logo.path})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        />
      ) : logo ? (
        // Non-recolorable fallback (photographic or full-color graphic)
        <div
          aria-hidden="true"
          className="w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${logo.path})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        />
      ) : null}
    </div>
  );
}

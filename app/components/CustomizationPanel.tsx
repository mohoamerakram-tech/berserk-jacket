/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Dual Diagonal Split Manga Panel Spread (Panels 04 & 05) on the homepage.
 *
 * WHY IT EXISTS:
 * Promotes Custom Studio embroidery (Panel 04) and Bespoke Artwork Import (Panel 05)
 * using authentic diagonal manga speed-slash geometry (`clip-path: polygon(...)`).
 *
 * HOW IT CONNECTS:
 * - Rendered in `app/page.tsx` (Row 3 of the 5-panel homepage spread).
 * - Directs users to `/custom-studio` (Preset mode) and `/custom-studio?tab=import`.
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Shared tactile manga CTA button styling for Panels 04 & 05.
 */
const CTA_BUTTON_CLASSES =
  'bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-2 sm:py-2.5 px-4 sm:px-5 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';

interface CustomizationPanelProps {
  /** Callback triggered when user clicks 'Try Custom ->' on Panel 04 */
  onTryCustom?: () => void;
  /** Callback triggered when user clicks 'Import Design ->' on Panel 05 */
  onImportDesign?: () => void;
  /** Optional Tailwind class overrides */
  className?: string;
}
export default function CustomizationPanel({
  onTryCustom,
  onImportDesign,
  className = '',
}: CustomizationPanelProps) {

  return (
    <div
      className={`relative w-full h-[240px] sm:h-[300px] md:h-[340px] overflow-hidden bg-white shadow-sm border-[3px] border-black ${className}`}
    >
      {/* ===================================================================
          PANEL 04: LEFT SLANTED PANEL (Customization Studio with Image)
         =================================================================== */}
      <div
        className="absolute inset-0 overflow-hidden bg-black"
        style={{
          clipPath: 'polygon(0% 0%, 51% 0%, 33% 100%, 0% 100%)',
        }}
      >
        {/* Background Image filling Panel 04 strictly */}
        <Image
          src="/images/back-des1.jpg"
          alt="Berserk Custom Embroidered Jacket Back Design"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Subtle dark vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Panel 04 Direct Manga Typography Overlay (NO background box) */}
        <div className="relative z-10 h-full p-4 sm:p-5 flex flex-col justify-between max-w-[46%] sm:max-w-[42%]">
          {/* Top Label */}
          <div>
            <span className="bg-black/80 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider border border-white/60 inline-block drop-shadow-[0_1px_3px_black]">
              PANEL 04 // 踠く者
            </span>
          </div>

          {/* Bottom Manga Narrative Copy & CTA Button directly on image */}
          <div className="space-y-2 sm:space-y-2.5">
            <div className="space-y-0.5">
              <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase flex items-center gap-1 drop-shadow-[0_1px_3px_black]">
                <span>◆</span>
                <span>CUSTOM STUDIO // 自由の鉄器</span>
              </div>
              <h3 className="font-sans font-black text-xs sm:text-sm md:text-base uppercase tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_0_2px_4px_black,_0_0_8px_black]">
                FORGE YOUR OWN PATH.
              </h3>
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 font-bold leading-tight drop-shadow-[0_1px_3px_black] [text-shadow:_0_1px_3px_black]">
                CUSTOMIZE YOUR GEAR WITH OUR EXCLUSIVE EMBROIDERED LOGOS.
              </p>
            </div>

            {onTryCustom ? (
              <button
                type="button"
                onClick={onTryCustom}
                id="panel4-try-custom-cta"
                className={CTA_BUTTON_CLASSES}
              >
                <span>Try Custom</span>
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <Link
                href="/custom-studio"
                id="panel4-try-custom-cta"
                className={CTA_BUTTON_CLASSES}
              >
                <span>Try Custom</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          PANEL 05: RIGHT SLANTED PANEL (Import Custom Designs Feature)
         =================================================================== */}
      <div
        className="absolute inset-0 overflow-hidden bg-black"
        style={{
          clipPath: 'polygon(53% 0%, 100% 0%, 100% 100%, 35% 100%)',
        }}
      >
        {/* Background Image filling Panel 05 strictly respecting the diagonal split */}
        <Image
          src="/images/import-custom.jpg"
          alt="Import Custom Designs and Garments"
          fill
          priority
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Panel 05 Direct Manga Typography Overlay (NO background boxes or semi-transparent overlays) */}
        <div className="relative z-10 h-full p-4 sm:p-5 flex flex-col justify-between items-end text-right">
          {/* Top Label */}
          <div>
            <span className="bg-black/80 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider border border-white/60 inline-block drop-shadow-[0_1px_3px_black]">
              PANEL 05 // 特注仕様
            </span>
          </div>

          {/* Bottom Narrative Copy & CTA Button directly over image with strong text shadow */}
          <div className="space-y-2 sm:space-y-2.5 max-w-[80%] sm:max-w-[70%] md:max-w-[62%] flex flex-col items-end">
            <div className="space-y-0.5">
              <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase flex items-center justify-end gap-1 drop-shadow-[0_1px_3px_black] [text-shadow:_0_2px_4px_black]">
                <span>BESPOKE EMBROIDERY // 特注刺繍</span>
                <span>◆</span>
              </div>
              <h3 className="font-sans font-black text-xs sm:text-sm md:text-base uppercase tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_0_2px_4px_black,_0_0_8px_black]">
                Bring your vision to reality.
              </h3>
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-200 font-bold leading-tight drop-shadow-[0_1px_3px_black] [text-shadow:_0_2px_4px_black,_0_0_6px_black]">
                Import your own garments and logos for premium custom embroidery.
              </p>
            </div>

            {onImportDesign ? (
              <button
                type="button"
                onClick={onImportDesign}
                id="panel5-import-design-cta"
                className={CTA_BUTTON_CLASSES}
              >
                <span>Import Design</span>
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <Link
                href="/custom-studio?tab=import"
                id="panel5-import-design-cta"
                className={CTA_BUTTON_CLASSES}
              >
                <span>Import Design</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          SVG CRISP BLACK BORDER OVERLAY (Diagonal Slash & Outer Borders)
         =================================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Panel 4 Border (Left) */}
        <polygon
          points="2,2 510,2 330,498 2,498"
          fill="none"
          stroke="#000000"
          strokeWidth="6"
        />
        {/* Panel 5 Border (Right) */}
        <polygon
          points="530,2 998,2 998,498 350,498"
          fill="none"
          stroke="#000000"
          strokeWidth="6"
        />
      </svg>
    </div>
  );
}


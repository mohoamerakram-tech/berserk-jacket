'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Props for the modular EmptyState component
 */
export interface EmptyStateProps {
  /** Primary headline (e.g. '404 // STRUGGLER LOST' or 'VAULT LOCKED') */
  title: string;
  /** Explanatory narrative copy */
  description: string;
  /** Optional badge/tag label displayed above the title (e.g. 'PANEL ERROR // 迷宮') */
  badge?: string;
  /** Optional Japanese kanji or lore subtitle */
  loreText?: string;
  /** Optional call-to-action button label */
  buttonText?: string;
  /** Optional link destination for the CTA button */
  buttonHref?: string;
  /** Optional click handler if using a button instead of a link */
  onButtonClick?: () => void;
  /** Optional additional CSS layout overrides */
  className?: string;
}

/**
 * EmptyState: Modular, high-contrast manga-themed empty / not-found state component
 * 
 * Features:
 * - Berserk Dark Manga Aesthetic: Deep black backdrop, subtle stone borders, and high-contrast typography.
 * - Manuscript Lore Elements: Optional Japanese glyphs, decorative crosshair markers (┼), and panel badges.
 * - Tactile Retro Manga CTA: High-contrast button with 2px black border and red drop shadow.
 * - Fully Reusable: Directly drop into empty lookbooks, vault sections, search results, or the global 404 page.
 */
export default function EmptyState({
  title,
  description,
  badge = 'STATUS // 虚無',
  loreText = '「因果の彼方へ消え去った記憶――」',
  buttonText,
  buttonHref = '/',
  onButtonClick,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`relative w-full max-w-2xl mx-auto border-[3px] border-black bg-stone-950 text-white p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center select-none ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Background Decorative Manga Halftone / Grid Elements */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" 
        aria-hidden="true" 
      />

      {/* Decorative Corner Crosshairs */}
      <span className="absolute top-2 left-2 text-[10px] font-mono text-stone-600 pointer-events-none">┼</span>
      <span className="absolute top-2 right-2 text-[10px] font-mono text-stone-600 pointer-events-none">┼</span>
      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-600 pointer-events-none">┼</span>
      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-600 pointer-events-none">┼</span>

      {/* Top Manga Tag Badge */}
      {badge && (
        <div className="relative z-10 mb-4">
          <span className="bg-red-600 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 uppercase tracking-widest border border-white/40 shadow-sm inline-flex items-center gap-1.5">
            <span className="text-[8px]">◆</span>
            <span>{badge}</span>
          </span>
        </div>
      )}

      {/* Main Manga Headline */}
      <h2 className="relative z-10 font-sans font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white mb-2 leading-tight [text-shadow:_0_2px_8px_rgba(0,0,0,0.9)]">
        {title}
      </h2>

      {/* Japanese Lore Subtitle */}
      {loreText && (
        <p className="relative z-10 font-serif italic text-xs sm:text-sm text-stone-400 mb-4 tracking-wider">
          {loreText}
        </p>
      )}

      {/* Inter-divider line */}
      <div className="relative z-10 w-24 h-[1px] bg-red-600/70 mb-4" aria-hidden="true" />

      {/* Explanatory Narrative Description */}
      <p className="relative z-10 font-mono text-xs sm:text-sm text-stone-300 max-w-md mb-8 leading-relaxed uppercase tracking-wider">
        {description}
      </p>

      {/* Call to Action Button */}
      {buttonText && (
        <div className="relative z-10">
          {buttonHref ? (
            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3 px-6 sm:px-8 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{buttonText}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onButtonClick}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3 px-6 sm:px-8 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{buttonText}</span>
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

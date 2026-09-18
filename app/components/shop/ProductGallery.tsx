'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Renders an interactive multi-image product gallery with a main view and
 * selectable thumbnail strip.
 *
 * WHY THIS MUST BE A CLIENT COMPONENT:
 * It manages local state via `useState` to track the user's currently-selected
 * image index and switches the active preview on thumbnail click.
 *
 * HOW IT CONNECTS:
 * Imported in `app/shop/[slug]/page.tsx` to replace the single static image view.
 * ============================================================================
 */

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  /** List of product image paths (minimum 1) */
  images: string[];
  /** Descriptive alt text for screen readers and SEO */
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  // Track the index of the currently displayed image
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Safe fallback to prevent runtime crashes if an empty array was passed
  const activeImage = images[selectedIndex] || images[0] || '/images/front-designe-new.jpg';

  // Guard: If only one image is available, render the main image without thumbnail controls
  const hasMultipleImages = images.length > 1;

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Primary Feature Display: High-resolution main image frame */}
      <div className="relative w-full aspect-[4/5] bg-black border-[3px] border-black overflow-hidden select-none">
        <Image
          src={activeImage}
          alt={`${alt} - View ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-200"
        />

        {/* Manga Panel Index Indicator: Displays current plate number (e.g., IMG 01 / 03) */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-white/40">
            IMG {String(selectedIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* 2. Thumbnail Strip: Only rendered when multiple images exist */}
      {hasMultipleImages && (
        <div 
          className="flex items-center gap-2 overflow-x-auto pb-1 select-none"
          role="tablist"
          aria-label="Product thumbnails"
        >
          {images.map((imgSrc, idx) => {
            const isSelected = selectedIndex === idx;

            return (
              <button
                key={`${imgSrc}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                role="tab"
                aria-selected={isSelected}
                aria-label={`View photo ${idx + 1}`}
                className={`relative w-16 h-20 shrink-0 bg-stone-900 overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-[#dc2626] shadow-[2px_2px_0px_0px_#dc2626]'
                    : 'border-2 border-black opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${alt} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { ANIME_LOGOS } from './constants';

/**
 * AnimeMarquee: Infinite sliding horizontal showcase of partner anime logos
 * - Duplicates the ANIME_LOGOS array 2x so that CSS translateX(-50%) creates
 *   a seamless, uninterrupted infinite loop.
 * - Pauses scrolling on mouse hover for interactive accessibility.
 */
export default function AnimeMarquee() {
  // 2x duplicated array ensures continuous infinite CSS translation
  const marqueeItems = [...ANIME_LOGOS, ...ANIME_LOGOS];

  return (
    <div 
      className="w-full bg-black text-white border-b-2 border-black overflow-hidden py-3 select-none transition-all duration-300"
      role="region"
      aria-label="Partner Anime Series"
    >
      <div className="flex items-center">
        {/* CSS .animate-marquee translates 0% -> -50% indefinitely */}
        <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.href || '#'}
              className="flex items-center gap-3 shrink-0 opacity-85 hover:opacity-100 transition-opacity group px-3 py-1"
            >
              {/* Logo icon container */}
              <div className="relative h-8 sm:h-10 w-24 sm:w-28 flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt={`${item.name} Logo`}
                  width={112}
                  height={40}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Series title */}
              <span className="text-xs font-mono tracking-wider uppercase text-stone-300 group-hover:text-white">
                {item.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


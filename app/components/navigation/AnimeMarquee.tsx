'use client';

import React from 'react';
import Image from 'next/image';
import { ANIME_LOGOS } from './constants';

export default function AnimeMarquee() {
  // Duplicate items for seamless continuous looping
  const marqueeItems = [...ANIME_LOGOS, ...ANIME_LOGOS];

  return (
    <div className="w-full bg-black text-white border-b-2 border-black overflow-hidden py-3 select-none transition-all duration-300">
      <div className="flex items-center">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.href || '#'}
              className="flex items-center gap-3 shrink-0 opacity-85 hover:opacity-100 transition-opacity group px-3 py-1"
            >
              <div className="relative h-8 sm:h-10 w-24 sm:w-28 flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt={`${item.name} Logo`}
                  width={112}
                  height={40}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
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

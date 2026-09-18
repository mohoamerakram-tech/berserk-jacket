'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Renders an interactive category filter bar for the /shop catalogue.
 *
 * WHY THIS MUST BE A CLIENT COMPONENT:
 * It uses browser navigation hooks (`useRouter`, `useSearchParams`, `usePathname`)
 * and handles click events to update the category query parameter.
 *
 * WHY WE USE URL SEARCH PARAMS INSTEAD OF LOCAL `useState`:
 * 1. Bookmarkable & Shareable: Users can copy/share `?category=hoodie` links.
 * 2. History Friendly: Browser back and forward buttons work seamlessly.
 * 3. SSR Compatible: The Server Component parent (`app/shop/page.tsx`) reads the
 *    URL directly on the server to render pre-filtered HTML for search crawlers.
 *
 * HOW IT CONNECTS:
 * Imported in `app/shop/page.tsx`. Reads category options from `lib/products.ts`.
 * ============================================================================
 */

import React, { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/products';
import { ProductCategory } from '@/lib/types';

export default function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Active category defaults to 'all' if no parameter is in the URL
  const currentCategory = (searchParams.get('category') as ProductCategory) || 'all';

  const handleSelectCategory = (value: ProductCategory | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('category'); // Clean URL when displaying all products
    } else {
      params.set('category', value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // NOTE: For launch, the catalog focuses exclusively on heavyweight hoodies.
  // Rendering two options ("ALL" and "HOODIES") preserves the authentic manga-panel
  // navigation aesthetic and URL bookmarking while keeping the interface focused.
  return (
    <nav 
      className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none select-none"
      aria-label="Product Categories"
    >
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.value;

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleSelectCategory(cat.value)}
            className={`flex flex-col items-center justify-center px-4 py-2 border-2 border-black transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
                : 'bg-white text-black hover:bg-stone-100 hover:shadow-[2px_2px_0px_0px_#000000]'
            }`}
          >
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {cat.label}
            </span>
            <span className="text-[9px] font-mono opacity-70">
              {cat.japaneseLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

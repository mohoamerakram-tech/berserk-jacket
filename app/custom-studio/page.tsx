'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Route page for `/custom-studio` featuring a 2-mode tab interface:
 * 1. PRESET STUDIO (Panel 04): Interactive live embroidery studio (<StudioPanel />)
 *    where users configure garment fabric, Berserk motifs, thread colors, sizes,
 *    and placements with real-time visual simulation.
 * 2. IMPORT BESPOKE (Panel 05): Background removal and interactive jacket preview
 *    for customer PNG / JPG artwork.
 * ============================================================================
 */

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StudioPanel from '@/app/components/studio/StudioPanel';
import BespokeStudio from '@/app/components/studio/BespokeStudio';
import { useCatalog } from '@/lib/catalog/client';

function CustomStudioContent() {
  const searchParams = useSearchParams();
  const { collections, loading } = useCatalog();
  const collectionSlug = searchParams.get('collection');
  const collection = collectionSlug ? collections.find((item) => item.slug === collectionSlug) : undefined;
  const initialTab = searchParams.get('tab') === 'import' ? 'import' : 'preset';

  const [activeTab, setActiveTab] = useState<'preset' | 'import'>(initialTab);
  return (
    <div className="flex-1 min-w-0 flex flex-col space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
            特注制作所
          </span>
          <span className="font-bold text-black uppercase">
            CUSTOM STUDIO // 特注刺繍
          </span>
        </div>
        <Link href={collection ? `/collection/${collection.slug}` : '/'} className="hover:underline font-bold text-black">
          ◄ {collection ? `RETURN TO ${collection.name.toUpperCase()}` : 'RETURN HOME'}
        </Link>
      </header>

      {collection && <div className="flex flex-wrap items-center justify-between gap-3 border-[3px] border-black bg-[#dc2626] px-4 py-3 text-white"><div><p className="font-mono text-[9px] font-black uppercase tracking-widest">Selected collection // 選択中</p><p className="text-xl font-black uppercase">{collection.name} · {collection.japaneseName}</p></div><Link href="/collection" className="border-2 border-white px-3 py-2 font-mono text-[10px] font-black uppercase hover:bg-white hover:text-black">Change collection</Link></div>}

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 border-[3px] border-black bg-stone-100 p-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`py-2.5 text-xs font-mono font-black uppercase transition-all cursor-pointer ${
            activeTab === 'preset'
              ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
              : 'bg-white text-black hover:bg-stone-200'
          }`}
        >
          ◆ 1. PRESET STUDIO (PANEL 04)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`py-2.5 text-xs font-mono font-black uppercase transition-all cursor-pointer ${
            activeTab === 'import'
              ? 'bg-black text-white shadow-[2px_2px_0px_0px_#dc2626]'
              : 'bg-white text-black hover:bg-stone-200'
          }`}
        >
          ◆ 2. IMPORT BESPOKE (PANEL 05)
        </button>
      </div>

      {/* Tab 1: Interactive Preset Studio */}
      <div key="preset-studio-container" className={activeTab === 'preset' ? 'block' : 'hidden'}>
        {collectionSlug && loading ? <div className="p-12 text-center font-mono text-xs">LOADING COLLECTION MOTIFS...</div> : <StudioPanel collectionId={collection?.id} collectionName={collection?.name} restrictToCollection={Boolean(collectionSlug)} />}
      </div>

      {/* Tab 2: Bespoke Import Studio (keeps uploaded artwork alive across tab switches) */}
      <div key="bespoke-studio-container" className={activeTab === 'import' ? 'block' : 'hidden'}>
        <BespokeStudio />
      </div>

      {/* Manga Footer */}
      <footer className="flex items-center justify-between pt-2.5 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
        <span className="font-bold text-black">FUTURE STITCH MANU // BESPOKE STUDIO</span>
        <span className="font-bold text-black">TAJIMA INDUSTRIAL EMBROIDERY</span>
      </footer>
    </div>
  );
}

export default function CustomStudioPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-5xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Studio Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ CUSTOM ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            己の印を、鉄と糸で刻め
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 特注工房 】
          </span>
        </aside>

        {/* Suspense wrapper for Next.js App Router client params */}
        <Suspense fallback={<div className="flex-1 p-12 text-center font-mono text-xs">LOADING STUDIO...</div>}>
          <CustomStudioContent />
        </Suspense>

        {/* Right Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Studio Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ BERSERK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            世界に唯一つの甲冑を創り出せ
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 職人 】
          </span>
        </aside>

      </div>
    </main>
  );
}

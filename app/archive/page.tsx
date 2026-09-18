/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Server Component page rendering the historical manifesto and specs at `/archive`.
 *
 * WHY IT EXISTS:
 * Pays homage to Kentaro Miura and Studio Gaga, presents manufacturing specifications
 * of the embroidery process, and showcases sealed historical vault releases.
 *
 * HOW IT CONNECTS:
 * - Route `/archive` linked from Navbar navigation (`NAV_LINKS`).
 * - Links users to `/shop` via `<EmptyState />` to acquire active catalog pieces.
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';
import EmptyState from '@/app/components/ui/EmptyState';

export default function ArchivePage() {
  const specs = [
    { label: 'BASE GARMENT', val: '480 GSM Japanese Heavyweight Cotton Twill' },
    { label: 'THREAD SPEC', val: 'High-Tensile Rayon & Metallized Polyester' },
    { label: 'TOTAL STITCH COUNT', val: '184,200 Precision Japanese Embroidery Stitches' },
    { label: 'HARDWARE', val: 'Matte Gunmetal Industrial Rivets & Zippers' },
    { label: 'ORIGIN', val: 'Studio Gaga Licensed Archive // Kentaro Miura' },
    { label: 'EDITION STATUS', val: 'Strictly Limited Tankobon Manuscript First Edition' },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Archive Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ ARCHIVE ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            三浦建太郎先生の魂へ捧ぐ
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 永久保存 】
          </span>
        </aside>

        {/* Central Manga Archive Spread */}
        <div className="flex-1 min-w-0 flex flex-col space-y-6">
          
          {/* Top Header */}
          <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                永久保存記録
              </span>
              <span className="font-bold text-black">
                ARCHIVE // 永劫の記録
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:underline font-bold text-black">
                ◄ HOME
              </Link>
              <span>|</span>
              <span className="font-bold text-black border border-black px-1">
                DOC. 001
              </span>
            </div>
          </header>

          {/* Tribute & Philosophical Manifesto Banner */}
          <div className="border-[3px] border-black bg-black text-white p-6 sm:p-8 space-y-4">
            <div className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
              <span>◆</span>
              <span>HISTORICAL MANIFESTO // 追悼の碑</span>
            </div>
            <h1 className="font-sans font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight leading-tight">
              TRIBUTE TO KENTARO MIURA & STUDIO GAGA
            </h1>
            <p className="font-mono text-xs sm:text-sm text-stone-300 leading-relaxed uppercase">
              Berserk is not merely ink on paper; it is an unyielding testament to the human spirit struggling against the currents of causality. Every garment forged in this archive is treated as holy armor — heavy, dark, and indestructible.
            </p>
            <div className="pt-2 font-serif italic text-xs text-stone-400 border-t border-stone-800">
              「背負ったものの重みだけ、前へ進める――」
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="border-[3px] border-black bg-white p-6">
            <h2 className="font-sans font-black text-base sm:text-lg uppercase tracking-tight text-black mb-4 border-b border-black pb-2 flex items-center justify-between">
              <span>MANUFACTURING SPECIFICATIONS // 製造仕様</span>
              <span className="font-mono text-xs text-red-600 font-bold">100% EMBROIDERED</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map((item, idx) => (
                <div key={idx} className="border border-stone-300 p-3 bg-stone-50">
                  <span className="block font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    {item.label}
                  </span>
                  <span className="block font-mono text-xs font-bold text-black uppercase mt-1">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Vault Status using EmptyState */}
          <EmptyState
            title="PAST RELEASES SEALED"
            badge="ARCHIVE VAULT // 過去録"
            loreText="「かつて鍛えられし甲冑は、選ばれし者の手へ――」"
            description="All archival prototype jackets from the 2024 Golden Age capsule have been dispatched to collectors worldwide. Explore the current active release."
            buttonText="ACQUIRE ACTIVE PIECE (300 Dh)"
            buttonHref="/shop"
          />

          {/* Manga Footer */}
          <footer className="flex items-center justify-between pt-2.5 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black">HAKUSENSHA / YOUNG ANIMAL</span>
            <span className="font-bold text-black">STUDIO GAGA ARCHIVE</span>
          </footer>

        </div>

        {/* Right Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Archive Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ BERSERK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            神も悪魔も、己の剣で薙ぎ払え
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 記録 】
          </span>
        </aside>

      </div>
    </main>
  );
}

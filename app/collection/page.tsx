/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Server Component page rendering the curated editorial /collection showcase.
 *
 * WHY IT EXISTS:
 * Serves as an editorial look at primary releases (The Black Swordsman Edition,
 * Bespoke Studio garments, and upcoming capsule teasers) in manga tankobon format.
 *
 * HOW IT CONNECTS:
 * - Route `/collection` linked from primary Navbar navigation (`NAV_LINKS`).
 * - Links users to `/shop/berserker-armor-jacket` for ordering active pieces.
 * - Uses `<EmptyState />` for upcoming capsule collection notifications.
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/app/components/ui/EmptyState';

export default function CollectionPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Collection Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ COLLECTION ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            神域の衣を纏い、運命を切り拓け
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 作品群 】
          </span>
        </aside>

        {/* Central Manga Manuscript Spread */}
        <div className="flex-1 min-w-0 flex flex-col space-y-6">
          
          {/* Top Header */}
          <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                公式製品目録
              </span>
              <span className="font-bold text-black">
                COLLECTION // 珠玉の鎧
              </span>
            </div>
            <span className="font-bold text-black border border-black px-1">
              VOL. 01
            </span>
          </header>

          {/* Featured Product Card 01: Berserk Heavyweight Embroidered Jacket */}
          <div className="border-[3px] border-black bg-stone-950 text-white overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[260px] bg-black">
              <Image
                src="/images/front-designe-new.jpg"
                alt="Berserk Heavyweight Embroidered Jacket"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 border border-white/60">
                ARTIFACT 01 // 珠玉の刺繍
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span>◆</span>
                  <span>THE BLACK SWORDSMAN EDITION</span>
                </div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-white leading-tight">
                  BERSERK EMBROIDERED JACKET
                </h2>
                <p className="font-mono text-xs text-stone-300 uppercase leading-relaxed">
                  Indestructible heavy-gauge thread relief on 480 GSM Japanese twill cotton. Triple-reinforced seam construction designed to endure the branding eclipse.
                </p>
                <div className="text-sm font-mono font-bold text-stone-100 pt-1">
                  PRICE: <span className="text-red-500 text-base font-black">300 Dh</span> (FREE EXPRESS SHIPPING)
                </div>
              </div>

              <div>
                <Link
                  href="/shop/berserker-armor-jacket"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs tracking-widest py-3 px-6 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>ORDER ARTIFACT - 300 Dh</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Product Card 02: Bespoke Custom Garment */}
          <div className="border-[3px] border-black bg-stone-950 text-white overflow-hidden shadow-sm flex flex-col md:flex-row-reverse">
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[260px] bg-black">
              <Image
                src="/images/back-des1.jpg"
                alt="Berserk Custom Studio Jacket"
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 border border-white/60">
                ARTIFACT 02 // 自由の鉄器
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span>◆</span>
                  <span>CUSTOM STUDIO & BESPOKE IMPORT</span>
                </div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-white leading-tight">
                  BESPOKE EMBROIDERY STUDIO
                </h2>
                <p className="font-mono text-xs text-stone-300 uppercase leading-relaxed">
                  Choose your custom placement or upload your bespoke artwork. Crafted by our master artisans with industrial Japanese Tajima embroidery systems.
                </p>
              </div>

              <div>
                <Link
                  href="/custom-studio"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs tracking-widest py-3 px-6 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>ENTER CUSTOM STUDIO</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Vault Section with Reusable EmptyState Component */}
          <EmptyState
            title="VAULT LOCKED // CHAPTER 03"
            badge="ARCHIVE // 封印"
            loreText="「因果の螺旋の先、更なる業物が目覚める――」"
            description="The Dragonslayer Waxed Canvas Trench and Skull Knight Rider Armor are currently in master prototyping. Explore our visual lookbook while the forge heats."
            buttonText="EXPLORE EDITORIAL LOOKBOOK"
            buttonHref="/lookbook"
          />

          {/* Manga Footer */}
          <footer className="flex items-center justify-between pt-2.5 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black">FUTURE STITCH MANU // STUDIO GAGA</span>
            <span className="font-bold text-black">HAKUSENSHA OFFICIAL LICENSE</span>
          </footer>

        </div>

        {/* Right Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Collection Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ BERSERK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            因果の螺旋に抗う、黒い剣士の咆哮――!!
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 三浦建太郎 】
          </span>
        </aside>

      </div>
    </main>
  );
}

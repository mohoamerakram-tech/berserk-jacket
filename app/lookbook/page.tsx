/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Server Component page rendering the editorial visual chronicle at `/lookbook`.
 *
 * WHY IT EXISTS:
 * Displays high-contrast studio photography of the heavy-gauge garments in real
 * editorial settings, styling details, and production notes.
 *
 * HOW IT CONNECTS:
 * - Route `/lookbook` linked from Navbar navigation (`NAV_LINKS`).
 * - Links to `/custom-studio` and `/collection`.
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/app/components/ui/EmptyState';

export default function LookbookPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Lookbook Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ LOOKBOOK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            黒き狂戦士の軌跡を記録せよ
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 写真帳 】
          </span>
        </aside>

        {/* Central Manga Lookbook Spread */}
        <div className="flex-1 min-w-0 flex flex-col space-y-6">
          
          {/* Top Header */}
          <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                公式写真集
              </span>
              <span className="font-bold text-black">
                LOOKBOOK // 視覚年代記
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:underline font-bold text-black">
                ◄ HOME
              </Link>
              <span>|</span>
              <span className="font-bold text-black border border-black px-1">
                VOL. 01
              </span>
            </div>
          </header>

          {/* Editorial Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Editorial Look 01 */}
            <div className="border-[3px] border-black bg-black relative h-80 sm:h-96 overflow-hidden group">
              <Image
                src="/images/front-designe-new.jpg"
                alt="Look 01: Front Embroidery Heavy Gauge"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-[9px] font-mono text-red-500 font-bold tracking-widest uppercase">
                  PLATE 01 // 正面甲冑
                </span>
                <h3 className="font-sans font-black text-base sm:text-lg uppercase text-white leading-tight">
                  THE BLACK SWORDSMAN CHEST RELIEF
                </h3>
                <p className="font-mono text-[10px] text-stone-300 uppercase">
                  Macro detail of the heavy-gauge 120,000 stitch chest emblem.
                </p>
              </div>
            </div>

            {/* Editorial Look 02 */}
            <div className="border-[3px] border-black bg-black relative h-80 sm:h-96 overflow-hidden group">
              <Image
                src="/images/back-des1.jpg"
                alt="Look 02: Full Back Tapestry"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-[9px] font-mono text-red-500 font-bold tracking-widest uppercase">
                  PLATE 02 // 背面狂気
                </span>
                <h3 className="font-sans font-black text-base sm:text-lg uppercase text-white leading-tight">
                  BERSERKER ECLIPSE BACK RELIEF
                </h3>
                <p className="font-mono text-[10px] text-stone-300 uppercase">
                  High-density embroidery covering the full shoulder blade span.
                </p>
              </div>
            </div>

          </div>

          {/* Look 03: Full-Bleed Bespoke Showcase */}
          <div className="border-[3px] border-black bg-black relative h-64 sm:h-80 overflow-hidden group">
            <Image
              src="/images/import-custom.jpg"
              alt="Look 03: Bespoke Custom Import"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[9px] font-mono text-red-500 font-bold tracking-widest uppercase">
                  PLATE 03 // 特注刺繍
                </span>
                <h3 className="font-sans font-black text-lg sm:text-xl uppercase text-white leading-tight">
                  BESPOKE STUDIO EDITORIAL
                </h3>
                <p className="font-mono text-[10px] text-stone-300 uppercase">
                  Custom client garment customized with metallic thread relief.
                </p>
              </div>
              <Link
                href="/custom-studio"
                className="inline-flex items-center justify-center gap-1.5 bg-white text-black font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all self-start sm:self-auto"
              >
                <span>CUSTOM STUDIO</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Lookbook Vol 2 Section using EmptyState */}
          <EmptyState
            title="LOOKBOOK VOL. 02 // IN PRODUCTION"
            badge="EDITORIAL CHRONICLE // 制作中"
            loreText="「次なる光景は、因果の夜明けとともに――」"
            description="Our Tokyo nocturnal editorial showcase featuring the Berserker Armor under rain and neon is currently being curated."
            buttonText="VIEW COLLECTION PIECES"
            buttonHref="/collection"
          />

          {/* Manga Footer */}
          <footer className="flex items-center justify-between pt-2.5 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black">FUTURE STITCH MANU // STUDIO GAGA</span>
            <span className="font-bold text-black">PHOTOGRAPHY BY STUDIO GAGA</span>
          </footer>

        </div>

        {/* Right Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Lookbook Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ BERSERK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            闇を切り裂く、針と糸の意志
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 視覚 】
          </span>
        </aside>

      </div>
    </main>
  );
}

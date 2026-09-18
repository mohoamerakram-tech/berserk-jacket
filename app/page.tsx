import React from 'react';
import DynamicGuts from './components/DynamicGuts';
import CheckoutPanel from './components/CheckoutPanel';
import CustomizationPanel from './components/CustomizationPanel';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white text-black font-sans py-6 sm:py-10 px-3 sm:px-6 overflow-x-hidden flex justify-center">
      {/* 
        Manga Page Spread Container
        Centered on screen with equal left and right margins
      */}
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* =====================================================================
            LEFT MARGIN: Canonical Berserk Quote (Skull Knight to Guts)
            「もがき、足掻き、生き延びろ――それが貴様の抗う道だ」
           ===================================================================== */}
        <aside className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800">
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ MARGIN ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            もがき、足掻き、生き延びろ――それが貴様の抗う道だ
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 髑髏の騎士 】
          </span>
        </aside>

        {/* =====================================================================
            MANGA PAGE MANUSCRIPT (Header + 5 Panels + Footer)
           ===================================================================== */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          {/* Top Manga Header Margin */}
          <header className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                ヤングアニマル特別連載
              </span>
              <span className="font-bold text-black">
                ベルセルク [ BERSERK ]
              </span>
              <span className="text-stone-400 hidden md:inline">|</span>
              <span className="hidden md:inline">第34巻 第315話 「狂戦士の甲冑」</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600 shrink-0">
              <span className="hidden md:inline">【 読み方向 ◄ 右から左へ 】</span>
              <span className="font-bold text-black border border-black px-1">P. 042</span>
            </div>
          </header>

          {/* ===================================================================
              ROW 1: TWO PANELS (Top-Left & Top-Right)
             =================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Panel 1: Sequence 1 (The Black Swordsman, 60 frames) */}
            <div className="border-[3px] border-black bg-black overflow-hidden shadow-sm">
              <DynamicGuts
                sequenceFolder="sequence1"
                totalFrames={60}
                label="PANEL 01 // 黒い剣士"
                className="aspect-[4/3] sm:aspect-square md:aspect-[4/3]"
              />
            </div>

            {/* Panel 2: Sequence 2 (The Berserker Armor, 60 frames) */}
            <div className="border-[3px] border-black bg-black overflow-hidden shadow-sm">
              <DynamicGuts
                sequenceFolder="sequence2"
                totalFrames={60}
                label="PANEL 02 // 狂戦士の甲冑"
                className="aspect-[4/3] sm:aspect-square md:aspect-[4/3]"
              />
            </div>
          </div>

          {/* Inter-row Gutter Margin 1 (Clean line + Japanese Lore) */}
          <div className="my-3 flex items-center gap-2 text-[10px] font-mono text-stone-400 select-none">
            <span className="shrink-0">┼</span>
            <div className="flex-1 h-[1px] bg-stone-300"></div>
            <span className="shrink-0 text-stone-600 font-serif italic text-xs whitespace-nowrap">
              「人は自らの運命の鎖を断ち切ることができるのか」
            </span>
            <div className="flex-1 h-[1px] bg-stone-300"></div>
            <span className="shrink-0">┼</span>
          </div>

          {/* ===================================================================
              ROW 2: PANEL 03 - CHECKOUT & VALUE PROPOSITION CENTERPIECE
             =================================================================== */}
          <CheckoutPanel />

          {/* Inter-row Gutter Margin 2 (Clean line + Japanese Lore) */}
          <div className="my-3 flex items-center gap-2 text-[10px] font-mono text-stone-400 select-none">
            <span className="shrink-0">┼</span>
            <div className="flex-1 h-[1px] bg-stone-300"></div>
            <span className="shrink-0 text-stone-600 font-serif italic text-xs whitespace-nowrap">
              「血塗られた狂気、目覚める災厄――」
            </span>
            <div className="flex-1 h-[1px] bg-stone-300"></div>
            <span className="shrink-0">┼</span>
          </div>

          {/* ===================================================================
              ROW 3: PANEL 04 - CUSTOMIZATION PANEL
             =================================================================== */}
          <CustomizationPanel />

          {/* Bottom Manga Footer Margin */}
          <footer className="flex items-center justify-between pt-2.5 mt-3 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black">白泉社 (HAKUSENSHA)</span>
              <span>/</span>
              <span>スタジオ我画 (STUDIO GAGA)</span>
            </div>
            <div className="hidden sm:block font-serif italic text-stone-500 text-[11px]">
              「夜明けが来るまで、足掻き続けろ」
            </div>
            <div className="font-bold text-black">
              三浦建太郎 (KENTARO MIURA)
            </div>
          </footer>
        </div>

        {/* =====================================================================
            RIGHT MARGIN: Young Animal Serialization Tagline
            「因果の螺旋に抗う、黒い剣士の咆哮――!!」
           ===================================================================== */}
        <aside className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800">
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
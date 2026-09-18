import React from 'react';
import EmptyState from './components/ui/EmptyState';

/**
 * 404 Not Found Page: Berserk Manga Manuscript Error Experience
 * 
 * Layout:
 * - Centered tankobon spread layout matching the aesthetic of the main application.
 * - Vertical Japanese margin asides with Skull Knight philosophical quotes.
 * - Renders the modular <EmptyState /> with custom 404 manga copy.
 */
export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Aside Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Not Found Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ ERROR ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            運命の夜を彷徨う者よ
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 404 】
          </span>
        </aside>

        {/* Central Manga Manuscript Error Container */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Manga Header Bar */}
          <header className="flex items-center justify-between pb-2 mb-4 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                特別欠番
              </span>
              <span className="font-bold text-black">
                ベルセルク [ BERSERK ]
              </span>
            </div>
            <span className="font-bold text-black border border-black px-1">
              ERR. 404
            </span>
          </header>

          {/* Modular Empty State Component */}
          <EmptyState
            title="404 // STRUGGLER LOST"
            badge="PANEL 404 // 虚無の断片"
            loreText="「この頁は因果の帳に記されていない――」"
            description="This panel does not exist in the scroll of fate. Return to the sanctuary before the eclipse begins."
            buttonText="RETURN TO SAFE HAVEN"
            buttonHref="/"
          />

          {/* Manga Footer Margin */}
          <footer className="flex items-center justify-between pt-2.5 mt-4 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black">HAKUSENSHA / STUDIO GAGA</span>
            <span className="font-bold text-black">KENTARO MIURA</span>
          </footer>
        </div>

        {/* Right Japanese Aside Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Not Found Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ BERSERK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            深淵を覗く時、深淵もまた――
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 消失 】
          </span>
        </aside>

      </div>
    </main>
  );
}

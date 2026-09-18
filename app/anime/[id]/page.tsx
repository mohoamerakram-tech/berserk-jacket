import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EmptyState from '@/app/components/ui/EmptyState';
import { ANIME_LOGOS } from '@/app/components/navigation/constants';

interface AnimePageProps {
  params: Promise<{
    id: string;
  }>;
}

/** Franchise-specific Japanese quotes and metadata */
const ANIME_LORE: Record<string, { kanji: string; quote: string; era: string }> = {
  berserk: {
    kanji: 'ベルセルク',
    quote: '「夜明けが来るまで、足掻き続けろ――」',
    era: 'STUDIO GAGA // KENTARO MIURA',
  },
  bleach: {
    kanji: 'ブリーチ',
    quote: '「剣を握らなければ おまえを守れない――」',
    era: 'SOUL SOCIETY ARCHIVE // TITE KUBO',
  },
  'death-note': {
    kanji: 'デスノート',
    quote: '「この世は腐敗している――」',
    era: 'SHINIGAMI CHRONICLE // OHBA & OBATA',
  },
  'dragon-ball': {
    kanji: 'ドラゴンボール',
    quote: '「限界を超えたその先へ――」',
    era: 'CAPSULE CORP SPECIAL // AKIRA TORIYAMA',
  },
  'hunter-x-hunter': {
    kanji: 'ハンター×ハンター',
    quote: '「大切なものは、欲しいものより先に来た――」',
    era: 'HUNTER ASSOCIATION // YOSHIHIRO TOGASHI',
  },
  naruto: {
    kanji: 'ナルト',
    quote: '「まっすぐ自分の言葉は曲げねぇ――それが俺の忍道だ」',
    era: 'KONOHA ARCHIVE // MASASHI KISHIMOTO',
  },
  'one-piece': {
    kanji: 'ワンピース',
    quote: '「おれの仲間になれ!!――」',
    era: 'GRAND LINE EXPEDITION // EIICHIRO ODA',
  },
  chi: {
    kanji: 'チ。 ―地球の運動について―',
    quote: '「命を捨てても、曲げられない信念がある――」',
    era: 'HELIOCENTRIC MANUSCRIPT // UOTO',
  },
};

export default async function AnimePage({ params }: AnimePageProps) {
  const { id } = await params;
  const anime = ANIME_LOGOS.find((item) => item.id === id);

  if (!anime) {
    notFound();
  }

  const lore = ANIME_LORE[id] || {
    kanji: anime.name,
    quote: '「次なる特装版の鍛造を待て――」',
    era: 'OFFICIAL ANIME ARCHIVE',
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Franchise Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ COLLAB ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            {lore.quote.replace(/[「」――]/g, '')}
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 {lore.kanji} 】
          </span>
        </aside>

        {/* Center Manga Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          
          {/* Manga Header */}
          <header className="flex items-center justify-between pb-2 mb-4 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                特装コラボ
              </span>
              <span className="font-bold text-black uppercase">
                {anime.name}
              </span>
              <span className="text-stone-400 hidden md:inline">|</span>
              <span className="hidden md:inline font-serif">{lore.kanji}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:underline font-bold text-black">
                ◄ HOME
              </Link>
            </div>
          </header>

          {/* Franchise Header Banner with official logo */}
          <div className="border-[3px] border-black bg-stone-900 p-6 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-32 shrink-0 flex items-center justify-center bg-black/40 p-1 border border-stone-800">
                <Image
                  src={anime.logo}
                  alt={`${anime.name} Logo`}
                  width={120}
                  height={48}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-red-500 font-bold tracking-widest block">
                  {lore.era}
                </span>
                <h1 className="font-sans font-black text-lg sm:text-xl uppercase tracking-tight text-white">
                  {anime.name} OFFICIAL APPAREL VAULT
                </h1>
              </div>
            </div>

            <div className="text-right font-serif text-xs italic text-stone-400 max-w-xs hidden md:block">
              {lore.quote}
            </div>
          </div>

          {/* EmptyState Component */}
          <EmptyState
            title={`${anime.name} // ARCHIVE SEALED`}
            badge="PRODUCTION PIPELINE // 鋭意制作中"
            loreText={lore.quote}
            description={`The official ${anime.name} heavyweight embroidered capsule collection is currently in development with our master artisans. Pre-orders opening soon.`}
            buttonText="RETURN TO BERSERK ARCHIVE"
            buttonHref="/"
          />

          {/* Manga Footer */}
          <footer className="flex items-center justify-between pt-2.5 mt-4 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black">FUTURE STITCH MANU // STUDIO GAGA</span>
            <span className="font-bold text-black">{lore.era}</span>
          </footer>
        </div>

        {/* Right Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Franchise Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ VAULT ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            神域の衣を纏い、運命を切り拓け
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 公式 】
          </span>
        </aside>

      </div>
    </main>
  );
}

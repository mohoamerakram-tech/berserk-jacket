import React from 'react';
import DynamicGuts from './components/DynamicGuts';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Simple Manga Header */}
        <header className="text-center pb-10 border-b-2 border-black mb-10">
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter">
            BERSERK
          </h1>
          <p className="mt-2 text-sm sm:text-base font-mono text-stone-600 tracking-wide">
            [ HOVER OR DRAG TO INSPECT ANIMATION ]
          </p>
        </header>

        {/* Manga Panels Container */}
        <section className="space-y-12">
          {/* Panel 1 (Sequence 2 - 60 frames) */}
          <DynamicGuts
            sequenceFolder="sequence2"
            totalFrames={60}
            label="PANEL 01"
            caption="Sequence 02 — Berserker Armor (60 frames)"
          />

          {/* Panel 2 (Sequence 1 - 60 frames) */}
          <DynamicGuts
            sequenceFolder="sequence1"
            totalFrames={60}
            label="PANEL 02"
            caption="Sequence 01 — The Black Swordsman (60 frames)"
          />
        </section>

        {/* Simple Footer */}
        <footer className="mt-16 pt-6 border-t-2 border-black text-center text-xs font-mono text-stone-500">
          BERSERK JACKET ARCHIVE
        </footer>
      </div>
    </main>
  );
}
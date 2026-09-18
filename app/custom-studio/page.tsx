'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Route page for `/custom-studio` featuring a 2-mode tab interface:
 * 1. PRESET STUDIO (Panel 04): Interactive live embroidery studio (<StudioPanel />)
 *    where users configure garment fabric, Berserk motifs, thread colors, sizes,
 *    and placements with real-time visual simulation.
 * 2. IMPORT BESPOKE (Panel 05): Custom file upload intake for clients with their
 *    own artwork or vector files.
 * ============================================================================
 */

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StudioPanel from '@/app/components/studio/StudioPanel';

function CustomStudioContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'import' ? 'import' : 'preset';

  const [activeTab, setActiveTab] = useState<'preset' | 'import'>(initialTab);
  const [selectedGarment, setSelectedGarment] = useState('Heavyweight Jacket');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consultId, setConsultId] = useState('');

  const garments = ['Heavyweight Jacket', 'Demon Slayer Hoodie', 'Acid Wash Denim'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Please provide your name and phone number for consultation.');
      return;
    }
    const id = `BESPOKE-${Math.floor(10000 + Math.random() * 90000)}`;
    setConsultId(id);
    setIsSubmitted(true);
  };

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
        <Link href="/" className="hover:underline font-bold text-black">
          ◄ RETURN HOME
        </Link>
      </header>

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
      {activeTab === 'preset' && (
        <StudioPanel />
      )}

      {/* Tab 2: Bespoke Artwork Intake */}
      {activeTab === 'import' && (
        !isSubmitted ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Visual Artwork Preview */}
            <div className="md:col-span-5 space-y-4">
              <div className="border-[3px] border-black bg-stone-950 text-white p-5">
                <div className="relative w-full h-56 bg-black mb-4 overflow-hidden border border-stone-800">
                  <Image
                    src="/images/import-custom.jpg"
                    alt="Custom Studio Artwork"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 border border-white/60">
                    PANEL 05 // 特注仕様
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase block">
                    BRING YOUR VISION TO REALITY
                  </span>
                  <h2 className="font-sans font-black text-base uppercase text-white leading-tight">
                    BESPOKE ARTWORK INTAKE
                  </h2>
                  <p className="font-mono text-xs text-stone-300">
                    Import your own garments or submit custom vector artwork for industrial Japanese Tajima embroidery.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">ESTIMATED VALUATION:</span>
                  <span className="text-red-500 font-black text-sm">
                    From 350 Dh
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Customization Intake Form */}
            <div className="md:col-span-7">
              <form 
                onSubmit={handleSubmit}
                className="border-[3px] border-black bg-white p-6 sm:p-8 space-y-5"
              >
                <div className="border-b-2 border-black pb-2">
                  <h3 className="font-sans font-black text-base uppercase text-black">
                    BESPOKE ARTWORK UPLOAD & NOTES
                  </h3>
                  <p className="font-mono text-[11px] text-stone-600 uppercase">
                    Tailored by our master artisans with high-tensile thread relief.
                  </p>
                </div>

                {/* Garment Base Selection */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
                    GARMENT BASE:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {garments.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGarment(g)}
                        className={`p-2 text-xs font-mono font-bold uppercase border-2 text-center transition-all cursor-pointer ${
                          selectedGarment === g
                            ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#dc2626]'
                            : 'bg-stone-50 text-black border-stone-300 hover:border-black'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
                    UPLOAD ARTWORK / LOGO FILE (.PNG, .JPG, .SVG, .AI):
                  </label>
                  <label className="border-2 border-dashed border-black p-6 bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center cursor-pointer text-center block">
                    <span className="font-mono text-xs font-bold text-black uppercase">
                      {uploadedFileName ? `SELECTED: ${uploadedFileName}` : 'CLICK TO SELECT ARTWORK FILE'}
                    </span>
                    <span className="font-mono text-[10px] text-stone-500 uppercase mt-1">
                      HIGH-RESOLUTION VECTOR OR TRANSPARENT PNG PREFERRED
                    </span>
                    <input
                      type="file"
                      accept="image/*,.ai,.eps,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Client Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-bold uppercase text-black">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Griffith of Falcon"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 border-2 border-black font-mono text-xs text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-bold uppercase text-black">
                      PHONE NUMBER / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+212 600 000 000"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-2.5 border-2 border-black font-mono text-xs text-black"
                    />
                  </div>
                </div>

                {/* Special Design Notes */}
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-bold uppercase text-black">
                    ADDITIONAL SPECIFICATIONS OR SIZING PREFERENCES:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Thread color preferences, dimensions, garment sourcing instructions..."
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    className="w-full p-2.5 border-2 border-black font-mono text-xs text-black resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-stone-900 active:bg-stone-800 text-white font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3.5 px-6 border-2 border-black shadow-[4px_4px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                >
                  <span>REQUEST BESPOKE QUOTE & INTAKE</span>
                  <span className="ml-2" aria-hidden="true">→</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* Confirmation State for Bespoke Import */
          <div className="border-[3px] border-black bg-stone-950 text-white p-8 sm:p-12 text-center space-y-6">
            <div className="inline-block bg-red-600 text-white font-mono font-bold text-xs px-3 py-1 uppercase tracking-widest border border-white/60">
              BESPOKE INTAKE LOGGED // 特注受付完了
            </div>

            <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
              CUSTOM CONSULTATION FORGED
            </h2>

            <p className="font-serif italic text-stone-400 text-sm">
              「職人の魂を込め、貴様だけの業物を創り出さん――」
            </p>

            <div className="max-w-md mx-auto bg-stone-900 border border-stone-800 p-4 text-left font-mono text-xs space-y-2 text-stone-300">
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-500 uppercase">REFERENCE ID:</span>
                <span className="text-white font-bold">{consultId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-500 uppercase">CLIENT:</span>
                <span className="text-white font-bold">{clientName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-500 uppercase">TYPE:</span>
                <span className="text-white font-bold uppercase">IMPORT BESPOKE</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500 uppercase">CONTACT FOR CONSULT:</span>
                <span className="text-red-500 font-bold">{clientPhone}</span>
              </div>
            </div>

            <p className="font-mono text-xs text-stone-400 max-w-sm mx-auto">
              Our master embroidery artisans will contact you directly on WhatsApp to finalize thread samples and mockups.
            </p>

            <div>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3 px-8 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                <span>SUBMIT ANOTHER INTAKE</span>
                <span aria-hidden="true">◄</span>
              </button>
            </div>
          </div>
        )
      )}

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

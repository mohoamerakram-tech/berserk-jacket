import React from 'react';
import Image from 'next/image';
import { StudioView } from '@/lib/studio';
import { BespokeData } from '@/lib/checkout/types';

interface BespokePreviewProps {
  bespokeData: BespokeData | null;
  jacketParam: string | null;
  activeJacketPath: string;
  activePreviewSide: StudioView;
  setActivePreviewSide: (side: StudioView) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onDownloadSnapshots: () => void;
  isGeneratingSnapshots: boolean;
}

export default function BespokePreview({
  bespokeData,
  jacketParam,
  activeJacketPath,
  activePreviewSide,
  setActivePreviewSide,
  selectedSize,
  setSelectedSize,
  onDownloadSnapshots,
  isGeneratingSnapshots,
}: BespokePreviewProps) {
  return (
    <div className="space-y-3">
      {/* Perspective Switcher */}
      <div className="grid grid-cols-2 gap-1 bg-stone-900 p-1 border border-stone-800">
        <button
          type="button"
          onClick={() => setActivePreviewSide('front')}
          className={`py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activePreviewSide === 'front'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          ◆ FRONT ARTWORK
        </button>
        <button
          type="button"
          onClick={() => setActivePreviewSide('back')}
          className={`py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activePreviewSide === 'back'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          ◆ BACK ARTWORK
        </button>
      </div>

      {/* Visual Mockup with Customer Artwork Overlay */}
      <div className="relative w-full aspect-[4/5] bg-stone-950 border border-stone-800 overflow-hidden select-none flex items-center justify-center">
        <Image
          src={activeJacketPath}
          alt="Bespoke Jacket"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-2"
        />

        {/* Front Artwork Overlay */}
        {activePreviewSide === 'front' && bespokeData?.artworks.front?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bespokeData.artworks.front.url}
            alt="Front Artwork Overlay"
            className="absolute pointer-events-none object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            style={{
              left: `${bespokeData.placements.front.x}%`,
              top: `${bespokeData.placements.front.y}%`,
              width: `${bespokeData.placements.front.size}%`,
              transform: `translate(-50%, -50%) rotate(${bespokeData.placements.front.rotation}deg)`,
            }}
          />
        )}

        {/* Back Artwork Overlay */}
        {activePreviewSide === 'back' && bespokeData?.artworks.back?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bespokeData.artworks.back.url}
            alt="Back Artwork Overlay"
            className="absolute pointer-events-none object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            style={{
              left: `${bespokeData.placements.back.x}%`,
              top: `${bespokeData.placements.back.y}%`,
              width: `${bespokeData.placements.back.size}%`,
              transform: `translate(-50%, -50%) rotate(${bespokeData.placements.back.rotation}deg)`,
            }}
          />
        )}

        {/* Fallback if no artwork for side */}
        {((activePreviewSide === 'front' && !bespokeData?.artworks.front?.url) ||
          (activePreviewSide === 'back' && !bespokeData?.artworks.back?.url)) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/80 text-stone-400 text-[10px] font-mono px-3 py-1 border border-stone-800 uppercase">
              NO ARTWORK ON {activePreviewSide.toUpperCase()}
            </span>
          </div>
        )}

        <span className="absolute top-2 left-2 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 border border-white/40 uppercase">
          IMPORT BESPOKE // {activePreviewSide.toUpperCase()}
        </span>
      </div>

      {/* Bespoke Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-black text-sm uppercase text-white">
            BESPOKE CUSTOM ARTWORK JACKET
          </h3>
          <span className="text-[10px] font-mono font-bold bg-white text-black px-1.5 py-0.5 uppercase">
            BASE: {(bespokeData?.jacketId || jacketParam || 'BLACK').toUpperCase()}
          </span>
        </div>
        <p className="font-mono text-[10px] text-stone-400">
          Direct digitizing and industrial embroidery of your custom PNG/JPG artwork
        </p>
      </div>

      {/* Artwork Specs */}
      <div className="border-t border-stone-800 pt-2 space-y-1 text-[10px] font-mono text-stone-300">
        <div className="flex justify-between">
          <span className="text-stone-400">FRONT ARTWORK:</span>
          <span className="font-bold text-white truncate max-w-[170px]">
            {bespokeData?.artworks.front?.name || 'Not configured'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">BACK ARTWORK:</span>
          <span className="font-bold text-white truncate max-w-[170px]">
            {bespokeData?.artworks.back?.name || 'Not configured'}
          </span>
        </div>
      </div>

      {/* Size Selector */}
      <div className="border-t border-stone-800 pt-2 space-y-1.5">
        <label className="block font-mono text-[10px] font-bold uppercase text-stone-300">
          SELECT JACKET SIZE:
        </label>
        <div className="grid grid-cols-5 gap-1">
          {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSize(s)}
              className={`py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                selectedSize === s
                  ? 'bg-red-600 text-white border-white'
                  : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Download Snapshot Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onDownloadSnapshots}
          disabled={isGeneratingSnapshots}
          className="w-full py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
        >
          {isGeneratingSnapshots ? 'GENERATING SNAPSHOTS...' : 'DOWNLOAD FRONT & BACK PREVIEWS'}
        </button>
      </div>
    </div>
  );
}

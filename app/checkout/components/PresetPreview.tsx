'use client';

import React from 'react';
import Image from 'next/image';
import { StudioDraft } from '@/lib/studio/storage';
import {
  StudioView,
  LOGO_COLORS,
  LOGO_SIZE_SCALE,
  LOGOS,
  TEXT_FONTS,
} from '@/lib/studio';
import { useCatalog } from '@/lib/catalog/client';

interface PresetPreviewProps {
  presetDraft: StudioDraft | null;
  activeJacketPath: string;
  activePreviewSide: StudioView;
  setActivePreviewSide: (side: StudioView) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onDownloadSnapshots: () => void;
  isGeneratingSnapshots: boolean;
}

export default function PresetPreview({
  presetDraft,
  activeJacketPath,
  activePreviewSide,
  setActivePreviewSide,
  selectedSize,
  setSelectedSize,
  onDownloadSnapshots,
  isGeneratingSnapshots,
}: PresetPreviewProps) {
  const { logos: catalogLogos } = useCatalog();
  const logos = catalogLogos.length ? catalogLogos : LOGOS;
  const currentSideLayers = presetDraft ? presetDraft.layers[activePreviewSide] : [];

  return (
    <div className="space-y-3">
      {/* Perspective Switcher: Toggle between Front and Back */}
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
          ◆ FRONT ({presetDraft?.layers.front.length || 0} MOTIFS)
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
          ◆ BACK ({presetDraft?.layers.back.length || 0} MOTIFS)
        </button>
      </div>

      {/* Interactive Visual Canvas with Mockup + Placed Logos */}
      <div className="relative w-full aspect-[4/5] bg-stone-950 border border-stone-800 overflow-hidden select-none flex items-center justify-center">
        <Image
          src={activeJacketPath}
          alt="Custom Jacket Base"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-2"
        />

        {/* Top-Left Perspective Watermark */}
        <span className="absolute top-2 left-2 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 border border-white/40 uppercase">
          {activePreviewSide.toUpperCase()} VIEW // {activePreviewSide === 'front' ? '表' : '裏'}
        </span>

        {/* Placed Embroidery Overlays for Active Side */}
        {currentSideLayers.map((layer) => {
          const colorSwatch =
            LOGO_COLORS.find((c) => c.id === layer.colorId) || LOGO_COLORS[0];
          const sizeScale = LOGO_SIZE_SCALE[layer.size] ?? 22;

          if (layer.type === 'logo') {
            const logo = logos.find((l) => l.id === layer.logoId) || logos[0];
            return (
              <div
                key={layer.id}
                className="absolute pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                style={{
                  left: `${layer.xPercent}%`,
                  top: `${layer.yPercent}%`,
                  width: `${sizeScale}%`,
                  aspectRatio: '1',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {logo?.canRecolor ? (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: colorSwatch.hex,
                      WebkitMaskImage: `url(${logo.path})`,
                      maskImage: `url(${logo.path})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.path}
                    alt={logo.label}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            );
          }

          // Text layer
          const textFont =
            TEXT_FONTS.find((f) => f.id === layer.fontId) || TEXT_FONTS[0];
          return (
            <div
              key={layer.id}
              className="absolute pointer-events-none select-none"
              style={{
                left: `${layer.xPercent}%`,
                top: `${layer.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span
                className="uppercase block"
                style={{
                  color: colorSwatch.hex,
                  fontFamily: textFont.cssFamily,
                  fontSize:
                    layer.size === 'small' ? '12px' : layer.size === 'medium' ? '16px' : '22px',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                {layer.text}
              </span>
            </div>
          );
        })}

        {currentSideLayers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/80 text-stone-400 text-[10px] font-mono px-3 py-1 border border-stone-800 uppercase">
              NO MOTIFS ON {activePreviewSide.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Jacket Title & Base Color */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-black text-sm uppercase text-white">
            CUSTOM EMBROIDERED JACKET
          </h3>
          <span className="text-[10px] font-mono font-bold bg-white text-black px-1.5 py-0.5 uppercase">
            BASE: {presetDraft?.jacketColorId.toUpperCase() || 'BLACK'}
          </span>
        </div>
        <p className="font-mono text-[10px] text-stone-400">
          Heavyweight Japanese Twill Cotton · Tajima industrial embroidery relief
        </p>
      </div>

      {/* Front Layers Specification */}
      <div className="border-t border-stone-800 pt-2 space-y-1 text-[10px] font-mono">
        <span className="text-stone-400 font-bold block uppercase">
          FRONT EMBROIDERY ({presetDraft?.layers.front.length || 0}) :
        </span>
        {presetDraft && presetDraft.layers.front.length > 0 ? (
          presetDraft.layers.front.map((layer, idx) => {
            const color =
              LOGO_COLORS.find((c) => c.id === layer.colorId)?.label || layer.colorId;
            return (
              <div key={layer.id} className="flex justify-between text-stone-300">
                <span>
                  {idx + 1}. {layer.type === 'logo' ? 'Logo Motif' : `Text "${layer.text}"`}
                </span>
                <span className="text-stone-400 uppercase">
                  {color} · {layer.size}
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-stone-500">None placed on front</span>
        )}
      </div>

      {/* Back Layers Specification */}
      <div className="border-t border-stone-800 pt-2 space-y-1 text-[10px] font-mono">
        <span className="text-stone-400 font-bold block uppercase">
          BACK EMBROIDERY ({presetDraft?.layers.back.length || 0}) :
        </span>
        {presetDraft && presetDraft.layers.back.length > 0 ? (
          presetDraft.layers.back.map((layer, idx) => {
            const color =
              LOGO_COLORS.find((c) => c.id === layer.colorId)?.label || layer.colorId;
            return (
              <div key={layer.id} className="flex justify-between text-stone-300">
                <span>
                  {idx + 1}. {layer.type === 'logo' ? 'Logo Motif' : `Text "${layer.text}"`}
                </span>
                <span className="text-stone-400 uppercase">
                  {color} · {layer.size}
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-stone-500">None placed on back</span>
        )}
      </div>

      {/* Jacket Size Selector */}
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

'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Central state orchestrator for the Custom Embroidery Studio.
 * Manages separate front & back customization canvases with independent multi-logo
 * layers (max 3 on FRONT, max 6 on BACK).
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Acts as the SINGLE SOURCE OF TRUTH for:
 * - Selected garment base fabric (BLACK or WHITE)
 * - Active perspective view ('front' | 'back')
 * - Independent layer arrays for front and back perspectives:
 *     Record<StudioView, StudioLayer[]>
 * - Currently selected layer ID on the active view
 * - Pending motif configuration (motif, thread color, size) used when adding a new layer
 * - Customer contact details and quote request intake
 *
 * ARCHITECTURAL RULE — INDEPENDENT LAYERS & MULTIPLE COPIES:
 * Each placed logo is an independent StudioLayer with its own id.
 * Placing the same motif twice creates two separate layers — the
 * customer can size, color, and position them independently. The
 * layer `id` (not `logoId`) is what we select, drag, and delete by.
 *
 * PERSISTENCE ON VIEW SWITCH:
 * Front and Back are two independent arrays. Switching views swaps which array
 * is being edited. Nothing is lost, nothing is copied.
 *
 * HOW IT CONNECTS:
 * - Mounted in `app/custom-studio/page.tsx` under the "PRESET STUDIO" tab.
 * - Passes reactive layers and drag handlers to `StudioPreview` (left column).
 * - Houses the option pickers, `AddLogoButton`, and `LayerList` (right column).
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  DEFAULT_LAYER_POSITION,
  LogoColor,
  LogoSize,
  MAX_LAYERS,
  StudioLayer,
  StudioView,
} from '@/lib/studio/types';
import { JACKET_COLORS, LOGO_COLORS } from '@/lib/studio/options';
import { LOGOS } from '@/lib/studio/logos';
import StudioPreview from './StudioPreview';
import OptionGroup from './OptionGroup';
import JacketColorPicker from './JacketColorPicker';
import LogoPicker from './LogoPicker';
import LogoColorPicker from './LogoColorPicker';
import LogoSizePicker from './LogoSizePicker';
import AddLogoButton from './AddLogoButton';
import LayerList from './LayerList';

// Browser-safe unique ID generator
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `layer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export default function StudioPanel() {
  // --------------------------------------------------------------------------
  // STUDIO STATE (Single Source of Truth)
  // --------------------------------------------------------------------------
  const [jacketColorId, setJacketColorId] = useState<string>('black');
  const [view, setView] = useState<StudioView>('front');

  // Initial seed layer so the customer sees an embroidery preview immediately on page load
  const initialFrontLayerId = 'init-front-layer-1';
  const initialFrontLayer: StudioLayer = {
    id: initialFrontLayerId,
    logoId: LOGOS[0]?.id || 'brand-of-sacrifice',
    colorId: 'crimson',
    size: 'medium',
    xPercent: DEFAULT_LAYER_POSITION.front.xPercent,
    yPercent: DEFAULT_LAYER_POSITION.front.yPercent,
  };

  // Note: layers is a Record keyed by view — this automatically gives
  // front and back independent arrays.
  const [layers, setLayers] = useState<Record<StudioView, StudioLayer[]>>({
    front: [initialFrontLayer],
    back: [],
  });

  // Track the actively selected layer for in-context editing
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    initialFrontLayerId
  );

  // Pending motif configuration — staged until the customer clicks "ADD LOGO"
  const [pendingLogoId, setPendingLogoId] = useState<string>(
    LOGOS[0]?.id || 'brand-of-sacrifice'
  );
  const [pendingColorId, setPendingColorId] = useState<LogoColor>('crimson');
  const [pendingSize, setPendingSize] = useState<LogoSize>('medium');

  // Customer Contact Information for Bespoke Quote
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteReference, setQuoteReference] = useState('');

  // --------------------------------------------------------------------------
  // DERIVED DATA RESOLUTION
  // --------------------------------------------------------------------------
  const selectedJacket =
    JACKET_COLORS.find((j) => j.id === jacketColorId) || JACKET_COLORS[0];
  const selectedPendingLogo =
    LOGOS.find((l) => l.id === pendingLogoId) || LOGOS[0];

  const currentLayers = layers[view];
  const currentLimit = MAX_LAYERS[view];
  const canAddMore = currentLayers.length < currentLimit;

  const selectedLayer =
    currentLayers.find((l) => l.id === selectedLayerId) ?? null;

  // --------------------------------------------------------------------------
  // VIEW SWITCHING (Preserves both sides independently)
  // --------------------------------------------------------------------------
  const handleViewChange = (newView: StudioView) => {
    setView(newView);
    // Auto-select first layer of the new view if available
    const targetSideLayers = layers[newView];
    setSelectedLayerId(targetSideLayers[0]?.id ?? null);
  };

  // --------------------------------------------------------------------------
  // LAYER MUTATION ACTIONS
  // --------------------------------------------------------------------------
  // Adding always appends. The customer can then drag, resize (via size buttons), recolor, or delete.
  const addLayer = () => {
    if (!canAddMore) return;
    const newId = generateUUID();
    const newLayer: StudioLayer = {
      id: newId,
      logoId: pendingLogoId,
      colorId: pendingColorId,
      size: pendingSize,
      xPercent: DEFAULT_LAYER_POSITION[view].xPercent,
      yPercent: DEFAULT_LAYER_POSITION[view].yPercent,
    };

    setLayers((prev) => ({
      ...prev,
      [view]: [...prev[view], newLayer],
    }));
    setSelectedLayerId(newId);
  };

  // One updater for every kind of layer edit keeps the code short and consistent.
  const updateLayer = (id: string, patch: Partial<StudioLayer>) => {
    setLayers((prev) => ({
      ...prev,
      [view]: prev[view].map((layer) =>
        layer.id === id ? { ...layer, ...patch } : layer
      ),
    }));
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => ({
      ...prev,
      [view]: prev[view].filter((layer) => layer.id !== id),
    }));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const selectLayer = (id: string) => {
    setSelectedLayerId(id);
  };

  // ============================================================================
  // STEP 9 — ORDER / REQUEST STILL VISUAL ONLY
  // TODO: When business WhatsApp ordering is wired, construct the multi-layer payload:
  // - Garment Base: selectedJacket.label
  // - FRONT LAYERS (up to 3):
  //     layers.front.map(l => `${logo.label} (${l.size.toUpperCase()}, ${l.colorId}, ${l.xPercent}%X, ${l.yPercent}%Y)`)
  // - BACK LAYERS (up to 6):
  //     layers.back.map(l => `${logo.label} (${l.size.toUpperCase()}, ${l.colorId}, ${l.xPercent}%X, ${l.yPercent}%Y)`)
  // - Customer: clientName, Phone: clientPhone, Notes: notes
  // Deep link: https://wa.me/2126XXXXXXXX?text=...
  // ============================================================================
  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Please provide your name and phone number to request a quote.');
      return;
    }
    const generatedRef = `QUOTE-${Math.floor(10000 + Math.random() * 90000)}`;
    setQuoteReference(generatedRef);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full">
      {isSubmitted ? (
        /* Confirmation State */
        <div className="border-[3px] border-black bg-stone-950 text-white p-8 sm:p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
          <div className="inline-block bg-[#dc2626] text-white font-mono font-bold text-xs px-3 py-1 uppercase tracking-widest border border-white/40">
            ORDER INTAKE // 受付完了
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
            QUOTE REQUEST DISPATCHED
          </h2>
          <div className="font-mono text-sm text-stone-300 space-y-1">
            <p>
              REFERENCE:{' '}
              <span className="text-[#dc2626] font-bold">{quoteReference}</span>
            </p>
            <p className="text-xs text-stone-400">
              GARMENT: {selectedJacket.label}
            </p>
            <p className="text-[11px] text-stone-400 font-mono">
              SPECIFICATION: {layers.front.length} FRONT LOGOS / {layers.back.length} BACK LOGOS
            </p>
          </div>
          <p className="font-mono text-xs text-stone-300 max-w-md mx-auto uppercase pt-2">
            Our atelier will contact {clientName} via WhatsApp ({clientPhone}) to confirm thread specifications and delivery timeline.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-4 bg-white hover:bg-stone-200 text-black font-mono font-bold text-xs uppercase px-5 py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] transition-all cursor-pointer"
          >
            CONFIGURE ANOTHER PIECE ◄
          </button>
        </div>
      ) : (
        /* Two-Column Studio Layout */
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-start">
          {/* Column 1: Live Interactive Preview with View Toggle & In-Context Toolbar */}
          <StudioPreview
            jacket={selectedJacket}
            view={view}
            onViewChange={handleViewChange}
            layers={currentLayers}
            selectedLayer={selectedLayer}
            selectedLayerId={selectedLayerId}
            onSelectLayer={selectLayer}
            onChangeLayer={updateLayer}
            onDeleteLayer={removeLayer}
          />

          {/* Column 2: Workshop Option Controls, Add Button, Layer List & Contact */}
          <form
            onSubmit={handleRequestQuote}
            className="border-[3px] border-black bg-white p-6 sm:p-8 space-y-6 shadow-sm"
          >
            {/* Header Title */}
            <div className="border-b-2 border-black pb-3">
              <div className="text-[10px] font-mono text-[#dc2626] font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1">
                <span>◆</span>
                <span>PANEL 04 // PRESET ATELIER</span>
              </div>
              <h2 className="font-sans font-black text-xl uppercase tracking-tight text-black">
                CUSTOM EMBROIDERY CONFIGURATION
              </h2>
              <p className="font-mono text-xs text-stone-600 uppercase">
                Customize Front & Back independently. Drag logos freely.
              </p>
            </div>

            {/* 1. Garment Base Color (Black / White) */}
            <OptionGroup label="1. GARMENT BASE // 生地選択:">
              <JacketColorPicker
                value={jacketColorId}
                onChange={setJacketColorId}
              />
            </OptionGroup>

            {/* Flow Guidance Header */}
            <div className="pt-2 border-t border-stone-200">
              <div className="font-mono font-bold text-xs text-black uppercase tracking-wider">
                PICK A MOTIF, COLOR, AND SIZE — THEN CLICK &apos;ADD LOGO&apos;
              </div>
              <p className="font-mono text-[10px] text-stone-500 uppercase mt-0.5">
                Customize the pending graphic before stamping it onto the garment.
              </p>
            </div>

            {/* 2. Select Embroidery Motif (sets pendingLogoId) */}
            <OptionGroup label="2. SELECT EMBROIDERY MOTIF // 刺繍図案:">
              <LogoPicker
                value={pendingLogoId}
                onChange={setPendingLogoId}
                logos={LOGOS}
              />
            </OptionGroup>

            {/* 3. Thread Color (sets pendingColorId) */}
            <OptionGroup label="3. THREAD COLOR // 糸色選択:">
              <LogoColorPicker
                value={pendingColorId}
                onChange={(id) => setPendingColorId(id as LogoColor)}
                disabled={!selectedPendingLogo.canRecolor}
              />
            </OptionGroup>

            {/* 4. Embroidery Size (sets pendingSize) */}
            <OptionGroup label="4. EMBROIDERY SIZE // 刺繍寸法:">
              <LogoSizePicker
                value={pendingSize}
                onChange={setPendingSize}
              />
            </OptionGroup>

            {/* 5. Add Logo Button */}
            <AddLogoButton
              view={view}
              count={currentLayers.length}
              max={currentLimit}
              canAdd={canAddMore}
              onAdd={addLayer}
            />

            {/* 6. Placed Layers on Current Perspective */}
            <LayerList
              layers={currentLayers}
              logos={LOGOS}
              colors={LOGO_COLORS}
              selectedLayerId={selectedLayerId}
              max={currentLimit}
              onSelect={selectLayer}
              onDelete={removeLayer}
            />

            {/* 7. Contact Details */}
            <div className="border-t-2 border-black pt-4 space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-black">
                CONTACT DETAILS // ご注文者情報
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold uppercase text-black">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guts of the Black Swordsman"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-mono text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold uppercase text-black">
                  PHONE / WHATSAPP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +212 600 000 000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-mono text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold uppercase text-black">
                  SPECIAL WORKSHOP NOTES (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions regarding thread density, sizing, or custom placement requests..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-mono text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#dc2626] resize-none"
                />
              </div>
            </div>

            {/* Estimated Quote & CTA */}
            <div className="pt-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-3 border-t border-stone-200 pt-3">
                <span className="text-stone-600 uppercase">
                  ESTIMATED VALUATION:
                </span>
                <span className="text-[#dc2626] text-base font-black">
                  FROM 350 DH
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-stone-900 active:bg-stone-800 text-white font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3.5 px-6 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <span>REQUEST BESPOKE QUOTE</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Central state orchestrator for the Custom Embroidery Studio.
 * Manages separate front & back customization canvases with independent embroidery
 * layers (max 3 on FRONT, max 3 on BACK).
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Acts as the SINGLE SOURCE OF TRUTH for:
 * - Selected garment base fabric (BLACK or WHITE)
 * - Active perspective view ('front' | 'back')
 * - Independent layer arrays for front and back perspectives:
 *     Record<StudioView, StudioLayer[]>
 * - Currently selected layer ID on the active view
 * - Pending motif selection used when adding a new logo layer
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
 * - Houses the option pickers and `LayerList` (right column).
 * ============================================================================
 */

import { useState } from 'react';
import {
  DEFAULT_LAYER_POSITION,
  MAX_LAYERS,
  StudioLayer,
  StudioLogoLayer,
  StudioTextLayer,
  StudioView,
  TextFontId,
} from '@/lib/studio/types';
import { JACKET_COLORS, LOGO_COLORS } from '@/lib/studio/options';
import { LOGOS } from '@/lib/studio/logos';
import StudioPreview from './StudioPreview';
import OptionGroup from './OptionGroup';
import JacketColorPicker from './JacketColorPicker';
import LogoPicker from './LogoPicker';
import LayerList from './LayerList';
import TextInputSection from './TextInputSection';
import WhatsAppButton from '../shop/WhatsAppButton';

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
  const initialFrontLayer: StudioLogoLayer = {
    type: 'logo',
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
    initialFrontLayer.id
  );

  // The selected motif stays highlighted after it is placed.
  const [pendingLogoId, setPendingLogoId] = useState<string>(
    LOGOS[0]?.id || 'brand-of-sacrifice'
  );

  // --------------------------------------------------------------------------
  // DERIVED DATA RESOLUTION
  // --------------------------------------------------------------------------
  const selectedJacket =
    JACKET_COLORS.find((j) => j.id === jacketColorId) || JACKET_COLORS[0];
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
  // Clicking a motif auto-places a new, independently editable layer on the current view.
  function handleMotifClick(logoId: string) {
    // Keep the picker selection current even when this side is full.
    setPendingLogoId(logoId);
    if (currentLayers.length >= MAX_LAYERS[view]) return;
    // A fresh ID lets repeated copies of the same motif move and delete independently.
    const newId = generateUUID();
    const newLayer: StudioLogoLayer = {
      type: 'logo',
      id: newId,
      logoId,
      // Defaults are hardcoded — customers fine-tune via the EDITING toolbar.
      colorId: 'crimson',
      size: 'medium',
      xPercent: DEFAULT_LAYER_POSITION[view].xPercent,
      yPercent: DEFAULT_LAYER_POSITION[view].yPercent,
    };

    // Append to the active side while preserving the other side's layers.
    setLayers((prev) => ({
      ...prev,
      [view]: [...prev[view], newLayer],
    }));
    // Select the new layer so its outline and editing toolbar appear immediately.
    setSelectedLayerId(newId);
  }

  // Add customer text with the same position and editing behavior as a logo.
  const handleAddText = (text: string, fontId: TextFontId) => {
    if (!canAddMore) return;
    const newLayer: StudioTextLayer = {
      type: 'text',
      id: generateUUID(),
      text,
      fontId,
      colorId: 'crimson',
      size: 'medium',
      xPercent: DEFAULT_LAYER_POSITION[view].xPercent,
      yPercent: DEFAULT_LAYER_POSITION[view].yPercent,
    };

    // Preserve the opposite side while appending text to the active side.
    setLayers((prev) => ({
      ...prev,
      [view]: [...prev[view], newLayer],
    }));
    setSelectedLayerId(newLayer.id);
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

  return (
    <div className="w-full">
      {/* Two-Column Studio Layout */}
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

          {/* Column 2: Workshop Option Controls, Layer List & Quote CTA */}
          <div className="border-[3px] border-black bg-white p-6 sm:p-8 space-y-6 shadow-sm">
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
                CLICK A MOTIF TO PLACE IT. DRAG ON THE JACKET TO POSITION.
              </div>
            </div>

            {/* 2. Select Embroidery Motif (places a new layer) */}
            <OptionGroup label="2. SELECT EMBROIDERY MOTIF // 刺繍図案:">
              <LogoPicker
                value={pendingLogoId}
                onChange={handleMotifClick}
                logos={LOGOS}
              />
            </OptionGroup>

            {/* 3. Customer text becomes a fully editable embroidery layer. */}
            <TextInputSection onAdd={handleAddText} canAdd={canAddMore} />

            {/* Placed layers on the current perspective. */}
            <LayerList
              layers={currentLayers}
              logos={LOGOS}
              colors={LOGO_COLORS}
              selectedLayerId={selectedLayerId}
              max={currentLimit}
              onSelect={selectLayer}
              onDelete={removeLayer}
            />

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

              <WhatsAppButton
                label="REQUEST QUOTE VIA WHATSAPP"
                className="w-full"
              />
            </div>
          </div>
      </div>
    </div>
  );
}

'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Left-column container combining the perspective toggle controls, the contextual
 * layer toolbar (rendered when a layer is selected), and the garment preview canvas.
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * Houses `ViewToggle` and relays selection/mutation actions to `JacketPreview`.
 *
 * HOW IT CONNECTS:
 * - Mounted in `StudioPanel.tsx` as the left sticky column.
 * ============================================================================
 */

import React from 'react';
import { JacketColor, Logo, StudioLayer, StudioView } from '@/lib/studio';
import ViewToggle from './ViewToggle';
import LayerToolbar from './LayerToolbar';
import JacketPreview from './JacketPreview';

interface StudioPreviewProps {
  /** Selected garment color option */
  jacket: JacketColor;
  /** Active perspective orientation ('front' | 'back') */
  view: StudioView;
  /** Perspective toggle callback */
  onViewChange: (view: StudioView) => void;
  /** Placed layers for the currently active view */
  layers: StudioLayer[];
  /** Currently selected layer (null if none selected) */
  selectedLayer: StudioLayer | null;
  /** Currently selected layer ID */
  selectedLayerId: string | null;
  /** Callback when user selects a layer */
  onSelectLayer: (id: string) => void;
  /** Callback when user edits properties on a layer */
  onChangeLayer: (id: string, patch: Partial<StudioLayer>) => void;
  /** Callback when user deletes a layer */
  onDeleteLayer: (id: string) => void;
  logos: Logo[];
}

export default function StudioPreview({
  jacket,
  view,
  onViewChange,
  layers,
  selectedLayer,
  selectedLayerId,
  onSelectLayer,
  onChangeLayer,
  onDeleteLayer,
  logos,
}: StudioPreviewProps) {
  // Resolve motif metadata only when the selected layer is a catalog logo.
  const selectedLogo = selectedLayer?.type === 'logo'
    ? logos.find((l) => l.id === selectedLayer.logoId) || null
    : null;

  // On large screens the preview sticks below the navbar and stays within the viewport.
  return (
    <div className="w-full lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] space-y-3">
      {/* Perspective Switcher Buttons */}
      <ViewToggle view={view} onViewChange={onViewChange} />

      {/* In-Context Layer Toolbar (appears only when a layer is actively selected) */}
      <LayerToolbar
        layer={selectedLayer}
        logo={selectedLogo}
        onChange={(patch) => {
          if (selectedLayer) {
            onChangeLayer(selectedLayer.id, patch);
          }
        }}
        onDelete={() => {
          if (selectedLayer) {
            onDeleteLayer(selectedLayer.id);
          }
        }}
      />

      {/* Main Jacket Canvas with All Placed Layers */}
      <JacketPreview
        jacket={jacket}
        view={view}
        layers={layers}
        selectedLayerId={selectedLayerId}
        onSelectLayer={onSelectLayer}
        onChangeLayer={onChangeLayer}
        logos={logos}
      />
    </div>
  );
}

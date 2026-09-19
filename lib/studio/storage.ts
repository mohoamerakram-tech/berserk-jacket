/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Browser sessionStorage serialization, deserialization, and schema validation
 * for the custom embroidery studio draft state.
 *
 * WHY IT EXISTS:
 * Ensures customer custom designs (layer choices, coordinates, colors, sizes,
 * text) are preserved across page refreshes or tab switches.
 *
 * ARCHITECTURAL RULE — STRICT SANITIZATION:
 * Deserialized data is rigorously validated against live catalogues (colors,
 * sizes, logos, fonts, layer limits) before applying. Malformed, corrupted,
 * or out-of-bounds drafts are safely rejected, falling back to default state.
 * ============================================================================
 */

import { LOGOS } from './logos';
import { JACKET_COLORS, LOGO_COLORS, LOGO_SIZES, TEXT_FONTS } from './options';
import { MAX_LAYERS, StudioLayer, StudioState } from './types';

/** Session storage key namespace for studio draft state */
export const STUDIO_SESSION_KEY = 'future-stitch:studio:v1';

/**
 * StudioDraft represents the persisted state snapshot of the customization studio.
 * Mirrors the canonical StudioState definition.
 */
export type StudioDraft = StudioState;

/**
 * Type guard verifying that an arbitrary object conforms to a valid StudioLayer.
 * Validates layer ID, registered thread colors, registered size tiers, clamped
 * coordinates (0–100%), and registered motif or validated text.
 */
function isLayer(value: unknown): value is StudioLayer {
  if (!value || typeof value !== 'object') return false;
  const layer = value as Record<string, unknown>;

  const hasValidBase =
    typeof layer.id === 'string' &&
    layer.id.length > 0 &&
    LOGO_COLORS.some((color) => color.id === layer.colorId) &&
    LOGO_SIZES.some((size) => size.id === layer.size) &&
    [layer.xPercent, layer.yPercent].every(
      (coord) =>
        typeof coord === 'number' &&
        Number.isFinite(coord) &&
        coord >= 0 &&
        coord <= 100
    );

  if (!hasValidBase) return false;

  if (layer.type === 'logo') {
    return LOGOS.some((logo) => logo.id === layer.logoId);
  }

  if (layer.type === 'text') {
    return (
      typeof layer.text === 'string' &&
      layer.text.trim().length > 0 &&
      layer.text.length <= 16 &&
      TEXT_FONTS.some((font) => font.id === layer.fontId)
    );
  }

  return false;
}

/**
 * Reads and validates the studio draft from sessionStorage.
 * Returns null if no draft exists, if parsing fails, or if data violates domain rules.
 */
export function readStudioDraft(): StudioDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(STUDIO_SESSION_KEY);
    if (!raw) return null;

    const draft = JSON.parse(raw);
    if (
      !draft ||
      !JACKET_COLORS.some((color) => color.id === draft.jacketColorId) ||
      !['front', 'back'].includes(draft.view) ||
      !LOGOS.some((logo) => logo.id === draft.pendingLogoId) ||
      !(draft.selectedLayerId === null || typeof draft.selectedLayerId === 'string') ||
      !draft.layers
    ) {
      return null;
    }

    // Verify both perspectives comply with layer limits and unique IDs
    for (const side of ['front', 'back'] as const) {
      const layers = draft.layers[side];
      if (
        !Array.isArray(layers) ||
        layers.length > MAX_LAYERS[side] ||
        !layers.every(isLayer) ||
        new Set(layers.map((layer) => layer.id)).size !== layers.length
      ) {
        return null;
      }
    }

    return draft as StudioDraft;
  } catch {
    // Malformed JSON or storage permission error; fallback safely to defaults
    return null;
  }
}

/**
 * Persists the current studio draft state to sessionStorage.
 * Fails silently if storage is restricted or quota is exceeded.
 */
export function saveStudioDraft(draft: StudioDraft): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(STUDIO_SESSION_KEY, JSON.stringify(draft));
  } catch {
    // Editing still works even if browser storage is blocked or full
  }
}

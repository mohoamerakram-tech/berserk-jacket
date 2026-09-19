import { LOGOS } from './logos';
import { JACKET_COLORS, LOGO_COLORS, LOGO_SIZES, TEXT_FONTS } from './options';
import { MAX_LAYERS, StudioLayer, StudioView } from './types';

export const STUDIO_SESSION_KEY = 'future-stitch:studio:v1';

export interface StudioDraft {
  jacketColorId: string;
  view: StudioView;
  layers: Record<StudioView, StudioLayer[]>;
  selectedLayerId: string | null;
  pendingLogoId: string;
}

function isLayer(value: unknown): value is StudioLayer {
  if (!value || typeof value !== 'object') return false;
  const layer = value as Record<string, unknown>;
  return typeof layer.id === 'string' && layer.id.length > 0 &&
    LOGO_COLORS.some((color) => color.id === layer.colorId) &&
    LOGO_SIZES.some((size) => size.id === layer.size) &&
    [layer.xPercent, layer.yPercent].every((n) =>
      typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 100
    ) && (
      (layer.type === 'logo' && LOGOS.some((logo) => logo.id === layer.logoId)) ||
      (layer.type === 'text' && typeof layer.text === 'string' &&
        layer.text.trim().length > 0 && layer.text.length <= 16 &&
        TEXT_FONTS.some((font) => font.id === layer.fontId))
    );
}

// Storage may be unavailable in restricted browsers. Keep the editor usable.
export function readStudioDraft(): StudioDraft | null {
  try {
    const raw = window.sessionStorage.getItem(STUDIO_SESSION_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || !JACKET_COLORS.some((color) => color.id === draft.jacketColorId) ||
      !['front', 'back'].includes(draft.view) ||
      !LOGOS.some((logo) => logo.id === draft.pendingLogoId) ||
      !(draft.selectedLayerId === null || typeof draft.selectedLayerId === 'string') ||
      !draft.layers) return null;
    for (const side of ['front', 'back'] as const) {
      const layers = draft.layers[side];
      if (!Array.isArray(layers) || layers.length > MAX_LAYERS[side] ||
        !layers.every(isLayer) || new Set(layers.map((layer) => layer.id)).size !== layers.length) {
        return null;
      }
    }
    return draft as StudioDraft;
  } catch {
    return null;
  }
}

export function saveStudioDraft(draft: StudioDraft): void {
  try {
    window.sessionStorage.setItem(STUDIO_SESSION_KEY, JSON.stringify(draft));
  } catch {
    // Editing still works when browser storage is blocked or full.
  }
}

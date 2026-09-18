/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Core TypeScript domain definitions for the Custom Embroidery Studio.
 *
 * WHY IT EXISTS:
 * Defines the multi-logo layered data model for separate front and back
 * jacket customization:
 * - StudioView: Perspective orientation ('front' | 'back').
 * - StudioLayer: An individual embroidery motif placed on a specific side of the garment,
 *   with its own unique ID, logo reference, thread color, size tier, and coordinates.
 * - MAX_LAYERS: Independent limits per view (max 3 on FRONT, max 6 on BACK).
 * - DEFAULT_LAYER_POSITION: Default drop coordinates when adding a new logo layer.
 *
 * ARCHITECTURAL RULE — INDEPENDENT LAYERS:
 * Placing the same logo twice creates two distinct StudioLayer entries with different IDs.
 * Selecting, dragging, resizing, or deleting one layer never affects another layer.
 *
 * HOW IT CONNECTS:
 * - Consumed across all studio UI components in `app/components/studio/`.
 * - Consumed by option catalogues in `lib/studio/options.ts` and `lib/studio/logos.ts`.
 * ============================================================================
 */

/**
 * The two primary 2D perspectives for garment preview.
 * Front and Back are completely isolated customization canvases.
 */
export type StudioView = 'front' | 'back';

/**
 * Discrete preset embroidery logo sizes.
 * Small (~pocket size), Medium (~chest size), Large (~statement / back size).
 */
export type LogoSize = 'small' | 'medium' | 'large';

/**
 * Standard embroidery thread color options offered by the workshop atelier.
 */
export type LogoColor =
  | 'crimson'
  | 'white'
  | 'black'
  | 'gold'
  | 'silver'
  | 'forest';

/**
 * An individual embroidery logo layer placed on the garment canvas.
 *
 * WHY `id` IS ESSENTIAL:
 * A customer can place the SAME motif multiple times (e.g. one small Brand of Sacrifice
 * on the left chest, and one large Brand of Sacrifice centered on the back).
 * Using a unique `id` (e.g. via `crypto.randomUUID()`) ensures every placed logo can be
 * independently selected, dragged, recolored, resized, and deleted without collision.
 */
export interface StudioLayer {
  /** Unique UUID per layer instance (e.g. crypto.randomUUID()) */
  id: string;
  /** Motif ID referencing LOGOS[].id (e.g. "brand-of-sacrifice") */
  logoId: string;
  /** Thread color ID referencing LOGO_COLORS[].id */
  colorId: LogoColor;
  /** Size tier referencing LOGO_SIZES[].id ('small' | 'medium' | 'large') */
  size: LogoSize;
  /** Horizontal anchor center in percent of garment image width (0 to 100) */
  xPercent: number;
  /** Vertical anchor center in percent of garment image height (0 to 100) */
  yPercent: number;
}

/**
 * Full state snapshot for the custom studio, maintaining independent layer
 * arrays for front and back garment perspectives.
 */
export interface StudioState {
  /** Garment fabric base ('black' | 'white') */
  jacketColorId: string;
  /** Placed layers on garment front (max 3) */
  front: StudioLayer[];
  /** Placed layers on garment back (max 6) */
  back: StudioLayer[];
}

/**
 * Workshop capacity constraints per garment orientation.
 * Strictly enforced in both UI buttons and state management functions.
 */
export const MAX_LAYERS: Record<StudioView, number> = {
  front: 3,
  back: 6,
};

/**
 * Default spawn coordinates for new layers added to each perspective.
 * Front defaults to chest-left (62% X, 30% Y).
 * Back defaults to mid-upper back centerpiece (50% X, 45% Y).
 */
export const DEFAULT_LAYER_POSITION: Record<
  StudioView,
  { xPercent: number; yPercent: number }
> = {
  front: { xPercent: 62, yPercent: 30 },
  back: { xPercent: 50, yPercent: 45 },
};

/**
 * Freeform 2D coordinates helper interface.
 */
export interface LogoPosition {
  xPercent: number;
  yPercent: number;
}

/**
 * Garment base color option with paths to pre-rendered front and back mockup assets.
 */
export interface JacketColor {
  /** Unique color identifier ("black" | "white") */
  id: string;
  /** Bilingual display label (e.g. "BLACK // 黒") */
  label: string;
  /** Relative web path to front mockup image */
  frontImage: string;
  /** Relative web path to back mockup image */
  backImage: string;
  /** CSS hexadecimal code for rendering the color swatch chip */
  hex: string;
}

/**
 * Featured embroidery motif definition.
 */
export interface Logo {
  /** Unique motif identifier (e.g. "brand-of-sacrifice") */
  id: string;
  /** English display name */
  label: string;
  /** Japanese authentic editorial label */
  japaneseLabel: string;
  /** Relative web path to image in /public/images/logos/berserk/ */
  path: string;
  /**
   * Set to true if the asset is a single-color silhouette PNG that can be
   * dynamically recolored in browser memory using the CSS `mask-image` stencil trick.
   * If false (e.g. multi-color artwork or photo), color swatches are disabled.
   */
  canRecolor: boolean;
}

/**
 * Thread color swatch definition.
 */
export interface LogoColorSwatch {
  /** Color key */
  id: LogoColor;
  /** English label */
  label: string;
  /** Hex color value applied to the CSS mask background */
  hex: string;
}

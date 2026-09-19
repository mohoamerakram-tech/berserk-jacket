/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Centralized catalog of studio configuration options:
 * - Garment base colors & mockup file paths
 * - Embroidery thread color swatches
 * - Logo size tiers
 * - Garment placement coordinates & calibrated scaling factors
 *
 * WHY IT EXISTS:
 * Keeps layout math and workshop options in one isolated data file.
 * Changes to thread palettes, pricing tiers, or coordinate calibration
 * require zero changes to UI rendering components.
 *
 * HOW IT CONNECTS:
 * - Consumed by `app/components/studio/StudioPanel.tsx` and child pickers.
 * - Used by `JacketPreview.tsx` and `LogoOverlay.tsx` to position the logo.
 * ============================================================================
 */

import {
  JacketColor,
  LogoColorSwatch,
  LogoSize,
  TextFontId,
} from './types';

// To add more jacket colors later, copy the mockup files into 
// /public/images/studio/ and append a new entry here. Do NOT reference 
// Windows paths — always reference /images/... paths.
export const JACKET_COLORS: JacketColor[] = [
  {
    id: 'black',
    label: 'BLACK // 黒',
    frontImage: '/images/studio/jacket-black-front.png',
    // TODO: real back mockup not provided yet — reusing front for now
    backImage: '/images/studio/jacket-black-front.png',
    hex: '#0a0a0a',
  },
  {
    id: 'white',
    label: 'WHITE // 白',
    frontImage: '/images/studio/jacket-white-front.jpg',
    // TODO: real back mockup not provided yet — reusing front for now
    backImage: '/images/studio/jacket-white-front.jpg',
    hex: '#f5f5f5',
  },
];

/**
 * Workshop embroidery thread color palette.
 * Colors are rendered using CSS mask-image stencil recoloring.
 */
export const LOGO_COLORS: LogoColorSwatch[] = [
  { id: 'crimson', label: 'CRIMSON RED', hex: '#dc2626' },
  { id: 'white', label: 'OFF WHITE', hex: '#f5f5f5' },
  { id: 'black', label: 'BLACK', hex: '#111111' },
  { id: 'gold', label: 'GOLD', hex: '#c9a227' },
  { id: 'silver', label: 'SILVER', hex: '#c0c0c0' },
  { id: 'forest', label: 'FOREST', hex: '#2f4f3a' },
];

/**
 * Discrete logo size options.
 * Matches the tactile button styling used on the product detail page.
 */
export const LOGO_SIZES: { id: LogoSize; label: string; japanese: string }[] = [
  { id: 'small', label: 'SMALL', japanese: '小' },
  { id: 'medium', label: 'MEDIUM', japanese: '中' },
  { id: 'large', label: 'LARGE', japanese: '大' },
];

/**
 * Scaling factors: logo width in percent of jacket image width for each discrete size.
 * Allows the motif to scale responsively according to the selected size tier.
 */
export const LOGO_SIZE_SCALE: Record<LogoSize, number> = {
  small: 14,
  medium: 22,
  large: 34,
};

/** Font choices displayed in the text embroidery controls and placed layers. */
export const TEXT_FONTS: {
  id: TextFontId;
  label: string;
  cssFamily: string;
  category: 'display' | 'serif' | 'stencil' | 'horror' | 'script';
}[] = [
  // Site-core fonts are loaded through next/font in layout.tsx.
  { id: 'geist-sans', label: 'GEIST SANS', cssFamily: 'var(--font-geist-sans)', category: 'display' },
  { id: 'geist-mono', label: 'GEIST MONO', cssFamily: 'var(--font-geist-mono)', category: 'display' },
  { id: 'bebas', label: 'BEBAS', cssFamily: 'var(--font-bebas)', category: 'display' },
  // Display and impact fonts are loaded on demand through globals.css.
  { id: 'anton', label: 'ANTON', cssFamily: '"Anton", sans-serif', category: 'display' },
  { id: 'archivo-black', label: 'ARCHIVO BLACK', cssFamily: '"Archivo Black", sans-serif', category: 'display' },
  { id: 'oswald', label: 'OSWALD', cssFamily: '"Oswald", sans-serif', category: 'display' },
  { id: 'rubik-mono', label: 'RUBIK MONO', cssFamily: '"Rubik Mono One", sans-serif', category: 'display' },
  { id: 'black-ops', label: 'BLACK OPS', cssFamily: '"Black Ops One", sans-serif', category: 'display' },
  { id: 'bungee', label: 'BUNGEE', cssFamily: '"Bungee", sans-serif', category: 'display' },
  // Serif fonts provide epic and editorial alternatives.
  { id: 'cinzel', label: 'CINZEL', cssFamily: '"Cinzel", serif', category: 'serif' },
  { id: 'cinzel-decorative', label: 'CINZEL DECO', cssFamily: '"Cinzel Decorative", serif', category: 'serif' },
  { id: 'playfair', label: 'PLAYFAIR', cssFamily: '"Playfair Display", serif', category: 'serif' },
  { id: 'abril-fatface', label: 'ABRIL FATFACE', cssFamily: '"Abril Fatface", serif', category: 'serif' },
  // Stencil and mono fonts suit technical embroidery treatments.
  { id: 'special-elite', label: 'SPECIAL ELITE', cssFamily: '"Special Elite", monospace', category: 'stencil' },
  { id: 'stardos-stencil', label: 'STARDOS STENCIL', cssFamily: '"Stardos Stencil", monospace', category: 'stencil' },
  { id: 'major-mono', label: 'MAJOR MONO', cssFamily: '"Major Mono Display", monospace', category: 'stencil' },
  // Horror and metal faces fit the Berserk visual language.
  { id: 'metal-mania', label: 'METAL MANIA', cssFamily: '"Metal Mania", cursive', category: 'horror' },
  { id: 'creepster', label: 'CREEPSTER', cssFamily: '"Creepster", cursive', category: 'horror' },
  { id: 'nosifer', label: 'NOSIFER', cssFamily: '"Nosifer", cursive', category: 'horror' },
  // Marker faces provide hand-rendered script options.
  { id: 'permanent-marker', label: 'PERMANENT MARKER', cssFamily: '"Permanent Marker", cursive', category: 'script' },
  { id: 'rock-salt', label: 'ROCK SALT', cssFamily: '"Rock Salt", cursive', category: 'script' },
];

/** Workshop limit for one text embroidery element. */
export const MAX_TEXT_LENGTH = 16;

// Placement presets were removed — the customer positions the 
// logo freely by dragging on the jacket preview.

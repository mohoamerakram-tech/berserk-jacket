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

import { JacketColor, LogoColorSwatch, LogoSize } from './types';

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

// Placement presets were removed — the customer positions the 
// logo freely by dragging on the jacket preview.

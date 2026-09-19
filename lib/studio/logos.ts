// TOTAL MOTIFS: 7 distinct client assets available in the studio picker.

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Catalog of featured Berserk embroidery motifs available in the studio.
 *
 * IMPORTANT: These filenames must match files placed in
 * /public/images/logos/berserk/. If a file is missing, the picker
 * will show a broken image — add the real files or update this
 * list.
 *
 * WHY IT EXISTS:
 * Defines the embroidery artwork database. Each motif has a relative path,
 * bilingual titles for the manga-panel UI, and a `canRecolor` flag indicating
 * whether the CSS mask-image stencil trick can recolor the logo dynamically.
 *
 * HOW IT CONNECTS:
 * - Consumed by `LogoPicker.tsx` to render the motif selection grid.
 * - Consumed by `LogoOverlay.tsx` to project the logo onto the jacket canvas.
 * ============================================================================
 */

import { Logo } from './types';

// All catalog assets are transparent silhouette PNGs, so CSS mask recoloring works.
export const LOGOS: Logo[] = [
  {
    id: '31a8a9561ac58a68fe0773308c365df5',
    label: 'LOGO 01',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/31a8a9561ac58a68fe0773308c365df5.png',
    canRecolor: true,
  },
  {
    id: '50736234f59009a66cc1d0438b83b6e0',
    label: 'LOGO 02',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/50736234f59009a66cc1d0438b83b6e0.png',
    canRecolor: true,
  },
  {
    id: 'bb49072aab092e3bb9831c23d44d0556',
    label: 'LOGO 03',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/bb49072aab092e3bb9831c23d44d0556.png',
    canRecolor: true,
  },
  {
    id: 'de49671aa7750f24cac10e188977726c',
    label: 'LOGO 04',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/de49671aa7750f24cac10e188977726c.png',
    canRecolor: true,
  },
  {
    id: 'fa65d47dc562676bb02c19b9e6bc6adf',
    label: 'LOGO 05',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/fa65d47dc562676bb02c19b9e6bc6adf.png',
    canRecolor: true,
  },
  {
    id: 'gemini-generated-image-3e2uh33e2uh33e2u',
    label: 'LOGO 06',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/gemini-generated-image-3e2uh33e2uh33e2u.png',
    canRecolor: true,
  },
  {
    id: 'screenshot-2026-09-17-182923-upscayl-5x-upscayl-standard-4x',
    label: 'LOGO 07',
    japaneseLabel: '刺繍図案',
    path: '/images/logos/berserk/screenshot-2026-09-17-182923-upscayl-5x-upscayl-standard-4x.png',
    canRecolor: true,
  },
];

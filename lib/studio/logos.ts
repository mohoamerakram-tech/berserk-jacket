// REQUIRED FILES — copy these from your local Berserk folder into 
// public/images/logos/berserk/ BEFORE the studio will look correct:
//   brand-of-sacrifice.png
//   dragon-slayer-emblem.png
//   skull-knight-crest.png
//   band-of-the-hawk.png
//   berserker-armor-mark.png
//   gattsu-sigil.png

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

export const LOGOS: Logo[] = [
  {
    id: 'brand-of-sacrifice',
    label: 'BRAND OF SACRIFICE',
    japaneseLabel: '生贄の烙印',
    path: '/images/logos/berserk/brand-of-sacrifice.png',
    canRecolor: true,
  },
  {
    id: 'dragon-slayer-emblem',
    label: 'DRAGON SLAYER EMBLEM',
    japaneseLabel: 'ドラゴンころし',
    path: '/images/logos/berserk/dragon-slayer-emblem.png',
    canRecolor: true,
  },
  {
    id: 'skull-knight-crest',
    label: 'SKULL KNIGHT CREST',
    japaneseLabel: '髑髏の騎士の紋章',
    path: '/images/logos/berserk/skull-knight-crest.png',
    canRecolor: true,
  },
  {
    id: 'band-of-the-hawk',
    label: 'BAND OF THE HAWK',
    japaneseLabel: '鷹の団',
    path: '/images/logos/berserk/band-of-the-hawk.png',
    canRecolor: true,
  },
  {
    id: 'berserker-armor-mark',
    label: 'BERSERKER ARMOR MARK',
    japaneseLabel: '狂戦士の甲冑',
    path: '/images/logos/berserk/berserker-armor-mark.png',
    canRecolor: true,
  },
  {
    id: 'gattsu-sigil',
    label: 'GATTSU SIGIL',
    japaneseLabel: 'ガッツの印',
    path: '/images/logos/berserk/gattsu-sigil.png',
    canRecolor: true,
  },
];

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Serves as the centralized mock database and data-access layer for all products.
 * Currently refined to feature an exclusive launch catalog of 6 heavyweight hoodies.
 *
 * WHY IT EXISTS:
 * By keeping raw data and data-retrieval functions in one isolated file, UI
 * components remain purely presentational. When a real database (e.g. PostgreSQL,
 * Prisma, Supabase, or headless Shopify) is connected in the future, developers
 * only need to rewrite the helper functions in this file without modifying a single
 * page or component.
 *
 * HOW IT CONNECTS:
 * - Reads TypeScript types from `./types`.
 * - Consumed by `app/shop/page.tsx` via `getProductsByCategory`.
 * - Consumed by `app/shop/[slug]/page.tsx` via `getProductBySlug` and `getAllProducts`.
 * ============================================================================
 */

import { Product, ProductCategory, CategoryOption } from './types';

/**
 * Filter options for the shop navigation.
 * NOTE: Since the launch catalogue focuses exclusively on heavyweight hoodies,
 * we keep the navigation simple with 'all' and 'hoodie' options to maintain the
 * manga aesthetic and clean URL filtering without presenting empty categories.
 */
export const CATEGORIES: CategoryOption[] = [
  { value: 'all', label: 'All Artifacts', japaneseLabel: '全て' },
  { value: 'jacket', label: 'Jackets', japaneseLabel: 'ジャケット' },
  { value: 'hoodie', label: 'Hoodies', japaneseLabel: 'パーカー' },
  { value: 'tee', label: 'Tees', japaneseLabel: 'シャツ' },
  { value: 'accessory', label: 'Accessories', japaneseLabel: '小物' },
];

/**
 * Static mock catalogue of heavy-gauge embroidered hoodies (all priced >= 300 Dh).
 *
 * TODO: Replace temporary placeholder images (reused from /public/images) with
 * dedicated multi-angle photoshoot assets once official production studio photography arrives.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    // NOTE: Keep slug unchanged so external links and homepage CTAs do not break
    slug: 'berserker-armor-jacket',
    name: 'Berserker Armor Heavyweight Hoodie',
    japaneseName: '狂戦士の甲冑パーカー',
    category: 'hoodie',
    collectionId: 'berserk',
    salesCount: 126,
    price: 300,
    image: '/images/front-designe-new.jpg',
    images: [
      '/images/front-designe-new.jpg',
      '/images/back-des1.jpg',
      '/images/import-custom.jpg',
    ],
    panelNumber: '06',
    badge: 'BEST SELLER',
    description: '500 GSM loopback Japanese cotton with 184,200 high-tensile embroidery stitches across the chest and back.',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'prod-002',
    slug: 'brand-of-sacrifice-hoodie',
    name: 'Brand of Sacrifice Heavyweight Hoodie',
    japaneseName: '生贄の烙印パーカー',
    category: 'hoodie',
    collectionId: 'berserk',
    salesCount: 84,
    price: 350,
    image: '/images/import-custom.jpg',
    images: [
      '/images/import-custom.jpg',
      '/images/front-designe-new.jpg',
      '/images/back-des1.jpg',
    ],
    panelNumber: '07',
    badge: 'POPULAR',
    description: 'Heavyweight black fleece featuring the Brand of Sacrifice in raised crimson embroidery with sleeve runic accents.',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-003',
    slug: 'beast-of-darkness-hoodie',
    name: 'Beast of Darkness Armored Hoodie',
    japaneseName: '闇の獣鎧パーカー',
    category: 'hoodie',
    collectionId: 'berserk',
    salesCount: 51,
    price: 380,
    image: '/images/sequence2/guts_01.webp',
    images: [
      '/images/sequence2/guts_01.webp',
      '/images/back-des1.jpg',
      '/images/front-designe-new.jpg',
    ],
    panelNumber: '08',
    description: 'Heavy industrial shoulder and hood embroidery of the Beast of Darkness awakening in dense matte charcoal thread.',
    inStock: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'prod-004',
    slug: 'dragonslayer-blade-hoodie',
    name: 'Dragonslayer Heavyweight Pullover Hoodie',
    japaneseName: 'ドラゴンころしパーカー',
    category: 'hoodie',
    collectionId: 'berserk',
    salesCount: 37,
    price: 420,
    image: '/images/front-designe-new.jpg',
    images: [
      '/images/front-designe-new.jpg',
      '/images/back-des1.jpg',
      '/images/import-custom.jpg',
    ],
    panelNumber: '09',
    badge: 'NEW DROP',
    description: 'Metallic silver and matte black thread relief of the colossal Dragonslayer blade running down the spine.',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-005',
    slug: 'eclipse-sacrifice-tapestry-hoodie',
    name: 'Eclipse Tapestry Heavy-Gauge Hoodie',
    japaneseName: '蝕の生贄刺繍パーカー',
    category: 'hoodie',
    collectionId: 'berserk',
    salesCount: 29,
    price: 480,
    image: '/images/back-des1.jpg',
    images: [
      '/images/back-des1.jpg',
      '/images/front-designe-new.jpg',
      '/images/import-custom.jpg',
    ],
    panelNumber: '10',
    badge: 'LIMITED',
    description: 'Full-span back tapestry embroidery depicting the solar eclipse and demonic vortex in 14 thread hues.',
    inStock: true,
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'prod-006',
    slug: 'skull-knight-sigil-hoodie',
    name: 'Skull Knight Archival Sigil Hoodie',
    japaneseName: '髑髏の騎士紋章パーカー',
    category: 'hoodie',
    collectionId: 'berserk',
    salesCount: 18,
    price: 550,
    image: '/images/import-custom.jpg',
    images: [
      '/images/import-custom.jpg',
      '/images/back-des1.jpg',
      '/images/sequence1/guts_01.webp',
    ],
    panelNumber: '11',
    badge: 'ARCHIVE VAULT',
    description: 'Thorn-and-rose shield crest rendered in high-density metallic wire embroidery with custom gunmetal aglets.',
    inStock: true,
    sizes: ['L', 'XL', 'XXL'],
  },
];

// ============================================================================
// DATA ACCESS LAYER HELPER FUNCTIONS
// Components should call these functions exclusively to query data.
// ============================================================================

/**
 * Returns all products in the catalog.
 */
export function getAllProducts(): Product[] {
  return PRODUCTS;
}

/**
 * Retrieves a single product by its URL slug.
 */
export function getProductBySlug(slug: string): Product | undefined {
  // Finds product matching slug or returns undefined if not in catalog
  return PRODUCTS.find((product) => product.slug === slug);
}

/**
 * Returns products filtered by category, or all products if category is 'all'.
 */
export function getProductsByCategory(category: ProductCategory | 'all'): Product[] {
  // If 'all' or an unrecognized value is passed, return full catalogue
  if (!category || category === 'all') {
    return PRODUCTS;
  }
  return PRODUCTS.filter((product) => product.category === category);
}

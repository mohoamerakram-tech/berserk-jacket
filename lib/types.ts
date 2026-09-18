/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Defines TypeScript types and interfaces for the Berserk Jacket Archive shop.
 *
 * WHY IT EXISTS:
 * Strict typing ensures that product objects, categories, and filter options
 * follow an immutable contract across data sources and UI components.
 *
 * HOW IT CONNECTS:
 * - Imported by `lib/products.ts` to type the product catalog and categories.
 * - Imported by shop components (`ProductCard`, `ProductGrid`, `CategoryFilter`)
 *   to guarantee type-safe props and avoid runtime bugs.
 * ============================================================================
 */

/**
 * Valid product categories for embroidered apparel and gear.
 */
export type ProductCategory = 'jacket' | 'hoodie' | 'tee' | 'accessory';

/**
 * Core product interface representing a single embroidered garment or artifact.
 */
export interface Product {
  /** Unique database identifier (e.g., 'prod-001') */
  id: string;
  /** URL-friendly slug for routing (e.g., 'berserker-armor-jacket') */
  slug: string;
  /** Primary English product name */
  name: string;
  /** Kanji/Kana Japanese name displayed in manga panel headers */
  japaneseName: string;
  /** Categorization for catalog filtering */
  category: ProductCategory;
  /** Price in Moroccan Dirham (MAD / Dh) */
  price: number;
  /**
   * Primary image path under `/public`. Maintained for backwards compatibility
   * and single-image previews (equivalent to `images[0]`).
   */
  image: string;
  /**
   * Array of product photography paths under `/public` for the interactive gallery.
   * First item is the primary view; subsequent items showcase back, details, and macros.
   * Minimum 1 item.
   */
  images: string[];
  /** Manga panel numbering string (e.g., '06') for tankobon styling */
  panelNumber: string;
  /** Optional editorial badge (e.g., 'BEST SELLER', 'NEW DROP') */
  badge?: string;
  /** Short narrative description highlighting embroidery specs */
  description: string;
  /** Stock availability flag */
  inStock: boolean;
  /** Available sizing options */
  sizes: string[];
}

/**
 * Configuration for category filter buttons displayed on the shop page.
 */
export interface CategoryOption {
  /** Value passed to URL query parameter (`all` or specific category) */
  value: ProductCategory | 'all';
  /** Display label in English */
  label: string;
  /** Display label in Japanese */
  japaneseLabel: string;
}

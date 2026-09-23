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

export interface Collection {
  id: string;
  slug: string;
  animeId: string;
  name: string;
  japaneseName: string;
  description: string;
  tagline?: string;
  heroImage: string;
  logoImage?: string;
  status: 'active' | 'upcoming' | 'draft';
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

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
  /** Merchant-facing stock keeping unit. */
  sku?: string;
  /** Controls whether a product is visible in the public catalogue. */
  status?: 'active' | 'draft';
  /** Total sellable units. Kept in sync with inventoryBySize by admin writes. */
  stockQuantity?: number;
  /** Per-size stock levels. A zero value disables that size for customers. */
  inventoryBySize?: Record<string, number>;
  /** Optional original price shown when the item is discounted. */
  compareAtPrice?: number;
  /** Internal production cost; never rendered in the public store. */
  costPrice?: number;
  shortDescription?: string;
  materials?: string;
  embroideryDetails?: string;
  fit?: string;
  careInstructions?: string;
  shippingNote?: string;
  color?: string;
  weightGrams?: number;
  tags?: string[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  /** Collection relationship used for storefront and studio routing. */
  collectionId?: string;
  /** Merchant-controlled sales total used to choose each collection's home bestseller. */
  salesCount?: number;
}

/** Returns the current total inventory while supporting the original seed data. */
export function getProductStock(product: Product): number {
  if (product.inventoryBySize) {
    return Object.values(product.inventoryBySize).reduce((total, quantity) => total + Math.max(0, quantity), 0);
  }
  if (typeof product.stockQuantity === 'number') return Math.max(0, product.stockQuantity);
  return product.inStock ? Number.MAX_SAFE_INTEGER : 0;
}

export function isProductSizeAvailable(product: Product, size: string): boolean {
  if (!product.inStock || getProductStock(product) <= 0) return false;
  if (!product.inventoryBySize) return product.sizes.includes(size);
  return (product.inventoryBySize[size] ?? 0) > 0;
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

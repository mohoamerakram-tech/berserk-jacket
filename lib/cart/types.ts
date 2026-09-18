/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Defines the core TypeScript interface for a single line item in the shopping cart.
 *
 * WHY IT EXISTS:
 * Gives the entire application a single, strongly-typed definition of what data
 * represents a purchased product variant (product + selected size + quantity).
 *
 * HOW IT CONNECTS:
 * - Stored in localStorage via `lib/cart/storage.ts`
 * - Managed in memory by `lib/cart/CartProvider.tsx`
 * - Rendered by `app/components/cart/CartLineItem.tsx`
 * ============================================================================
 */

export interface CartItem {
  /** Unique product ID from `lib/products.ts` */
  productId: string;
  /** Slug used to link back to the product detail page */
  slug: string;
  /** Display name of the product */
  name: string;
  /** Japanese editorial name for manga authenticity */
  japaneseName: string;
  /** Unit price in Moroccan Dirhams (DH) */
  price: number;
  /** Main product image path (e.g. /images/front-designe-new.jpg) */
  image: string;
  /** Selected size variant (e.g. "S", "M", "L", "XL", "XXL") */
  size: string;
  /** Number of units of this exact product + size variant */
  quantity: number;
}

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Low-level utility functions to safely read from and write to browser localStorage.
 *
 * WHY IT EXISTS:
 * Isolates all browser storage interactions to a single file. By encapsulating
 * `window` checks and error handling here, components are protected against
 * SSR execution errors and corrupted JSON parse crashes.
 *
 * HOW IT CONNECTS:
 * - Read on initial client boot by `CartProvider.tsx` to restore saved items.
 * - Written by `CartProvider.tsx` whenever cart items change.
 * - NO other component in the codebase touches localStorage directly.
 * ============================================================================
 */

import { CartItem } from './types';

/** Persistent storage key used across the application */
export const STORAGE_KEY = 'fsm-cart-v1';

/**
 * Loads cart items from browser localStorage.
 * Returns an empty array if:
 * 1. Running on the server (typeof window === 'undefined')
 * 2. No saved data exists in localStorage
 * 3. Stored JSON is corrupted or invalid
 */
export function loadCart(): CartItem[] {
  // Guard against server-side rendering execution (prevents hydration crashes)
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('[CartStorage] Stored cart data is not an array, resetting to empty.');
      return [];
    }
    return parsed as CartItem[];
  } catch (error) {
    // If user's localStorage contains corrupted JSON, recover gracefully
    console.warn('[CartStorage] Failed to parse stored cart from localStorage:', error);
    return [];
  }
}

/**
 * Saves cart items array to browser localStorage.
 * Silently skips execution if running on the server.
 */
export function saveCart(items: CartItem[]): void {
  // Guard against server-side rendering execution
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('[CartStorage] Failed to save cart to localStorage:', error);
  }
}

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Public barrel export for the entire Custom Embroidery Studio domain.
 *
 * WHY IT EXISTS:
 * Provides a single, clean, modular import entry point (`@/lib/studio`) for:
 * - Domain TypeScript types & constraints (`types.ts`)
 * - Garment mockups, thread swatches, fonts, & scaling catalogues (`options.ts`)
 * - Berserk embroidery motif catalogue (`logos.ts`)
 * - Draft persistence & hydration validation utilities (`storage.ts`)
 * ============================================================================
 */

export * from './types';
export * from './logos';
export * from './options';
export * from './storage';

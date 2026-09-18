'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Global React Context provider managing cart state, quantities, and drawer visibility.
 *
 * WHY IT EXISTS:
 * This is the SINGLE SOURCE OF TRUTH for shopping cart operations. It is the
 * only module that triggers localStorage synchronization. If the store transitions
 * to a remote database backend later, ONLY this file will need updates.
 *
 * HOW IT CONNECTS:
 * - Wraps RootLayout in `app/layout.tsx`.
 * - Consumed by `CartIcon`, `CartDrawer`, `AddToCartButton`, and `CartLineItem`
 *   via the exported `useCart()` hook.
 * ============================================================================
 */

import React, { createContext, useContext, useReducer, useState, useEffect, useRef, useMemo } from 'react';
import { CartItem } from './types';
import { loadCart, saveCart } from './storage';
import { Product } from '../types';

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD'; payload: { product: Product; size: string } }
  | { type: 'REMOVE'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR' };

/**
 * Pure reducer function managing the cart item lines array.
 * Unique line key is `${productId}::${size}`.
 */
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'ADD': {
      const { product, size } = action.payload;
      const existingIndex = state.findIndex(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingIndex > -1) {
        // Increment quantity if exact product + size already exists
        return state.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Append new unique line item
      const newItem: CartItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        japaneseName: product.japaneseName,
        price: product.price,
        image: product.image,
        size,
        quantity: 1,
      };
      return [...state, newItem];
    }

    case 'REMOVE':
      return state.filter(
        (item) => !(item.productId === action.payload.productId && item.size === action.payload.size)
      );

    case 'UPDATE_QTY': {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((item) => !(item.productId === productId && item.size === size));
      }
      return state.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity } : item
      );
    }

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const hasHydrated = useRef(false);

  // Hydrate from localStorage once mounted on client
  useEffect(() => {
    const storedItems = loadCart();
    dispatch({ type: 'HYDRATE', payload: storedItems });
    // queueMicrotask ensures hasHydrated becomes true AFTER the initial render's effects finish,
    // preventing the initial empty array from immediately overwriting localStorage.
    queueMicrotask(() => {
      hasHydrated.current = true;
    });
  }, []);

  // Save to localStorage on changes, skipping initial pre-hydration mount
  useEffect(() => {
    if (!hasHydrated.current) return;
    saveCart(items);
  }, [items]);

  const totalCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    totalCount,
    subtotal,
    addItem: (product, size) => dispatch({ type: 'ADD', payload: { product, size } }),
    removeItem: (productId, size) => dispatch({ type: 'REMOVE', payload: { productId, size } }),
    updateQuantity: (productId, size, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { productId, size, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return context;
}
export default CartProvider;

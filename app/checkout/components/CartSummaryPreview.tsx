import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/lib/cart/types';

interface CartSummaryPreviewProps {
  cartItems: CartItem[];
}

export default function CartSummaryPreview({ cartItems }: CartSummaryPreviewProps) {
  return (
    <div className="space-y-2.5 divide-y divide-stone-800">
      {cartItems.map((item) => (
        <div key={`${item.productId}::${item.size}`} className="pt-2.5 first:pt-0 flex items-center gap-3">
          <div className="relative w-12 h-12 bg-black border border-stone-800 shrink-0 overflow-hidden">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-sans font-bold text-xs uppercase text-white truncate">
              {item.name}
            </h4>
            <p className="font-mono text-[10px] text-stone-400">
              Size: {item.size} · Qty: {item.quantity}
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-red-400 shrink-0">
            {item.price * item.quantity} Dh
          </span>
        </div>
      ))}
    </div>
  );
}

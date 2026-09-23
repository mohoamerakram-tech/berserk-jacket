import React, { useEffect } from 'react';
import { getProductStock, isProductSizeAvailable, Product } from '@/lib/types';

interface CatalogProductPreviewProps {
  catalogProduct: Product;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export default function CatalogProductPreview({
  catalogProduct,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
}: CatalogProductPreviewProps) {
  const selectedStock = catalogProduct.inventoryBySize?.[selectedSize] ?? getProductStock(catalogProduct);
  const maxQuantity = Math.max(0, Math.min(5, selectedStock));
  useEffect(() => {
    if (maxQuantity > 0) setQuantity((current) => Math.min(Math.max(1, current), maxQuantity));
  }, [maxQuantity, setQuantity]);
  return (
    <div className="space-y-3">
      <div className="relative w-full h-52 bg-black border border-stone-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={catalogProduct.image}
          alt={catalogProduct.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <span className="absolute top-2 left-2 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 border border-white/60">
          ARTIFACT // 珠玉の刺繍
        </span>
      </div>

      <div>
        <h3 className="font-sans font-black text-sm uppercase text-white">
          {catalogProduct.name}
        </h3>
        <p className="font-mono text-[10px] text-stone-400 mt-0.5">
          {catalogProduct.description}
        </p>
      </div>

      {/* Size Selector */}
      <div className="border-t border-stone-800 pt-2 space-y-1.5">
        <label className="block font-mono text-[10px] font-bold uppercase text-stone-300">
          SELECT SIZE:
        </label>
        <div className="grid grid-cols-5 gap-1">
          {catalogProduct.sizes.map((s) => {
            const available = isProductSizeAvailable(catalogProduct, s);
            return (
            <button
              key={s}
              type="button"
              onClick={() => available && setSelectedSize(s)}
              disabled={!available}
              className={`py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                !available
                  ? 'bg-stone-950 text-stone-700 border-stone-800 line-through cursor-not-allowed'
                  : selectedSize === s
                  ? 'bg-red-600 text-white border-white'
                  : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'
              }`}
            >
              {s}{!available ? ' SOLD' : ''}
            </button>
          )})}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-2 text-xs font-mono">
        <span className="text-stone-400 uppercase">QUANTITY:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-6 h-6 bg-stone-900 border border-stone-700 text-white font-bold flex items-center justify-center hover:bg-stone-800 cursor-pointer"
          >
            -
          </button>
          <span className="font-bold text-white px-1.5">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={maxQuantity <= 0 || quantity >= maxQuantity}
            className="w-6 h-6 bg-stone-900 border border-stone-700 text-white font-bold flex items-center justify-center hover:bg-stone-800 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

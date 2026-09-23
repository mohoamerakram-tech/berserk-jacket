import React from 'react';
import { StudioView } from '@/lib/studio';
import { StudioDraft } from '@/lib/studio/storage';
import { CartItem } from '@/lib/cart/types';
import { Product } from '@/lib/types';
import { BespokeData } from '@/lib/checkout/types';
import PresetPreview from './PresetPreview';
import BespokePreview from './BespokePreview';
import CartSummaryPreview from './CartSummaryPreview';
import CatalogProductPreview from './CatalogProductPreview';

interface OrderSummaryColumnProps {
  isPresetStudio: boolean;
  isBespokeStudio: boolean;
  isFromCart: boolean;
  presetDraft: StudioDraft | null;
  bespokeData: BespokeData | null;
  jacketParam: string | null;
  catalogProduct: Product;
  cartItems: CartItem[];
  activeJacketPath: string;
  activePreviewSide: StudioView;
  setActivePreviewSide: (side: StudioView) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  calculatedTotal: number;
  onDownloadSnapshots: () => void;
  isGeneratingSnapshots: boolean;
}

export default function OrderSummaryColumn({
  isPresetStudio,
  isBespokeStudio,
  isFromCart,
  presetDraft,
  bespokeData,
  jacketParam,
  catalogProduct,
  cartItems,
  activeJacketPath,
  activePreviewSide,
  setActivePreviewSide,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  calculatedTotal,
  onDownloadSnapshots,
  isGeneratingSnapshots,
}: OrderSummaryColumnProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="border-[3px] border-black bg-stone-950 text-white p-5 shadow-sm">
        {/* Panel Top Title */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2.5 mb-3">
          <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider">
            ◆ PANEL 01 // YOUR ORDER
          </span>
          <span className="text-[9px] font-mono text-stone-400 uppercase">
            {isPresetStudio
              ? 'PRESET STUDIO'
              : isBespokeStudio
              ? 'BESPOKE IMPORT'
              : isFromCart
              ? `${cartItems.length} ITEMS`
              : 'SINGLE ARTIFACT'}
          </span>
        </div>

        {/* Dynamic Mode Preview */}
        {isPresetStudio ? (
          <PresetPreview
            presetDraft={presetDraft}
            activeJacketPath={activeJacketPath}
            activePreviewSide={activePreviewSide}
            setActivePreviewSide={setActivePreviewSide}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            onDownloadSnapshots={onDownloadSnapshots}
            isGeneratingSnapshots={isGeneratingSnapshots}
          />
        ) : isBespokeStudio ? (
          <BespokePreview
            bespokeData={bespokeData}
            jacketParam={jacketParam}
            activeJacketPath={activeJacketPath}
            activePreviewSide={activePreviewSide}
            setActivePreviewSide={setActivePreviewSide}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            onDownloadSnapshots={onDownloadSnapshots}
            isGeneratingSnapshots={isGeneratingSnapshots}
          />
        ) : isFromCart ? (
          <CartSummaryPreview cartItems={cartItems} />
        ) : (
          <CatalogProductPreview
            catalogProduct={catalogProduct}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        )}

        {/* Pricing Breakdown */}
        <div className="pt-3 mt-3 border-t border-stone-800 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-stone-400">
            <span>EXPRESS SHIPPING:</span>
            <span className="text-emerald-400 font-bold uppercase">FREE</span>
          </div>
          <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-black">
            <span className="text-white uppercase">TOTAL DUE:</span>
            <span className="text-red-500 text-base font-black">{calculatedTotal} Dh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

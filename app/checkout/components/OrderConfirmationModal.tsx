import React from 'react';
import Link from 'next/link';
import { CheckoutFormData } from '@/lib/checkout/types';

interface OrderConfirmationModalProps {
  orderRef: string;
  preparedWhatsappUrl: string;
  formData: CheckoutFormData;
  calculatedTotal: number;
  frontSnapshot: string | null;
  backSnapshot: string | null;
  onEditDetails: () => void;
  onDownloadImage: (dataUrl: string, filename: string) => void;
}

export default function OrderConfirmationModal({
  orderRef,
  preparedWhatsappUrl,
  formData,
  calculatedTotal,
  frontSnapshot,
  backSnapshot,
  onEditDetails,
  onDownloadImage,
}: OrderConfirmationModalProps) {
  return (
    <div className="border-[3px] border-black bg-stone-950 text-white p-6 sm:p-10 text-center space-y-6 shadow-xl">
      <span className="inline-block bg-black text-white font-mono font-bold text-xs px-3 py-1 uppercase tracking-widest border border-white">
        [ORDER DRAFT READY // 注文内容]
      </span>

      <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
        SEND YOUR ORDER IN WHATSAPP
      </h2>

      <p className="font-mono text-xs text-stone-400 max-w-md mx-auto">
        Your order details are ready. Open WhatsApp, send the message, and attach your preview
        images below. Your order is not confirmed until the atelier replies and prepayment is
        arranged.
      </p>

      <a
        href={preparedWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] px-6 py-3 font-mono font-bold text-white uppercase text-xs sm:text-sm tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
      >
        OPEN WHATSAPP
      </a>

      {/* Order Reference Table */}
      <div className="max-w-md mx-auto bg-stone-900 border border-stone-800 p-4 text-left font-mono text-xs space-y-2 text-stone-300">
        <div className="flex justify-between border-b border-stone-800 pb-1.5">
          <span className="text-stone-500 uppercase">REFERENCE:</span>
          <span className="text-white font-bold">{orderRef}</span>
        </div>
        <div className="flex justify-between border-b border-stone-800 pb-1.5">
          <span className="text-stone-500 uppercase">RECIPIENT:</span>
          <span className="text-white font-bold">
            {formData.prenom} {formData.nom}
          </span>
        </div>
        <div className="flex justify-between border-b border-stone-800 pb-1.5">
          <span className="text-stone-500 uppercase">DESTINATION:</span>
          <span className="text-white font-bold">{formData.ville}</span>
        </div>
        <div className="flex justify-between border-b border-stone-800 pb-1.5">
          <span className="text-stone-500 uppercase">PREPAYMENT METHOD:</span>
          <span className="text-white font-bold uppercase">{formData.paymentMethod}</span>
        </div>
        <div className="flex justify-between pt-1 font-bold">
          <span className="text-stone-400 uppercase">TOTAL DUE:</span>
          <span className="text-red-500">{calculatedTotal} Dh</span>
        </div>
      </div>

      {/* Front & Back Images Display if Generated */}
      {(frontSnapshot || backSnapshot) && (
        <div className="max-w-md mx-auto bg-black/60 border border-stone-800 p-4 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              ATTACH PREVIEW IMAGES IN CHAT :
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">
              READY TO SEND
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {frontSnapshot && (
              <div className="space-y-1">
                <div className="relative aspect-[4/5] bg-stone-900 border border-stone-700 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frontSnapshot} alt="Front Snapshot" className="w-full h-full object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => onDownloadImage(frontSnapshot, `${orderRef}-FRONT.png`)}
                  className="w-full py-1 text-[9px] font-mono font-bold uppercase bg-stone-800 hover:bg-stone-700 text-white border border-stone-600 cursor-pointer"
                >
                  DOWNLOAD FRONT
                </button>
              </div>
            )}
            {backSnapshot && (
              <div className="space-y-1">
                <div className="relative aspect-[4/5] bg-stone-900 border border-stone-700 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={backSnapshot} alt="Back Snapshot" className="w-full h-full object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => onDownloadImage(backSnapshot, `${orderRef}-BACK.png`)}
                  className="w-full py-1 text-[9px] font-mono font-bold uppercase bg-stone-800 hover:bg-stone-700 text-white border border-stone-600 cursor-pointer"
                >
                  DOWNLOAD BACK
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onEditDetails}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold uppercase text-xs tracking-wider py-2.5 px-5 border-2 border-stone-700 cursor-pointer"
        >
          EDIT DETAILS
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 text-black font-mono font-black uppercase text-xs tracking-widest py-2.5 px-6 border-2 border-black shadow-[2px_2px_0px_0px_#dc2626] cursor-pointer"
        >
          <span>RETURN TO MANUSCRIPT</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

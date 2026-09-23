import React from 'react';
import { PREPAYMENT_OPTIONS, PrepaymentMethod } from '@/lib/checkout/types';

interface PaymentSelectorProps {
  paymentMethod: PrepaymentMethod;
  setPaymentMethod: (method: PrepaymentMethod) => void;
}

export default function PaymentSelector({
  paymentMethod,
  setPaymentMethod,
}: PaymentSelectorProps) {
  return (
    <div className="border-2 border-black bg-stone-900 text-white p-4 space-y-2.5">
      <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
        <span className="font-mono text-[10px] font-bold tracking-widest text-red-400 uppercase">
          [PREPAYMENT REQUIRED]
        </span>
        <span className="font-mono text-[9px] text-stone-400 uppercase">
          NO CASH ON DELIVERY
        </span>
      </div>

      <p className="font-mono text-[11px] text-stone-300 leading-relaxed">
        Your order is confirmed and scheduled for artisan production{' '}
        <span className="text-white font-bold underline">only after advance prepayment</span> via
        Bank Transfer, Cash Plus, or Wafacash. Cash on delivery is not accepted.
      </p>

      {/* Prepayment Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        {PREPAYMENT_OPTIONS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setPaymentMethod(method.id)}
            className={`p-2.5 border-2 text-left font-mono transition-all cursor-pointer ${
              paymentMethod === method.id
                ? 'bg-white text-black border-red-600 shadow-[2px_2px_0px_0px_#dc2626]'
                : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-600'
            }`}
          >
            <span className="block text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
              [{method.tag}]
            </span>
            <span className="block font-bold text-xs uppercase leading-tight">
              {method.label}
            </span>
            <span className="block text-[9px] text-stone-400 mt-1 leading-tight">
              {method.detail}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

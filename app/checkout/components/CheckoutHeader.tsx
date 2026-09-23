import React from 'react';
import Link from 'next/link';

export default function CheckoutHeader() {
  return (
    <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
      <div className="flex items-center gap-2">
        <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
          ORDER // 発注
        </span>
        <span className="font-bold text-black uppercase">
          CHECKOUT // 注文手続き
        </span>
        <span className="hidden md:inline text-stone-400">|</span>
        <span className="hidden md:inline text-black font-bold uppercase text-[10px]">
          DIRECT WHATSAPP FINALIZATION
        </span>
      </div>
      <Link href="/" className="hover:underline font-bold text-black uppercase text-[10px]">
        ◄ RETURN TO STORE
      </Link>
    </header>
  );
}

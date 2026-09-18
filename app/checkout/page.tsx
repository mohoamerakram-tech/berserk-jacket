'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const [size, setSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const UNIT_PRICE = 300;
  const totalPrice = UNIT_PRICE * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }
    const generatedId = `BRK-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
        
        {/* Left Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Checkout Left Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ ORDER ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            血と鉄の甲冑を纏え
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 注文票 】
          </span>
        </aside>

        {/* Central Manga Form Container */}
        <div className="flex-1 min-w-0 flex flex-col space-y-6">
          
          {/* Header */}
          <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white font-bold px-1.5 py-0.5 text-[10px]">
                特注発注書
              </span>
              <span className="font-bold text-black">
                CHECKOUT // 注文手続き
              </span>
            </div>
            <Link href="/" className="hover:underline font-bold text-black">
              ◄ RETURN HOME
            </Link>
          </header>

          {!isSubmitted ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Product Summary */}
              <div className="md:col-span-5 space-y-4">
                <div className="border-[3px] border-black bg-stone-950 text-white p-5">
                  <div className="relative w-full h-56 bg-black mb-4 overflow-hidden border border-stone-800">
                    <Image
                      src="/images/front-designe-new.jpg"
                      alt="Berserk Heavyweight Embroidered Jacket"
                      fill
                      priority
                      className="object-cover object-center"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 border border-white/60">
                      ARTIFACT // 珠玉の刺繍
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase block">
                      LIMITED TANKOBON FIRST EDITION
                    </span>
                    <h2 className="font-sans font-black text-lg uppercase text-white leading-tight">
                      BERSERK EMBROIDERED JACKET
                    </h2>
                    <p className="font-mono text-xs text-stone-300">
                      480 GSM Heavyweight Japanese Twill Cotton with 184,200 stitch high-tensile relief.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-400">UNIT PRICE:</span>
                    <span className="font-black text-white text-sm">300 Dh</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span>SHIPPING:</span>
                    <span className="text-emerald-400 font-bold uppercase">FREE EXPRESS (COD)</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-800 flex items-center justify-between text-sm font-mono font-black">
                    <span className="text-white">TOTAL DUE:</span>
                    <span className="text-red-500 text-lg font-black">{totalPrice} Dh</span>
                  </div>
                </div>

                <div className="border-[2px] border-black p-3.5 bg-stone-100 text-black text-[11px] font-mono space-y-1">
                  <span className="font-bold block uppercase text-stone-900">◆ CASH ON DELIVERY (COD)</span>
                  <p className="text-stone-700 leading-normal">
                    Inspect your jacket upon delivery before paying the courier. 100% satisfaction guaranteed.
                  </p>
                </div>
              </div>

              {/* Right Column: Customer Shipping Form */}
              <div className="md:col-span-7">
                <form 
                  onSubmit={handleSubmit}
                  className="border-[3px] border-black bg-white p-6 sm:p-8 space-y-5"
                >
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="font-sans font-black text-lg uppercase text-black">
                      DELIVERY RECIPIENT INFORMATION
                    </h3>
                    <p className="font-mono text-[11px] text-stone-600 uppercase">
                      Enter your dispatch details for immediate courier routing.
                    </p>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
                      SELECT ARMOR SIZE:
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`py-2 text-xs font-mono font-black uppercase border-2 transition-all cursor-pointer ${
                            size === s
                              ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#dc2626]'
                              : 'bg-white text-black border-stone-400 hover:border-black'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
                      QUANTITY:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 border-2 border-black font-mono font-black text-sm flex items-center justify-center hover:bg-stone-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-sm px-2">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                        className="w-9 h-9 border-2 border-black font-mono font-black text-sm flex items-center justify-center hover:bg-stone-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="fullName"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-black"
                    >
                      FULL NAME *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Guts of Midland"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 border-2 border-black font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="phone"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-black"
                    >
                      PHONE NUMBER (FOR COURIER DISPATCH) *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="e.g. +212 600 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 border-2 border-black font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="city"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-black"
                    >
                      CITY / PROVINCE *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="e.g. Casablanca, Rabat, Marrakech, Tangier"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 border-2 border-black font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="address"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-black"
                    >
                      DELIVERY ADDRESS *
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={2}
                      placeholder="Street, Apartment / Building number, Neighborhood"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 border-2 border-black font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-stone-900 active:bg-stone-800 text-white font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3.5 px-6 border-2 border-black shadow-[4px_4px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>CONFIRM ORDER (COD — {totalPrice} Dh)</span>
                    <span className="ml-2" aria-hidden="true">→</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            /* Order Confirmation Receipt State */
            <div className="border-[3px] border-black bg-stone-950 text-white p-8 sm:p-12 text-center space-y-6">
              <div className="inline-block bg-red-600 text-white font-mono font-bold text-xs px-3 py-1 uppercase tracking-widest border border-white/60">
                ORDER SEALED // 因果の契約完了
              </div>

              <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
                YOUR ARMOR IS BEING PREPARED
              </h2>

              <p className="font-serif italic text-stone-400 text-sm">
                「貴様の契約は因果の帳に刻印された――」
              </p>

              <div className="w-24 h-[1px] bg-red-600 mx-auto" />

              <div className="max-w-md mx-auto bg-stone-900 border border-stone-800 p-4 text-left font-mono text-xs space-y-2 text-stone-300">
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">ORDER REF:</span>
                  <span className="text-white font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">RECIPIENT:</span>
                  <span className="text-white font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">SIZE & QTY:</span>
                  <span className="text-white font-bold">{size} × {quantity}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">DESTINATION:</span>
                  <span className="text-white font-bold">{city}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500 uppercase">TOTAL DUE ON DELIVERY:</span>
                  <span className="text-red-500 font-bold text-sm">{totalPrice} Dh</span>
                </div>
              </div>

              <p className="font-mono text-xs text-stone-400 max-w-sm mx-auto">
                Our dispatch team will contact you at {phone} prior to courier arrival.
              </p>

              <div>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-200 active:bg-stone-300 text-black font-mono font-black uppercase text-xs sm:text-sm tracking-widest py-3 px-8 border-2 border-black shadow-[3px_3px_0px_0px_#dc2626] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                >
                  <span>RETURN TO MANUSCRIPT</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          )}

          {/* Manga Footer */}
          <footer className="flex items-center justify-between pt-2.5 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black">FUTURE STITCH MANU // SECURE DISPATCH</span>
            <span className="font-bold text-black">CASH ON DELIVERY GUARANTEE</span>
          </footer>

        </div>

        {/* Right Japanese Lore Margin */}
        <aside 
          className="hidden sm:flex flex-col items-center justify-between py-6 select-none shrink-0 w-6 text-stone-800"
          aria-label="Checkout Right Margin"
        >
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            ┼ BERSERK ┼
          </span>
          <div className="[writing-mode:vertical-rl] text-xs font-serif font-black tracking-[0.2em] leading-none my-auto">
            運命の鎖を断ち切り、進め
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 決済 】
          </span>
        </aside>

      </div>
    </main>
  );
}

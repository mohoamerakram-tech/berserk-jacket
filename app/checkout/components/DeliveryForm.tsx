import React from 'react';
import { CheckoutFormData, CheckoutErrors, PrepaymentMethod } from '@/lib/checkout/types';
import PaymentSelector from './PaymentSelector';

interface DeliveryFormProps {
  formData: CheckoutFormData;
  updateField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
  errors: CheckoutErrors;
  clearError: (field: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGeneratingSnapshots: boolean;
  calculatedTotal: number;
}

export default function DeliveryForm({
  formData,
  updateField,
  errors,
  clearError,
  onSubmit,
  isGeneratingSnapshots,
  calculatedTotal,
}: DeliveryFormProps) {
  return (
    <div className="lg:col-span-7">
      <form onSubmit={onSubmit} className="border-[3px] border-black bg-white p-5 sm:p-6 space-y-5 shadow-sm" noValidate>
        {/* Delivery Header */}
        <div className="border-b-2 border-black pb-2">
          <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider block">
            ◆ PANEL 02 // DISPATCH
          </span>
          <h3 className="font-sans font-black text-base uppercase text-black">
            DELIVERY INFORMATION
          </h3>
        </div>

        {/* Recipient First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="prenom" className="block font-mono text-[11px] font-bold uppercase text-black">
              FIRST NAME *
            </label>
            <input
              id="prenom"
              type="text"
              placeholder="e.g. Guts"
              value={formData.prenom}
              onChange={(e) => {
                updateField('prenom', e.target.value);
                if (errors.prenom) clearError('prenom');
              }}
              className={`w-full p-2 border-2 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none ${
                errors.prenom ? 'border-red-600 bg-red-50' : 'border-black focus:ring-1 focus:ring-black'
              }`}
            />
            {errors.prenom && <p className="text-[10px] font-mono text-red-600 font-bold">{errors.prenom}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="nom" className="block font-mono text-[11px] font-bold uppercase text-black">
              LAST NAME *
            </label>
            <input
              id="nom"
              type="text"
              placeholder="e.g. Struggler"
              value={formData.nom}
              onChange={(e) => {
                updateField('nom', e.target.value);
                if (errors.nom) clearError('nom');
              }}
              className={`w-full p-2 border-2 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none ${
                errors.nom ? 'border-red-600 bg-red-50' : 'border-black focus:ring-1 focus:ring-black'
              }`}
            />
            {errors.nom && <p className="text-[10px] font-mono text-red-600 font-bold">{errors.nom}</p>}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label htmlFor="telephone" className="block font-mono text-[11px] font-bold uppercase text-black">
            PHONE NUMBER (WHATSAPP) *
          </label>
          <input
            id="telephone"
            type="tel"
            placeholder="e.g. +212 600 000 000"
            value={formData.telephone}
            onChange={(e) => {
              updateField('telephone', e.target.value);
              if (errors.telephone) clearError('telephone');
            }}
            className={`w-full p-2 border-2 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none ${
              errors.telephone ? 'border-red-600 bg-red-50' : 'border-black focus:ring-1 focus:ring-black'
            }`}
          />
          {errors.telephone && <p className="text-[10px] font-mono text-red-600 font-bold">{errors.telephone}</p>}
        </div>

        {/* City */}
        <div className="space-y-1">
          <label htmlFor="ville" className="block font-mono text-[11px] font-bold uppercase text-black">
            CITY *
          </label>
          <input
            id="ville"
            type="text"
            placeholder="e.g. Casablanca, Rabat, Marrakech, Tangier"
            value={formData.ville}
            onChange={(e) => {
              updateField('ville', e.target.value);
              if (errors.ville) clearError('ville');
            }}
            className={`w-full p-2 border-2 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none ${
              errors.ville ? 'border-red-600 bg-red-50' : 'border-black focus:ring-1 focus:ring-black'
            }`}
          />
          {errors.ville && <p className="text-[10px] font-mono text-red-600 font-bold">{errors.ville}</p>}
        </div>

        {/* Delivery Address */}
        <div className="space-y-1">
          <label htmlFor="adresse" className="block font-mono text-[11px] font-bold uppercase text-black">
            STREET ADDRESS & NEIGHBORHOOD *
          </label>
          <textarea
            id="adresse"
            rows={2}
            placeholder="Street name, building number, apartment, neighborhood"
            value={formData.adresse}
            onChange={(e) => {
              updateField('adresse', e.target.value);
              if (errors.adresse) clearError('adresse');
            }}
            className={`w-full p-2 border-2 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none resize-none ${
              errors.adresse ? 'border-red-600 bg-red-50' : 'border-black focus:ring-1 focus:ring-black'
            }`}
          />
          {errors.adresse && <p className="text-[10px] font-mono text-red-600 font-bold">{errors.adresse}</p>}
        </div>

        {/* Special Notes */}
        <div className="space-y-1">
          <label htmlFor="notes" className="block font-mono text-[10px] font-bold uppercase text-stone-600">
            SPECIAL COURIER INSTRUCTIONS (OPTIONAL)
          </label>
          <input
            id="notes"
            type="text"
            placeholder="e.g. Building entrance code, preferred delivery hour"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="w-full p-1.5 border border-stone-300 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:border-black"
          />
        </div>

        {/* Prepayment Requirement Notice & Method Selector */}
        <PaymentSelector
          paymentMethod={formData.paymentMethod}
          setPaymentMethod={(m: PrepaymentMethod) => updateField('paymentMethod', m)}
        />

        {/* Submit Button */}
        <div className="pt-1">
          {errors.submission && (
            <p role="alert" className="text-red-600 text-xs mb-3 font-mono font-bold">
              {errors.submission}
            </p>
          )}
          <button
            type="submit"
            id="confirm-whatsapp-order-cta"
            disabled={isGeneratingSnapshots}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] text-white font-mono font-bold uppercase text-xs sm:text-sm tracking-widest py-3 px-5 border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>CONFIRM ORDER VIA WHATSAPP ({calculatedTotal} DH)</span>
            <span aria-hidden="true">➔</span>
          </button>
          <span className="block font-mono text-[9px] text-stone-500 text-center uppercase tracking-wider mt-1.5">
            Opens an order draft in WhatsApp. Send the message and attach your preview images.
          </span>
        </div>
      </form>
    </div>
  );
}

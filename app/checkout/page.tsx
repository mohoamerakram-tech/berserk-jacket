'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * English-First WhatsApp Checkout for Berserk Jacket Archive.
 *
 * MODULAR ARCHITECTURE:
 * - Types: `@/lib/checkout/types`
 * - Canvas 2D Snapshot Composition: `@/lib/checkout/snapshot`
 * - WhatsApp Message Formatting: `@/lib/checkout/whatsapp`
 * - Subcomponents: `@/app/checkout/components/`
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { readBespokeCheckout } from '@/lib/studio/bespoke-checkout';
import { useCart } from '@/lib/cart/CartProvider';
import { useCatalog } from '@/lib/catalog/client';
import { PRODUCTS } from '@/lib/products';
import { isProductSizeAvailable } from '@/lib/types';
import { readStudioDraft, StudioView } from '@/lib/studio';
import { StudioDraft } from '@/lib/studio/storage';

import {
  BespokeData,
  CheckoutFormData,
  CheckoutErrors,
  PREPAYMENT_OPTIONS,
} from '@/lib/checkout/types';
import {
  renderCanvasSnapshot,
  renderBespokeSnapshot,
  downloadDataUrl,
} from '@/lib/checkout/snapshot';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from '@/lib/checkout/whatsapp';

import CheckoutHeader from './components/CheckoutHeader';
import OrderSummaryColumn from './components/OrderSummaryColumn';
import DeliveryForm from './components/DeliveryForm';
import OrderConfirmationModal from './components/OrderConfirmationModal';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { items: cartItems, subtotal: cartSubtotal } = useCart();
  const { products, logos } = useCatalog();

  // URL query params
  const productId = searchParams.get('productId');
  const initialSize = searchParams.get('size') || 'L';
  const source = searchParams.get('source');
  const studioType = searchParams.get('type');
  const jacketParam = searchParams.get('jacket');

  // Mode detection
  const isFromCart = source === 'cart' && cartItems.length > 0;
  const isPresetStudio = source === 'studio' && studioType === 'preset';
  const isBespokeStudio = source === 'studio' && studioType === 'bespoke';

  // Perspective view toggler for custom studio previews (Front vs Back)
  const [activePreviewSide, setActivePreviewSide] = useState<StudioView>('front');

  // Generated snapshot previews for WhatsApp confirmation attachment
  const [frontSnapshot, setFrontSnapshot] = useState<string | null>(null);
  const [backSnapshot, setBackSnapshot] = useState<string | null>(null);
  const [isGeneratingSnapshots, setIsGeneratingSnapshots] = useState(false);

  // Catalog product lookup
  const catalogProduct = useMemo(() => {
    if (productId) {
      return products.find((p) => p.id === productId || p.slug === productId) || products[0] || PRODUCTS[0];
    }
    return products[0] || PRODUCTS[0];
  }, [productId, products]);

  // Selected size & quantity
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [quantity, setQuantity] = useState<number>(1);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  // Studio states loaded from session
  const [presetDraft, setPresetDraft] = useState<StudioDraft | null>(null);
  const [bespokeData, setBespokeData] = useState<BespokeData | null>(null);

  useEffect(() => {
    if (isPresetStudio) {
      let cancelled = false;
      Promise.resolve().then(() => readStudioDraft(logos)).then((draft) => {
        if (!cancelled) setPresetDraft(draft);
      });
      return () => {
        cancelled = true;
      };
    } else if (isBespokeStudio) {
      let cancelled = false;
      readBespokeCheckout()
        .then((draft) => {
          if (!cancelled) setBespokeData(draft);
        })
        .catch(() => {
          if (!cancelled) {
            setErrors({
              submission: 'Your artwork could not be loaded. Return to the studio and try again.',
            });
          }
        });
      return () => {
        cancelled = true;
      };
    }
  }, [isPresetStudio, isBespokeStudio, logos]);

  // Form Fields State
  const [formData, setFormData] = useState<CheckoutFormData>({
    prenom: '',
    nom: '',
    telephone: '',
    ville: 'Casablanca',
    adresse: '',
    notes: '',
    paymentMethod: 'virement',
  });

  const updateFormField = <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Feedback states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [preparedWhatsappUrl, setPreparedWhatsappUrl] = useState('');
  const submitting = useRef(false);

  // Pricing calculation
  const calculatedTotal = useMemo(() => {
    if (isFromCart) return cartSubtotal;
    if (isPresetStudio) return 350 * quantity;
    if (isBespokeStudio) return 350 * quantity;
    return catalogProduct.price * quantity;
  }, [isFromCart, cartSubtotal, isPresetStudio, isBespokeStudio, catalogProduct.price, quantity]);

  // Resolved Jacket Asset paths
  const activeJacketPath = useMemo(() => {
    if (isPresetStudio) {
      return presetDraft?.jacketColorId === 'white'
        ? '/images/studio/jacket-white-front.jpg'
        : '/images/studio/jacket-black-front.png';
    }
    if (isBespokeStudio) {
      const jId = bespokeData?.jacketId || jacketParam || 'black';
      return jId === 'white'
        ? '/images/studio/jacket-white-front.jpg'
        : '/images/studio/jacket-black-front.png';
    }
    return catalogProduct.image;
  }, [isPresetStudio, isBespokeStudio, presetDraft?.jacketColorId, bespokeData?.jacketId, jacketParam, catalogProduct.image]);

  // Generate both Front and Back PNG snapshots
  const generateBothSnapshots = async () => {
    setIsGeneratingSnapshots(true);
    try {
      if (isPresetStudio && presetDraft) {
        const frontImg = await renderCanvasSnapshot(activeJacketPath, presetDraft.layers.front, 600, 750, logos);
        const backImg = await renderCanvasSnapshot(activeJacketPath, presetDraft.layers.back, 600, 750, logos);
        setFrontSnapshot(frontImg);
        setBackSnapshot(backImg);
        return { front: frontImg, back: backImg };
      } else if (isBespokeStudio && bespokeData) {
        const frontImg = await renderBespokeSnapshot(
          activeJacketPath,
          bespokeData.artworks.front?.url,
          bespokeData.placements.front
        );
        const backImg = await renderBespokeSnapshot(
          activeJacketPath,
          bespokeData.artworks.back?.url,
          bespokeData.placements.back
        );
        setFrontSnapshot(frontImg);
        setBackSnapshot(backImg);
        return { front: frontImg, back: backImg };
      } else if (!isFromCart) {
        const front = await renderCanvasSnapshot(catalogProduct.images[0] || catalogProduct.image, [], 600, 750, logos);
        const back = await renderCanvasSnapshot(catalogProduct.images[1] || catalogProduct.image, [], 600, 750, logos);
        setFrontSnapshot(front);
        setBackSnapshot(back);
        return { front, back };
      }
    } catch {
      // ignore
    } finally {
      setIsGeneratingSnapshots(false);
    }
    return null;
  };

  const handleDownloadBothSnapshots = () => {
    void generateBothSnapshots().then((s) => {
      if (s?.front) downloadDataUrl(s.front, 'berserk-jacket-front.png');
      if (s?.back) setTimeout(() => downloadDataUrl(s.back, 'berserk-jacket-back.png'), 300);
    });
  };

  // Validation
  const validateForm = () => {
    const nextErrors: CheckoutErrors = {};
    if (!formData.prenom.trim()) nextErrors.prenom = 'First name required';
    if (!formData.nom.trim()) nextErrors.nom = 'Last name required';
    if (!formData.telephone.trim()) {
      nextErrors.telephone = 'Phone number required';
    } else if (formData.telephone.replace(/[^0-9]/g, '').length < 8) {
      nextErrors.telephone = 'Valid phone number required';
    }
    if (!formData.ville.trim()) nextErrors.ville = 'City required';
    if (!formData.adresse.trim()) nextErrors.adresse = 'Street address and neighborhood required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Submission handler
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey) document.getElementById(firstKey)?.focus();
      return;
    }

    if (submitting.current) return;
    if (!isPresetStudio && !isBespokeStudio && !isFromCart &&
        (!isProductSizeAvailable(catalogProduct, selectedSize) ||
          quantity > (catalogProduct.inventoryBySize?.[selectedSize] ?? Number.MAX_SAFE_INTEGER))) {
      setErrors({ submission: 'This size is sold out or the requested quantity is no longer available.' });
      return;
    }
    if (isFromCart) {
      const unavailable = cartItems.find((item) => {
        const liveProduct = products.find((product) => product.id === item.productId);
        return !liveProduct || !isProductSizeAvailable(liveProduct, item.size) ||
          item.quantity > (liveProduct.inventoryBySize?.[item.size] ?? Number.MAX_SAFE_INTEGER);
      });
      if (unavailable) {
        setErrors({ submission: `${unavailable.name} (${unavailable.size}) is sold out or has insufficient stock. Please update your cart.` });
        return;
      }
    }
    if ((isPresetStudio && !presetDraft) || (isBespokeStudio && !bespokeData)) {
      setErrors({
        submission: 'Your design is not ready. Please return to the studio before ordering.',
      });
      return;
    }
    submitting.current = true;
    const ref = 'BRK-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    setOrderRef(ref);

    // Generate previews for the customer to attach
    if (!isFromCart) {
      const snapshots = await generateBothSnapshots();
      if (!snapshots?.front || !snapshots.back) {
        submitting.current = false;
        setErrors({
          submission:
            'Could not prepare both preview images. Please return to the studio and check your artwork.',
        });
        return;
      }
    }

    const paymentOptionLabel =
      PREPAYMENT_OPTIONS.find((p) => p.id === formData.paymentMethod)?.label || 'BANK TRANSFER';

    const message = buildWhatsAppOrderMessage({
      ref,
      isPresetStudio,
      isBespokeStudio,
      isFromCart,
      presetDraft,
      bespokeData,
      catalogProduct,
      cartItems,
      selectedSize,
      quantity,
      calculatedTotal,
      formData,
      paymentOptionLabel,
      logos,
    });

    const whatsappUrl = buildWhatsAppUrl(message);
    setPreparedWhatsappUrl(whatsappUrl);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
    submitting.current = false;
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-6 sm:py-10 px-3 sm:px-6 flex justify-center">
      <div className="w-full max-w-5xl mx-auto flex items-stretch justify-center gap-2 sm:gap-4">
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
          <CheckoutHeader />

          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <OrderSummaryColumn
                isPresetStudio={isPresetStudio}
                isBespokeStudio={isBespokeStudio}
                isFromCart={isFromCart}
                presetDraft={presetDraft}
                bespokeData={bespokeData}
                jacketParam={jacketParam}
                catalogProduct={catalogProduct}
                cartItems={cartItems}
                activeJacketPath={activeJacketPath}
                activePreviewSide={activePreviewSide}
                setActivePreviewSide={setActivePreviewSide}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                setQuantity={setQuantity}
                calculatedTotal={calculatedTotal}
                onDownloadSnapshots={handleDownloadBothSnapshots}
                isGeneratingSnapshots={isGeneratingSnapshots}
              />

              <DeliveryForm
                formData={formData}
                updateField={updateFormField}
                errors={errors}
                clearError={clearFieldError}
                onSubmit={handleConfirmOrder}
                isGeneratingSnapshots={isGeneratingSnapshots}
                calculatedTotal={calculatedTotal}
              />
            </div>
          ) : (
            <OrderConfirmationModal
              orderRef={orderRef}
              preparedWhatsappUrl={preparedWhatsappUrl}
              formData={formData}
              calculatedTotal={calculatedTotal}
              frontSnapshot={frontSnapshot}
              backSnapshot={backSnapshot}
              onEditDetails={() => setIsSubmitted(false)}
              onDownloadImage={downloadDataUrl}
            />
          )}

          {/* Manga Footer */}
          <footer className="flex items-center justify-between pt-2 border-t-2 border-black text-[10px] font-mono text-stone-600 select-none">
            <span className="font-bold text-black uppercase">FUTURE STITCH MANU // SECURE ORDER</span>
            <span className="font-bold text-black uppercase">TAJIMA INDUSTRIAL EMBROIDERY ATELIER</span>
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
            因果の糸で紡がれし契約
          </div>
          <span className="text-[9px] font-mono text-stone-400 [writing-mode:vertical-rl] tracking-widest">
            【 決済 】
          </span>
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-white text-black font-mono text-xs">
          LOADING CHECKOUT ORDER FORM...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

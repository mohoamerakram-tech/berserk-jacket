'use client';

/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * English-First WhatsApp Checkout for Berserk Jacket Archive.
 *
 * KEY CAPABILITIES:
 * 1. Live Visual Preview of Custom & Bespoke Jackets with Placed Logos / Text:
 *    - Renders the exact garment base (Black or White) with every placed embroidery
 *      motif and text layer at its calibrated coordinates and thread colors.
 *    - Perspective switcher: Instantly toggle between FRONT and BACK previews.
 *    - For Bespoke Import: Projects the customer's uploaded artwork directly on the jacket.
 * 2. Front & Back Preview Images Generation:
 *    - Automatically generates high-resolution PNG composite snapshots of both
 *      FRONT and BACK perspectives via HTML5 Canvas.
 *    - Downloads them for the customer and displays them on the confirmation screen
 *      so they can be attached in the WhatsApp chat with the atelier.
 *    - Mentions the attached front & back previews in the WhatsApp text message.
 * 3. Professional Manga Editorial Aesthetic:
 *    - 100% English language throughout.
 *    - ZERO emojis or stickers. Pure brutalist manga typography, technical badges,
 *      and high-contrast borders.
 *    - Clear Prepayment Requirement (Bank Transfer, Cash Plus, Wafacash · No COD).
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { readBespokeCheckout } from '@/lib/studio/bespoke-checkout';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/lib/cart/CartProvider';
import {
  readStudioDraft,
  LOGOS,
  LOGO_COLORS,
  LOGO_SIZE_SCALE,
  JACKET_COLORS,
  TEXT_FONTS,
  StudioView,
  StudioLayer,
} from '@/lib/studio';
import { StudioDraft } from '@/lib/studio/storage';

type PrepaymentMethod = 'virement' | 'cashplus' | 'wafacash';

interface BespokeData {
  jacketId: string;
  artworks: {
    front: { name: string; url?: string; aspect?: number } | null;
    back: { name: string; url?: string; aspect?: number } | null;
  };
  placements: Record<'front' | 'back', { x: number; y: number; size: number; rotation: number }>;
}

const PREPAYMENT_OPTIONS: { id: PrepaymentMethod; tag: string; label: string; detail: string }[] = [
  {
    id: 'virement',
    tag: 'BANK TRANSFER',
    label: 'BANK TRANSFER',
    detail: 'CIH, Attijariwafa, BMCE, BCP or instant RIB transfer',
  },
  {
    id: 'cashplus',
    tag: 'CASH PLUS',
    label: 'CASH PLUS',
    detail: 'Direct branch cash deposit across Morocco',
  },
  {
    id: 'wafacash',
    tag: 'WAFACASH',
    label: 'WAFACASH',
    detail: 'Direct branch transfer across Morocco',
  },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Composites the jacket and embroidery layers onto a canvas for PNG snapshot generation
async function renderCanvasSnapshot(
  jacketSrc: string,
  layers: StudioLayer[],
  width = 600,
  height = 750
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, width, height);

  // Jacket photography
  try {
    const jacketImg = await loadImage(jacketSrc);
    const aspect = jacketImg.naturalWidth / jacketImg.naturalHeight;
    let dw = width;
    let dh = width / aspect;
    if (dh > height) {
      dh = height;
      dw = height * aspect;
    }
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;
    ctx.drawImage(jacketImg, dx, dy, dw, dh);
  } catch {
    throw new Error('Jacket preview could not be loaded');
  }

  // Layers
  for (const layer of layers) {
    const x = (layer.xPercent / 100) * width;
    const y = (layer.yPercent / 100) * height;
    const colorSwatch = LOGO_COLORS.find((c) => c.id === layer.colorId) || LOGO_COLORS[0];
    const scale = LOGO_SIZE_SCALE[layer.size] ?? 22;
    const sizePx = (scale / 100) * width;

    if (layer.type === 'logo') {
      const logo = LOGOS.find((l) => l.id === layer.logoId);
      if (logo?.path) {
        try {
          const logoImg = await loadImage(logo.path);
          const fit = Math.min(sizePx / logoImg.naturalWidth, sizePx / logoImg.naturalHeight);
          const lw = logoImg.naturalWidth * fit, lh = logoImg.naturalHeight * fit;
          if (logo.canRecolor) {
            const off = document.createElement('canvas');
            off.width = sizePx;
            off.height = sizePx;
            const offCtx = off.getContext('2d');
            if (offCtx) {
              offCtx.drawImage(logoImg, (sizePx - lw) / 2, (sizePx - lh) / 2, lw, lh);
              offCtx.globalCompositeOperation = 'source-in';
              offCtx.fillStyle = colorSwatch.hex;
              offCtx.fillRect(0, 0, sizePx, sizePx);
              ctx.drawImage(off, x - sizePx / 2, y - sizePx / 2);
            }
          } else {
            ctx.drawImage(logoImg, x - lw / 2, y - lh / 2, lw, lh);
          }
        } catch {
          throw new Error('Artwork preview could not be loaded');
        }
      }
    } else if (layer.type === 'text') {
      const font = TEXT_FONTS.find((f) => f.id === layer.fontId);
      const fontSize = sizePx * 0.18;
      const computedStyle = getComputedStyle(document.body);
      const family = (font?.cssFamily || 'sans-serif').replace(/var\((--[^)]+)\)/g, (_, property: string) => computedStyle.getPropertyValue(property).trim() || 'sans-serif');
      await document.fonts.load(`900 ${fontSize}px ${family}`);
      ctx.font = `900 ${fontSize}px ${family}`;
      ctx.letterSpacing = (fontSize / 20) + 'px';
      ctx.fillStyle = colorSwatch.hex;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(layer.text.toUpperCase(), x, y);
      ctx.shadowColor = 'transparent';
    }
  }

  return canvas.toDataURL('image/png');
}

// Composites bespoke uploaded artwork onto a canvas for PNG snapshot generation
async function renderBespokeSnapshot(
  jacketSrc: string,
  artworkUrl: string | undefined,
  placement: { x: number; y: number; size: number; rotation: number },
  width = 600,
  height = 750
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, width, height);

  try {
    const jacketImg = await loadImage(jacketSrc);
    const aspect = jacketImg.naturalWidth / jacketImg.naturalHeight;
    let dw = width;
    let dh = width / aspect;
    if (dh > height) {
      dh = height;
      dw = height * aspect;
    }
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;
    ctx.drawImage(jacketImg, dx, dy, dw, dh);
  } catch {
    throw new Error('Artwork preview could not be loaded');
  }

  if (artworkUrl) {
    try {
      const artImg = await loadImage(artworkUrl);
      const x = (placement.x / 100) * width;
      const y = (placement.y / 100) * height;
      const sizePx = (placement.size / 100) * width;
      const artAspect = artImg.naturalWidth / artImg.naturalHeight;
      const artHeight = sizePx / artAspect;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((placement.rotation * Math.PI) / 180);
      ctx.drawImage(artImg, -sizePx / 2, -artHeight / 2, sizePx, artHeight);
      ctx.restore();
    } catch {
      throw new Error('Artwork preview could not be loaded');
    }
  }

  return canvas.toDataURL('image/png');
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { items: cartItems, subtotal: cartSubtotal } = useCart();

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
      return PRODUCTS.find((p) => p.id === productId || p.slug === productId) || PRODUCTS[0];
    }
    return PRODUCTS[0];
  }, [productId]);

  // Selected size & quantity
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [quantity, setQuantity] = useState<number>(1);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Studio states loaded from session
  const [presetDraft, setPresetDraft] = useState<StudioDraft | null>(null);
  const [bespokeData, setBespokeData] = useState<BespokeData | null>(null);

  useEffect(() => {
    if (isPresetStudio) {
      let cancelled = false;
      Promise.resolve().then(readStudioDraft).then((draft) => {
        if (!cancelled) setPresetDraft(draft);
      });
      return () => { cancelled = true; };
    } else if (isBespokeStudio) {
      let cancelled = false;
      readBespokeCheckout().then((draft) => {
        if (!cancelled) setBespokeData(draft);
      }).catch(() => {
        if (!cancelled) setErrors({ submission: 'Your artwork could not be loaded. Return to the studio and try again.' });
      });
      return () => { cancelled = true; };
    }
  }, [isPresetStudio, isBespokeStudio]);

  // Form Fields
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ville, setVille] = useState('Casablanca');
  const [adresse, setAdresse] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PrepaymentMethod>('virement');

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
        const frontImg = await renderCanvasSnapshot(
          activeJacketPath,
          presetDraft.layers.front
        );
        const backImg = await renderCanvasSnapshot(
          activeJacketPath,
          presetDraft.layers.back
        );
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
        const front = await renderCanvasSnapshot(catalogProduct.images[0] || catalogProduct.image, []);
        const back = await renderCanvasSnapshot(catalogProduct.images[1] || catalogProduct.image, []);
        setFrontSnapshot(front); setBackSnapshot(back);
        return { front, back };
      }
    } catch {
      // ignore
    } finally {
      setIsGeneratingSnapshots(false);
    }
    return null;
  };

  // Validation
  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!prenom.trim()) nextErrors.prenom = 'First name required';
    if (!nom.trim()) nextErrors.nom = 'Last name required';
    if (!telephone.trim()) {
      nextErrors.telephone = 'Phone number required';
    } else if (telephone.replace(/[^0-9]/g, '').length < 8) {
      nextErrors.telephone = 'Valid phone number required';
    }
    if (!ville.trim()) nextErrors.ville = 'City required';
    if (!adresse.trim()) nextErrors.adresse = 'Street address and neighborhood required';

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
    if ((isPresetStudio && !presetDraft) || (isBespokeStudio && !bespokeData)) {
      setErrors({ submission: 'Your design is not ready. Please return to the studio before ordering.' });
      return;
    }
    submitting.current = true;
    const ref = 'BRK-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    setOrderRef(ref);

    // Generate previews for the customer to attach; a wa.me link cannot attach files.
    let snapshots: { front: string; back: string } | null = null;
    if (!isFromCart) {
      snapshots = await generateBothSnapshots();
      if (!snapshots?.front || !snapshots.back) {
        submitting.current = false;
        setErrors({ submission: 'Could not prepare both preview images. Please return to the studio and check your artwork.' });
        return;
      }
    }

    const paymentOption =
      PREPAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label || 'BANK TRANSFER';

    // Construct structured WhatsApp message in clean English
    const lines: string[] = [
      `*ORDER // BERSERK JACKET ARCHIVE*`,
      `*REF:* ${ref}`,
      `----------------------------------------`,
    ];

    if (isPresetStudio && presetDraft) {
      const jacketObj =
        JACKET_COLORS.find((j) => j.id === presetDraft.jacketColorId) || JACKET_COLORS[0];
      lines.push(`*PRODUCT:* BESPOKE CUSTOM EMBROIDERED JACKET`);
      lines.push(`• Base Garment: ${jacketObj.label}`);
      lines.push(`• Selected Size: ${selectedSize}`);
      lines.push(`• Quantity: ${quantity}`);
      lines.push(``);
      lines.push(`*ATTACHED PREVIEW IMAGES:*`);
      lines.push(`• I will attach the front and back preview images in this chat.`);
      lines.push(``);
      lines.push(`*FRONT EMBROIDERY (${presetDraft.layers.front.length} ELEMENTS):*`);
      if (presetDraft.layers.front.length === 0) {
        lines.push(`• None`);
      } else {
        presetDraft.layers.front.forEach((l, i) => {
          const colorName = l.type === 'logo' && !LOGOS.find((m) => m.id === l.logoId)?.canRecolor ? 'Original artwork colors' : LOGO_COLORS.find((c) => c.id === l.colorId)?.label || l.colorId;
          if (l.type === 'logo') {
            const motif = LOGOS.find((m) => m.id === l.logoId)?.label || l.logoId;
            lines.push(
              `  ${i + 1}. Motif: ${motif} | Thread: ${colorName} | Size: ${l.size.toUpperCase()} | Pos: ${Math.round(l.xPercent)}% x ${Math.round(l.yPercent)}%`
            );
          } else {
            lines.push(
              `  ${i + 1}. Text: "${l.text}" (Font: ${l.fontId}) | Thread: ${colorName} | Size: ${l.size.toUpperCase()}`
            );
          }
        });
      }
      lines.push(``);
      lines.push(`*BACK EMBROIDERY (${presetDraft.layers.back.length} ELEMENTS):*`);
      if (presetDraft.layers.back.length === 0) {
        lines.push(`• None`);
      } else {
        presetDraft.layers.back.forEach((l, i) => {
          const colorName = l.type === 'logo' && !LOGOS.find((m) => m.id === l.logoId)?.canRecolor ? 'Original artwork colors' : LOGO_COLORS.find((c) => c.id === l.colorId)?.label || l.colorId;
          if (l.type === 'logo') {
            const motif = LOGOS.find((m) => m.id === l.logoId)?.label || l.logoId;
            lines.push(
              `  ${i + 1}. Motif: ${motif} | Thread: ${colorName} | Size: ${l.size.toUpperCase()} | Pos: ${Math.round(l.xPercent)}% x ${Math.round(l.yPercent)}%`
            );
          } else {
            lines.push(
              `  ${i + 1}. Text: "${l.text}" (Font: ${l.fontId}) | Thread: ${colorName} | Size: ${l.size.toUpperCase()}`
            );
          }
        });
      }
      lines.push(`• Valuation: ${calculatedTotal} Dh`);
    } else if (isBespokeStudio && bespokeData) {
      lines.push(`*PRODUCT:* BESPOKE ARTWORK IMPORT JACKET`);
      lines.push(`• Jacket Base Color: ${bespokeData.jacketId.toUpperCase()}`);
      lines.push(`• Selected Size: ${selectedSize}`);
      lines.push(`• Quantity: ${quantity}`);
      lines.push(``);
      lines.push(`*ATTACHED PREVIEWS & ARTWORK:*`);
      lines.push(`• I will attach the front and back preview images in this chat.`);
      lines.push(`• I will attach my original artwork files in this chat.`);
      if (bespokeData.artworks.front) {
        const p = bespokeData.placements.front;
        lines.push(
          `• Front Artwork: ${bespokeData.artworks.front.name} (Scale: ${Math.round(p.size)}%, Pos: ${Math.round(p.x)}% x ${Math.round(p.y)}%, Rot: ${p.rotation}°)`
        );
      } else {
        lines.push(`• Front Artwork: None`);
      }
      if (bespokeData.artworks.back) {
        const p = bespokeData.placements.back;
        lines.push(
          `• Back Artwork: ${bespokeData.artworks.back.name} (Scale: ${Math.round(p.size)}%, Pos: ${Math.round(p.x)}% x ${Math.round(p.y)}%, Rot: ${p.rotation}°)`
        );
      } else {
        lines.push(`• Back Artwork: None`);
      }
      lines.push(`• Atelier Base Quote: ${calculatedTotal} Dh`);
    } else if (isFromCart) {
      lines.push(`*PRODUCT:* MULTI-ITEM ORDER (CART)`);
      cartItems.forEach((item) => {
        lines.push(
          `• ${item.name} | Size: ${item.size} | Qty: ${item.quantity} - ${item.price * item.quantity} Dh`
        );
      });
      lines.push(`• Subtotal: ${calculatedTotal} Dh`);
    } else {
      lines.push(`*PRODUCT:* ${catalogProduct.name}`);
      lines.push(`• Size: ${selectedSize}`);
      lines.push(`• Quantity: ${quantity}`);
      lines.push(`• Unit Price: ${catalogProduct.price} Dh`);
      lines.push(`• Total: ${calculatedTotal} Dh`);
    }

    lines.push(`----------------------------------------`);
    lines.push(`*TOTAL DUE:* ${calculatedTotal} Dh`);
    lines.push(``);
    lines.push(`*DELIVERY DETAILS:*`);
    lines.push(`• Recipient: ${prenom.trim()} ${nom.trim()}`);
    lines.push(`• Phone / WhatsApp: ${telephone.trim()}`);
    lines.push(`• City: ${ville.trim()}`);
    lines.push(`• Address: ${adresse.trim()}`);
    if (notes.trim()) {
      lines.push(`• Special Instructions: ${notes.trim()}`);
    }
    lines.push(``);
    lines.push(`*PREPAYMENT:*`);
    lines.push(`• Selected Channel: ${paymentOption}`);
    lines.push(`• Term: Prepayment required accepted (No cash-on-delivery).`);
    lines.push(``);
    lines.push(`Please send payment details to confirm production and dispatch.`);

    const rawWhatsappNumber = (
      typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '' : ''
    ).replace(/[^0-9]/g, '');

    const whatsappUrl = rawWhatsappNumber
      ? `https://wa.me/${rawWhatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
      : `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;

    setPreparedWhatsappUrl(whatsappUrl);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
    submitting.current = false;
  };

  // Active layers on current preview side
  const currentSideLayers = useMemo(() => {
    if (!presetDraft) return [];
    return presetDraft.layers[activePreviewSide];
  }, [presetDraft, activePreviewSide]);

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
          
          {/* Header */}
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

          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ===================================================================
                  COLUMN 1: ORDER SUMMARY (WITH LIVE JACKET & LOGO PREVIEW)
                 =================================================================== */}
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

                  {/* 1. PRESET STUDIO LIVE JACKET PREVIEW (SHOWING REAL PLACED LOGOS) */}
                  {isPresetStudio ? (
                    <div className="space-y-3">
                      
                      {/* Perspective Switcher: Toggle between Front and Back */}
                      <div className="grid grid-cols-2 gap-1 bg-stone-900 p-1 border border-stone-800">
                        <button
                          type="button"
                          onClick={() => setActivePreviewSide('front')}
                          className={`py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activePreviewSide === 'front'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          ◆ FRONT ({presetDraft?.layers.front.length || 0} MOTIFS)
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePreviewSide('back')}
                          className={`py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activePreviewSide === 'back'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          ◆ BACK ({presetDraft?.layers.back.length || 0} MOTIFS)
                        </button>
                      </div>

                      {/* Interactive Visual Canvas with Mockup + Placed Logos */}
                      <div className="relative w-full aspect-[4/5] bg-stone-950 border border-stone-800 overflow-hidden select-none flex items-center justify-center">
                        <Image
                          src={activeJacketPath}
                          alt="Custom Jacket Base"
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain p-2"
                        />

                        {/* Top-Left Perspective Watermark */}
                        <span className="absolute top-2 left-2 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 border border-white/40 uppercase">
                          {activePreviewSide.toUpperCase()} VIEW // {activePreviewSide === 'front' ? '表' : '裏'}
                        </span>

                        {/* Placed Embroidery Overlays for Active Side */}
                        {currentSideLayers.map((layer) => {
                          const colorSwatch =
                            LOGO_COLORS.find((c) => c.id === layer.colorId) || LOGO_COLORS[0];
                          const sizeScale = LOGO_SIZE_SCALE[layer.size] ?? 22;

                          if (layer.type === 'logo') {
                            const logo = LOGOS.find((l) => l.id === layer.logoId) || LOGOS[0];
                            return (
                              <div
                                key={layer.id}
                                className="absolute pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                                style={{
                                  left: `${layer.xPercent}%`,
                                  top: `${layer.yPercent}%`,
                                  width: `${sizeScale}%`,
                                  aspectRatio: '1',
                                  transform: 'translate(-50%, -50%)',
                                }}
                              >
                                {logo?.canRecolor ? (
                                  <div
                                    className="w-full h-full"
                                    style={{
                                      backgroundColor: colorSwatch.hex,
                                      WebkitMaskImage: `url(${logo.path})`,
                                      maskImage: `url(${logo.path})`,
                                      WebkitMaskSize: 'contain',
                                      maskSize: 'contain',
                                      WebkitMaskRepeat: 'no-repeat',
                                      maskRepeat: 'no-repeat',
                                      WebkitMaskPosition: 'center',
                                      maskPosition: 'center',
                                    }}
                                  />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={logo.path}
                                    alt={logo.label}
                                    className="w-full h-full object-contain"
                                  />
                                )}
                              </div>
                            );
                          }

                          // Text layer
                          const textFont =
                            TEXT_FONTS.find((f) => f.id === layer.fontId) || TEXT_FONTS[0];
                          return (
                            <div
                              key={layer.id}
                              className="absolute pointer-events-none select-none"
                              style={{
                                left: `${layer.xPercent}%`,
                                top: `${layer.yPercent}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <span
                                className="uppercase block"
                                style={{
                                  color: colorSwatch.hex,
                                  fontFamily: textFont.cssFamily,
                                  fontSize:
                                    layer.size === 'small' ? '12px' : layer.size === 'medium' ? '16px' : '22px',
                                  fontWeight: 900,
                                  letterSpacing: '0.05em',
                                  whiteSpace: 'nowrap',
                                  textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                                }}
                              >
                                {layer.text}
                              </span>
                            </div>
                          );
                        })}

                        {currentSideLayers.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-black/80 text-stone-400 text-[10px] font-mono px-3 py-1 border border-stone-800 uppercase">
                              NO MOTIFS ON {activePreviewSide.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Jacket Title & Base Color */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-sans font-black text-sm uppercase text-white">
                            CUSTOM EMBROIDERED JACKET
                          </h3>
                          <span className="text-[10px] font-mono font-bold bg-white text-black px-1.5 py-0.5 uppercase">
                            BASE: {presetDraft?.jacketColorId.toUpperCase() || 'BLACK'}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-stone-400">
                          Heavyweight Japanese Twill Cotton · Tajima industrial embroidery relief
                        </p>
                      </div>

                      {/* Front Layers Specification */}
                      <div className="border-t border-stone-800 pt-2 space-y-1 text-[10px] font-mono">
                        <span className="text-stone-400 font-bold block uppercase">
                          FRONT EMBROIDERY ({presetDraft?.layers.front.length || 0}) :
                        </span>
                        {presetDraft && presetDraft.layers.front.length > 0 ? (
                          presetDraft.layers.front.map((layer, idx) => {
                            const color =
                              LOGO_COLORS.find((c) => c.id === layer.colorId)?.label || layer.colorId;
                            return (
                              <div key={layer.id} className="flex justify-between text-stone-300">
                                <span>
                                  {idx + 1}. {layer.type === 'logo' ? 'Logo Motif' : `Text "${layer.text}"`}
                                </span>
                                <span className="text-stone-400 uppercase">
                                  {color} · {layer.size}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-stone-500">None placed on front</span>
                        )}
                      </div>

                      {/* Back Layers Specification */}
                      <div className="border-t border-stone-800 pt-2 space-y-1 text-[10px] font-mono">
                        <span className="text-stone-400 font-bold block uppercase">
                          BACK EMBROIDERY ({presetDraft?.layers.back.length || 0}) :
                        </span>
                        {presetDraft && presetDraft.layers.back.length > 0 ? (
                          presetDraft.layers.back.map((layer, idx) => {
                            const color =
                              LOGO_COLORS.find((c) => c.id === layer.colorId)?.label || layer.colorId;
                            return (
                              <div key={layer.id} className="flex justify-between text-stone-300">
                                <span>
                                  {idx + 1}. {layer.type === 'logo' ? 'Logo Motif' : `Text "${layer.text}"`}
                                </span>
                                <span className="text-stone-400 uppercase">
                                  {color} · {layer.size}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-stone-500">None placed on back</span>
                        )}
                      </div>

                      {/* Jacket Size Selector */}
                      <div className="border-t border-stone-800 pt-2 space-y-1.5">
                        <label className="block font-mono text-[10px] font-bold uppercase text-stone-300">
                          SELECT JACKET SIZE:
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                          {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSelectedSize(s)}
                              className={`py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                                selectedSize === s
                                  ? 'bg-red-600 text-white border-white'
                                  : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Download Snapshot Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => void generateBothSnapshots().then((s) => {
                            if (s?.front) downloadDataUrl(s.front, 'berserk-jacket-front.png');
                            if (s?.back) setTimeout(() => downloadDataUrl(s.back, 'berserk-jacket-back.png'), 300);
                          })}
                          disabled={isGeneratingSnapshots}
                          className="w-full py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {isGeneratingSnapshots ? 'GENERATING SNAPSHOTS...' : 'DOWNLOAD FRONT & BACK PREVIEWS'}
                        </button>
                      </div>
                    </div>
                  ) : isBespokeStudio ? (
                    /* 2. BESPOKE IMPORT STUDIO LIVE PREVIEW */
                    <div className="space-y-3">
                      
                      {/* Perspective Switcher */}
                      <div className="grid grid-cols-2 gap-1 bg-stone-900 p-1 border border-stone-800">
                        <button
                          type="button"
                          onClick={() => setActivePreviewSide('front')}
                          className={`py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activePreviewSide === 'front'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          ◆ FRONT ARTWORK
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePreviewSide('back')}
                          className={`py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activePreviewSide === 'back'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          ◆ BACK ARTWORK
                        </button>
                      </div>

                      {/* Visual Mockup with Customer Artwork Overlay */}
                      <div className="relative w-full aspect-[4/5] bg-stone-950 border border-stone-800 overflow-hidden select-none flex items-center justify-center">
                        <Image
                          src={activeJacketPath}
                          alt="Bespoke Jacket"
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain p-2"
                        />

                        {/* Front Artwork Overlay */}
                        {activePreviewSide === 'front' && bespokeData?.artworks.front?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={bespokeData.artworks.front.url}
                            alt="Front Artwork Overlay"
                            className="absolute pointer-events-none object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                            style={{
                              left: `${bespokeData.placements.front.x}%`,
                              top: `${bespokeData.placements.front.y}%`,
                              width: `${bespokeData.placements.front.size}%`,
                              transform: `translate(-50%, -50%) rotate(${bespokeData.placements.front.rotation}deg)`,
                            }}
                          />
                        )}

                        {/* Back Artwork Overlay */}
                        {activePreviewSide === 'back' && bespokeData?.artworks.back?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={bespokeData.artworks.back.url}
                            alt="Back Artwork Overlay"
                            className="absolute pointer-events-none object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                            style={{
                              left: `${bespokeData.placements.back.x}%`,
                              top: `${bespokeData.placements.back.y}%`,
                              width: `${bespokeData.placements.back.size}%`,
                              transform: `translate(-50%, -50%) rotate(${bespokeData.placements.back.rotation}deg)`,
                            }}
                          />
                        )}

                        {/* Fallback if no artwork for side */}
                        {((activePreviewSide === 'front' && !bespokeData?.artworks.front?.url) ||
                          (activePreviewSide === 'back' && !bespokeData?.artworks.back?.url)) && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-black/80 text-stone-400 text-[10px] font-mono px-3 py-1 border border-stone-800 uppercase">
                              NO ARTWORK ON {activePreviewSide.toUpperCase()}
                            </span>
                          </div>
                        )}

                        <span className="absolute top-2 left-2 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 border border-white/40 uppercase">
                          IMPORT BESPOKE // {activePreviewSide.toUpperCase()}
                        </span>
                      </div>

                      {/* Bespoke Header */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-sans font-black text-sm uppercase text-white">
                            BESPOKE CUSTOM ARTWORK JACKET
                          </h3>
                          <span className="text-[10px] font-mono font-bold bg-white text-black px-1.5 py-0.5 uppercase">
                            BASE: {(bespokeData?.jacketId || jacketParam || 'BLACK').toUpperCase()}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-stone-400">
                          Direct digitizing and industrial embroidery of your custom PNG/JPG artwork
                        </p>
                      </div>

                      {/* Artwork Specs */}
                      <div className="border-t border-stone-800 pt-2 space-y-1 text-[10px] font-mono text-stone-300">
                        <div className="flex justify-between">
                          <span className="text-stone-400">FRONT ARTWORK:</span>
                          <span className="font-bold text-white truncate max-w-[170px]">
                            {bespokeData?.artworks.front?.name || 'Not configured'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">BACK ARTWORK:</span>
                          <span className="font-bold text-white truncate max-w-[170px]">
                            {bespokeData?.artworks.back?.name || 'Not configured'}
                          </span>
                        </div>
                      </div>

                      {/* Size Selector */}
                      <div className="border-t border-stone-800 pt-2 space-y-1.5">
                        <label className="block font-mono text-[10px] font-bold uppercase text-stone-300">
                          SELECT JACKET SIZE:
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                          {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSelectedSize(s)}
                              className={`py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                                selectedSize === s
                                  ? 'bg-red-600 text-white border-white'
                                  : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Download Snapshot Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => void generateBothSnapshots().then((s) => {
                            if (s?.front) downloadDataUrl(s.front, 'bespoke-jacket-front.png');
                            if (s?.back) setTimeout(() => downloadDataUrl(s.back, 'bespoke-jacket-back.png'), 300);
                          })}
                          disabled={isGeneratingSnapshots}
                          className="w-full py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {isGeneratingSnapshots ? 'GENERATING SNAPSHOTS...' : 'DOWNLOAD FRONT & BACK PREVIEWS'}
                        </button>
                      </div>
                    </div>
                  ) : isFromCart ? (
                    /* 3. CART MULTI-ITEM DISPLAY */
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
                  ) : (
                    /* 4. CATALOG SINGLE PRODUCT */
                    <div className="space-y-3">
                      <div className="relative w-full h-52 bg-black border border-stone-800 overflow-hidden">
                        <Image
                          src={catalogProduct.image}
                          alt={catalogProduct.name}
                          fill
                          priority
                          className="object-cover object-center"
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
                          {catalogProduct.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSelectedSize(s)}
                              className={`py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                                selectedSize === s
                                  ? 'bg-red-600 text-white border-white'
                                  : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
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
                            onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                            className="w-6 h-6 bg-stone-900 border border-stone-700 text-white font-bold flex items-center justify-center hover:bg-stone-800 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
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

              {/* ===================================================================
                  COLUMN 2: DELIVERY INFORMATION & PREPAYMENT (100% ENGLISH)
                 =================================================================== */}
              <div className="lg:col-span-7">
                <form onSubmit={handleConfirmOrder} className="border-[3px] border-black bg-white p-5 sm:p-6 space-y-5 shadow-sm" noValidate>
                  
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
                        value={prenom}
                        onChange={(e) => {
                          setPrenom(e.target.value);
                          if (errors.prenom) setErrors((p) => ({ ...p, prenom: '' }));
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
                        value={nom}
                        onChange={(e) => {
                          setNom(e.target.value);
                          if (errors.nom) setErrors((p) => ({ ...p, nom: '' }));
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
                      value={telephone}
                      onChange={(e) => {
                        setTelephone(e.target.value);
                        if (errors.telephone) setErrors((p) => ({ ...p, telephone: '' }));
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
                      value={ville}
                      onChange={(e) => {
                        setVille(e.target.value);
                        if (errors.ville) setErrors((p) => ({ ...p, ville: '' }));
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
                      value={adresse}
                      onChange={(e) => {
                        setAdresse(e.target.value);
                        if (errors.adresse) setErrors((p) => ({ ...p, adresse: '' }));
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
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-1.5 border border-stone-300 font-mono text-xs text-black placeholder:text-stone-400 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* ===============================================================
                      PREPAYMENT REQUIREMENT NOTICE (NO STICKERS / 100% ENGLISH)
                     =============================================================== */}
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
                      Your order is confirmed and scheduled for artisan production <span className="text-white font-bold underline">only after advance prepayment</span> via Bank Transfer, Cash Plus, or Wafacash. Cash on delivery is not accepted.
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

                  {/* ===============================================================
                      SUBMIT BUTTON: UNIFIED WHATSAPP THEME
                     =============================================================== */}
                  <div className="pt-1">
                    {errors.submission && <p role="alert" className="text-red-600 text-xs mb-3">{errors.submission}</p>}
                    <button
                      type="submit"
                      id="confirm-whatsapp-order-cta"
                      disabled={isGeneratingSnapshots}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] text-white font-mono font-bold uppercase text-xs sm:text-sm tracking-widest py-3 px-5 border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
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

            </div>
          ) : (
            /* ===============================================================
               CONFIRMATION RECEIPT STATE (WITH FRONT & BACK PREVIEW SNAPSHOTS)
               =============================================================== */
            <div className="border-[3px] border-black bg-stone-950 text-white p-6 sm:p-10 text-center space-y-6 shadow-xl">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-3 py-1 uppercase tracking-widest border border-white">
                [ORDER DRAFT READY // 注文内容]
              </span>

              <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
                SEND YOUR ORDER IN WHATSAPP
              </h2>

              <p className="font-mono text-xs text-stone-400 max-w-md mx-auto">
                Your order details are ready. Open WhatsApp, send the message, and attach your preview images below. Your order is not confirmed until the atelier replies and prepayment is arranged.
              </p>

              <a href={preparedWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#25D366] px-5 py-3 font-mono font-bold text-white">OPEN WHATSAPP</a>

              {/* Order Reference Table */}
              <div className="max-w-md mx-auto bg-stone-900 border border-stone-800 p-4 text-left font-mono text-xs space-y-2 text-stone-300">
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">REFERENCE:</span>
                  <span className="text-white font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">RECIPIENT:</span>
                  <span className="text-white font-bold">{prenom} {nom}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">DESTINATION:</span>
                  <span className="text-white font-bold">{ville}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-500 uppercase">PREPAYMENT METHOD:</span>
                  <span className="text-white font-bold uppercase">{paymentMethod}</span>
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
                          onClick={() => downloadDataUrl(frontSnapshot, `${orderRef}-FRONT.png`)}
                          className="w-full py-1 text-[9px] font-mono font-bold uppercase bg-stone-800 hover:bg-stone-700 text-white border border-stone-600"
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
                          onClick={() => downloadDataUrl(backSnapshot, `${orderRef}-BACK.png`)}
                          className="w-full py-1 text-[9px] font-mono font-bold uppercase bg-stone-800 hover:bg-stone-700 text-white border border-stone-600"
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
                  onClick={() => setIsSubmitted(false)}
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

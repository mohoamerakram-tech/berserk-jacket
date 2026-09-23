import { JACKET_COLORS, LOGOS, LOGO_COLORS } from '@/lib/studio';
import { OrderMessageContext } from './types';

/**
 * Builds the structured, brutalist English order message sent to the atelier via WhatsApp.
 */
export function buildWhatsAppOrderMessage(ctx: OrderMessageContext): string {
  const logos = ctx.logos ?? LOGOS;
  const {
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
  } = ctx;

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
        const colorName =
          l.type === 'logo' && !logos.find((m) => m.id === l.logoId)?.canRecolor
            ? 'Original artwork colors'
            : LOGO_COLORS.find((c) => c.id === l.colorId)?.label || l.colorId;
        if (l.type === 'logo') {
          const motif = logos.find((m) => m.id === l.logoId)?.label || l.logoId;
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
        const colorName =
          l.type === 'logo' && !logos.find((m) => m.id === l.logoId)?.canRecolor
            ? 'Original artwork colors'
            : LOGO_COLORS.find((c) => c.id === l.colorId)?.label || l.colorId;
        if (l.type === 'logo') {
          const motif = logos.find((m) => m.id === l.logoId)?.label || l.logoId;
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
  lines.push(`• Recipient: ${formData.prenom.trim()} ${formData.nom.trim()}`);
  lines.push(`• Phone / WhatsApp: ${formData.telephone.trim()}`);
  lines.push(`• City: ${formData.ville.trim()}`);
  lines.push(`• Address: ${formData.adresse.trim()}`);
  if (formData.notes.trim()) {
    lines.push(`• Special Instructions: ${formData.notes.trim()}`);
  }
  lines.push(``);
  lines.push(`*PREPAYMENT:*`);
  lines.push(`• Selected Channel: ${paymentOptionLabel}`);
  lines.push(`• Term: Prepayment required accepted (No cash-on-delivery).`);
  lines.push(``);
  lines.push(`Please send payment details to confirm production and dispatch.`);

  return lines.join('\n');
}

/**
 * Builds the WhatsApp deep link (wa.me) for sending the order.
 */
export function buildWhatsAppUrl(message: string, customPhone?: string): string {
  const rawNumber = (
    customPhone ??
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '' : '')
  ).replace(/[^0-9]/g, '');

  return rawNumber
    ? `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

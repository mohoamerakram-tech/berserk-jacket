import { StudioDraft } from '@/lib/studio/storage';
import { CartItem } from '@/lib/cart/types';
import { Product } from '@/lib/types';
import { Logo } from '@/lib/studio/types';

export type PrepaymentMethod = 'virement' | 'cashplus' | 'wafacash';

export interface PrepaymentOption {
  id: PrepaymentMethod;
  tag: string;
  label: string;
  detail: string;
}

export const PREPAYMENT_OPTIONS: PrepaymentOption[] = [
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

export interface BespokeData {
  jacketId: string;
  artworks: {
    front: { name: string; url?: string; aspect?: number } | null;
    back: { name: string; url?: string; aspect?: number } | null;
  };
  placements: Record<'front' | 'back', { x: number; y: number; size: number; rotation: number }>;
}

export interface CheckoutFormData {
  prenom: string;
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  notes: string;
  paymentMethod: PrepaymentMethod;
}

export type CheckoutErrors = Record<string, string>;

export interface Snapshots {
  front: string;
  back: string;
}

export interface OrderMessageContext {
  ref: string;
  isPresetStudio: boolean;
  isBespokeStudio: boolean;
  isFromCart: boolean;
  presetDraft: StudioDraft | null;
  bespokeData: BespokeData | null;
  catalogProduct: Product;
  cartItems: CartItem[];
  selectedSize: string;
  quantity: number;
  calculatedTotal: number;
  formData: CheckoutFormData;
  paymentOptionLabel: string;
  logos?: Logo[];
}

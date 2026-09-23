import 'server-only';

import type { Collection, Product, ProductCategory } from '@/lib/types';
import type { Logo } from '@/lib/studio/types';
import { uploadCatalogImage } from '@/lib/catalog/server';

function text(form: FormData, key: string, max = 5000): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function optionalNumber(form: FormData, key: string): number | undefined {
  const raw = text(form, key, 30);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function safeImageUrl(value: string): string | null {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function slugify(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
}

function parseInventory(raw: string): Record<string, number> {
  const inventory: Record<string, number> = {};
  for (const line of raw.split(/[\n,]+/)) {
    const [rawSize, rawQuantity] = line.split(':');
    const size = rawSize?.trim().toUpperCase().replace(/[^A-Z0-9+-]/g, '').slice(0, 12);
    const quantity = Number.parseInt(rawQuantity?.trim() || '', 10);
    if (size && Number.isFinite(quantity) && quantity >= 0 && quantity <= 100000) inventory[size] = quantity;
  }
  return inventory;
}

export async function productFromForm(form: FormData, existing?: Product): Promise<Product> {
  const name = text(form, 'name', 160);
  const slug = slugify(text(form, 'slug', 120) || name);
  const japaneseName = text(form, 'japaneseName', 160);
  const description = text(form, 'description', 5000);
  const price = optionalNumber(form, 'price');
  const category = text(form, 'category', 30) as ProductCategory;
  if (!name || !slug || !japaneseName || !description || price === undefined) {
    throw new Error('Name, slug, Japanese name, description, and a valid price are required.');
  }
  if (!['jacket', 'hoodie', 'tee', 'accessory'].includes(category)) throw new Error('Choose a valid product category.');

  const inventoryBySize = parseInventory(text(form, 'inventory', 1000));
  if (!Object.keys(inventoryBySize).length) throw new Error('Add at least one size and quantity, for example: S:3, M:5.');
  const sizes = Object.keys(inventoryBySize);
  const stockQuantity = Object.values(inventoryBySize).reduce((total, quantity) => total + quantity, 0);

  let images: string[] = [];
  const existingImages = text(form, 'existingImages', 10000);
  if (existingImages) {
    try {
      const values = JSON.parse(existingImages) as unknown;
      if (Array.isArray(values)) images = values.filter((value): value is string => typeof value === 'string').map(safeImageUrl).filter((value): value is string => Boolean(value));
    } catch {
      images = existingImages.split(/\r?\n/).map((value) => value.trim()).map(safeImageUrl).filter((value): value is string => Boolean(value));
    }
  }
  const files = form.getAll('images').filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > 8) throw new Error('Upload no more than eight product images at once.');
  for (const file of files) images.push(await uploadCatalogImage(file, 'products'));
  images = [...new Set(images)].slice(0, 12);
  if (!images.length) throw new Error('Add at least one product image.');

  const now = new Date().toISOString();
  return {
    id: existing?.id || `prod-${crypto.randomUUID()}`,
    slug,
    name,
    japaneseName,
    category,
    price,
    image: images[0],
    images,
    panelNumber: text(form, 'panelNumber', 10) || existing?.panelNumber || '01',
    badge: text(form, 'badge', 50) || undefined,
    description,
    inStock: stockQuantity > 0,
    sizes,
    sku: text(form, 'sku', 80) || undefined,
    status: text(form, 'status', 20) === 'draft' ? 'draft' : 'active',
    stockQuantity,
    inventoryBySize,
    compareAtPrice: optionalNumber(form, 'compareAtPrice'),
    costPrice: optionalNumber(form, 'costPrice'),
    shortDescription: text(form, 'shortDescription', 500) || undefined,
    materials: text(form, 'materials', 1000) || undefined,
    embroideryDetails: text(form, 'embroideryDetails', 1500) || undefined,
    fit: text(form, 'fit', 500) || undefined,
    careInstructions: text(form, 'careInstructions', 1000) || undefined,
    shippingNote: text(form, 'shippingNote', 1000) || undefined,
    color: text(form, 'color', 100) || undefined,
    weightGrams: optionalNumber(form, 'weightGrams'),
    tags: text(form, 'tags', 1000).split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 30),
    featured: form.get('featured') === 'on',
    seoTitle: text(form, 'seoTitle', 180) || undefined,
    seoDescription: text(form, 'seoDescription', 320) || undefined,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    collectionId: text(form, 'collectionId', 120) || 'berserk',
    salesCount: optionalNumber(form, 'salesCount') ?? existing?.salesCount ?? 0,
  };
}

export async function logoFromForm(form: FormData, existing?: Logo): Promise<Logo> {
  const label = text(form, 'label', 100);
  const japaneseLabel = text(form, 'japaneseLabel', 100);
  const id = existing?.id || slugify(text(form, 'id', 120) || label);
  const file = form.get('image');
  if (!id || !label || !japaneseLabel) throw new Error('Logo ID, English label, and Japanese label are required.');
  let path = existing?.path || '';
  if (file instanceof File && file.size) path = await uploadCatalogImage(file, 'logos');
  if (!path) throw new Error('Choose a logo image.');
  const now = new Date().toISOString();
  return {
    id,
    label,
    japaneseLabel,
    path,
    canRecolor: form.get('canRecolor') === 'on',
    active: form.get('active') !== 'off',
    collection: text(form, 'collection', 100) || 'Berserk',
    collectionId: text(form, 'collectionId', 120) || 'berserk',
    sortOrder: optionalNumber(form, 'sortOrder') ?? 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export async function collectionFromForm(form: FormData, existing?: Collection): Promise<Collection> {
  const name = text(form, 'name', 120);
  const slug = slugify(text(form, 'slug', 120) || name);
  const animeId = slugify(text(form, 'animeId', 120) || slug);
  const japaneseName = text(form, 'japaneseName', 120);
  const description = text(form, 'description', 3000);
  if (!name || !slug || !animeId || !japaneseName || !description) {
    throw new Error('Name, slug, anime ID, Japanese name, and description are required.');
  }

  const heroFile = form.get('heroImage');
  const logoFile = form.get('logoImage');
  let heroImage = safeImageUrl(text(form, 'existingHeroImage', 2000)) || existing?.heroImage || '';
  let logoImage = safeImageUrl(text(form, 'existingLogoImage', 2000)) || existing?.logoImage;
  if (heroFile instanceof File && heroFile.size) heroImage = await uploadCatalogImage(heroFile, 'collections');
  if (logoFile instanceof File && logoFile.size) logoImage = await uploadCatalogImage(logoFile, 'collections');
  if (!heroImage) throw new Error('Add a collection cover image.');

  const now = new Date().toISOString();
  const status = text(form, 'status', 20);
  return {
    id: existing?.id || `collection-${crypto.randomUUID()}`,
    slug,
    animeId,
    name,
    japaneseName,
    description,
    tagline: text(form, 'tagline', 300) || undefined,
    heroImage,
    logoImage,
    status: status === 'draft' || status === 'upcoming' ? status : 'active',
    sortOrder: optionalNumber(form, 'sortOrder') ?? existing?.sortOrder ?? 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

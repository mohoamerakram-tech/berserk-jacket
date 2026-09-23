import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PRODUCTS } from '@/lib/products';
import { LOGOS } from '@/lib/studio/logos';
import { DEFAULT_COLLECTIONS } from '@/lib/collections';
import type { Collection, Product } from '@/lib/types';
import type { Logo } from '@/lib/studio/types';
import type { CatalogState } from './types';

const LOCAL_STATE_PATH = path.join(process.cwd(), 'data', 'admin-catalog.json');
const LOCAL_UPLOAD_PATH = path.join(process.cwd(), 'public', 'uploads', 'catalog');
const SUPABASE_ROW_ID = 'main';

function defaultState(): CatalogState {
  return {
    collections: structuredClone(DEFAULT_COLLECTIONS),
    products: structuredClone(PRODUCTS),
    logos: structuredClone(LOGOS),
    updatedAt: new Date(0).toISOString(),
  };
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function supabaseHeaders(key: string): HeadersInit {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

function normalizeState(value: unknown): CatalogState | null {
  if (!value || typeof value !== 'object') return null;
  const state = value as Partial<CatalogState>;
  if (!Array.isArray(state.products) || !Array.isArray(state.logos)) return null;
  const storedCollections = Array.isArray(state.collections) ? state.collections as Collection[] : null;
  const storedByAnimeId = new Map((storedCollections ?? []).map((collection) => [collection.animeId, collection]));
  const builtInCollections = DEFAULT_COLLECTIONS.map((seed) => ({
    ...structuredClone(seed),
    ...storedByAnimeId.get(seed.animeId),
  }));
  const customCollections = (storedCollections ?? []).filter(
    (collection) => !DEFAULT_COLLECTIONS.some((seed) => seed.animeId === collection.animeId),
  );
  const collections = [...builtInCollections, ...customCollections];
  return {
    collections,
    products: (state.products as Product[]).map((product) => ({
      ...product,
      collectionId: product.collectionId || 'berserk',
      salesCount: product.salesCount ?? PRODUCTS.find((seed) => seed.id === product.id)?.salesCount ?? 0,
    })),
    logos: (state.logos as Logo[]).map((logo) => ({ ...logo, collectionId: logo.collectionId || 'berserk' })),
    updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : new Date().toISOString(),
  };
}

export async function getCatalogState(): Promise<CatalogState> {
  const supabase = supabaseConfig();
  if (supabase) {
    const response = await fetch(
      `${supabase.url}/rest/v1/catalog_state?id=eq.${SUPABASE_ROW_ID}&select=collections,products,logos,updated_at`,
      { headers: supabaseHeaders(supabase.key), cache: 'no-store' }
    );
    if (!response.ok) throw new Error(`Catalog database read failed (${response.status})`);
    const rows = (await response.json()) as Array<{ collections?: Collection[]; products: Product[]; logos: Logo[]; updated_at: string }>;
    if (rows[0]) {
      return normalizeState({ collections: rows[0].collections, products: rows[0].products, logos: rows[0].logos, updatedAt: rows[0].updated_at }) ?? defaultState();
    }
    return defaultState();
  }

  try {
    const state = normalizeState(JSON.parse(await fs.readFile(LOCAL_STATE_PATH, 'utf8')));
    return state ?? defaultState();
  } catch (failure) {
    if ((failure as NodeJS.ErrnoException).code === 'ENOENT') return defaultState();
    throw failure;
  }
}

export async function saveCatalogState(state: CatalogState): Promise<void> {
  const nextState = { ...state, updatedAt: new Date().toISOString() };
  const supabase = supabaseConfig();
  if (supabase) {
    const response = await fetch(`${supabase.url}/rest/v1/catalog_state?on_conflict=id`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders(supabase.key),
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        id: SUPABASE_ROW_ID,
        collections: nextState.collections,
        products: nextState.products,
        logos: nextState.logos,
        updated_at: nextState.updatedAt,
      }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Catalog database write failed (${response.status})`);
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Production catalog storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  await fs.mkdir(path.dirname(LOCAL_STATE_PATH), { recursive: true });
  await fs.writeFile(LOCAL_STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');
}

export async function getPublicProducts(): Promise<Product[]> {
  const state = await getCatalogState();
  const activeCollectionIds = new Set(state.collections.filter((collection) => collection.status === 'active').map((collection) => collection.id));
  return state.products.filter((product) => product.status !== 'draft' && activeCollectionIds.has(product.collectionId || 'berserk'));
}

export async function getPublicCollections(): Promise<Collection[]> {
  const state = await getCatalogState();
  return state.collections
    .filter((collection) => collection.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getVisibleCollections(): Promise<Collection[]> {
  const state = await getCatalogState();
  return state.collections
    .filter((collection) => collection.status !== 'draft')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  return (await getPublicCollections()).find((collection) => collection.slug === slug);
}

export async function getPublicLogos(): Promise<Logo[]> {
  const state = await getCatalogState();
  const activeCollectionIds = new Set(state.collections.filter((collection) => collection.status === 'active').map((collection) => collection.id));
  return state.logos
    .filter((logo) => logo.active !== false && activeCollectionIds.has(logo.collectionId || 'berserk'))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getProductBySlugFromCatalog(slug: string): Promise<Product | undefined> {
  return (await getPublicProducts()).find((product) => product.slug === slug);
}

function fileSignatureIsValid(bytes: Uint8Array, mime: string): boolean {
  const png = bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
  return (mime === 'image/png' && png) || (mime === 'image/jpeg' && jpg) || (mime === 'image/webp' && webp);
}

export async function uploadCatalogImage(file: File, kind: 'products' | 'logos' | 'collections'): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Only PNG, JPG, and WebP images are supported.');
  }
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('Images must be smaller than 10 MB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!fileSignatureIsValid(bytes.slice(0, 16), file.type)) throw new Error('The uploaded image signature is invalid.');
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const objectName = `${kind}/${crypto.randomUUID()}.${extension}`;
  const supabase = supabaseConfig();
  if (supabase) {
    const response = await fetch(`${supabase.url}/storage/v1/object/catalog-media/${objectName}`, {
      method: 'POST',
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'x-upsert': 'false',
      },
      body: bytes,
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Image storage failed (${response.status})`);
    return `${supabase.url}/storage/v1/object/public/catalog-media/${objectName}`;
  }

  if (process.env.NODE_ENV === 'production') throw new Error('Production media storage is not configured.');
  const relativeName = `${kind}-${crypto.randomUUID()}.${extension}`;
  await fs.mkdir(LOCAL_UPLOAD_PATH, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOAD_PATH, relativeName), bytes);
  return `/uploads/catalog/${relativeName}`;
}

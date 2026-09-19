export interface BespokeCheckoutDraft {
  jacketId: string;
  artworks: Record<'front' | 'back', { name: string; url?: string; aspect?: number } | null>;
  placements: Record<'front' | 'back', { x: number; y: number; size: number; rotation: number }>;
}

async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('stitch-checkout', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('drafts');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBespokeCheckout(draft: BespokeCheckoutDraft): Promise<void> {
  const durable = structuredClone(draft);
  for (const side of ['front', 'back'] as const) {
    const art = durable.artworks[side];
    if (!art?.url) continue;
    const response = await fetch(art.url);
    if (!response.ok) throw new Error('Unable to read artwork');
    const blob = await response.blob();
    art.url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
  // Each tab has its own key. IndexedDB accommodates images larger than sessionStorage's quota.
  const key = sessionStorage.getItem('stitch:bespoke-checkout-key') ?? crypto.randomUUID();
  sessionStorage.setItem('stitch:bespoke-checkout-key', key);
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('drafts', 'readwrite');
      const store = tx.objectStore('drafts');
      const cursor = store.openCursor();
      cursor.onsuccess = () => {
        const entry = cursor.result;
        if (!entry) return;
        if (entry.value.expiresAt < Date.now()) entry.delete();
        entry.continue();
      };
      store.put({ draft: durable, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}

export async function readBespokeCheckout(): Promise<BespokeCheckoutDraft | null> {
  const key = sessionStorage.getItem('stitch:bespoke-checkout-key');
  if (!key) return null;
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('drafts').objectStore('drafts').get(key);
      request.onsuccess = () => resolve(request.result?.expiresAt > Date.now() ? request.result.draft : null);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

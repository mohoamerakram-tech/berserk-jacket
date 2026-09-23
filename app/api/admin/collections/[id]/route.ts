import { revalidatePath } from 'next/cache';
import { assertSameOrigin, requireAdminApi } from '@/lib/admin/auth';
import { collectionFromForm } from '@/lib/admin/catalog-input';
import { getCatalogState, saveCatalogState } from '@/lib/catalog/server';
import { isBuiltInCollectionAnimeId } from '@/lib/collections';

interface RouteContext { params: Promise<{ id: string }> }

export const runtime = 'nodejs';

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const { id } = await params;
  try {
    const catalog = await getCatalogState();
    const index = catalog.collections.findIndex((item) => item.id === id);
    if (index < 0) return Response.json({ error: 'Collection not found.' }, { status: 404 });
    const previous = catalog.collections[index];
    const collection = await collectionFromForm(await request.formData(), previous);
    if (catalog.collections.some((item, itemIndex) => itemIndex !== index && (item.slug === collection.slug || item.animeId === collection.animeId))) {
      return Response.json({ error: 'A collection already uses this URL slug or anime identity.' }, { status: 409 });
    }
    catalog.collections[index] = collection;
    await saveCatalogState(catalog);
    revalidatePath('/');
    revalidatePath('/collection');
    revalidatePath(`/collection/${previous.slug}`);
    revalidatePath(`/collection/${collection.slug}`);
    revalidatePath('/custom-studio');
    revalidatePath('/shop');
    return Response.json({ ok: true, id: collection.id, slug: collection.slug });
  } catch (failure) {
    console.error('[admin/collections/id]', failure);
    return Response.json({ error: failure instanceof Error ? failure.message : 'Collection could not be saved.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const { id } = await params;
  const catalog = await getCatalogState();
  const collection = catalog.collections.find((item) => item.id === id);
  if (!collection) return Response.json({ error: 'Collection not found.' }, { status: 404 });
  if (isBuiltInCollectionAnimeId(collection.animeId)) {
    return Response.json({ error: 'Anime-bar collections are built in. Set this collection to draft if you want to hide it.' }, { status: 409 });
  }
  const productCount = catalog.products.filter((product) => (product.collectionId || 'berserk') === id).length;
  const logoCount = catalog.logos.filter((logo) => (logo.collectionId || 'berserk') === id).length;
  if (productCount || logoCount) {
    return Response.json({ error: `Move or remove the ${productCount} products and ${logoCount} logos in this collection first.` }, { status: 409 });
  }
  catalog.collections = catalog.collections.filter((item) => item.id !== id);
  await saveCatalogState(catalog);
  revalidatePath('/');
  revalidatePath('/collection');
  revalidatePath(`/collection/${collection.slug}`);
  return Response.json({ ok: true });
}

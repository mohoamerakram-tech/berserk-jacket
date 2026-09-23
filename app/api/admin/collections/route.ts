import { revalidatePath } from 'next/cache';
import { assertSameOrigin, requireAdminApi } from '@/lib/admin/auth';
import { collectionFromForm } from '@/lib/admin/catalog-input';
import { getCatalogState, saveCatalogState } from '@/lib/catalog/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  try {
    const collection = await collectionFromForm(await request.formData());
    const catalog = await getCatalogState();
    if (catalog.collections.some((item) => item.slug === collection.slug || item.animeId === collection.animeId)) {
      return Response.json({ error: 'A collection already uses this URL slug or anime identity.' }, { status: 409 });
    }
    catalog.collections.push(collection);
    await saveCatalogState(catalog);
    revalidatePath('/');
    revalidatePath('/collection');
    revalidatePath(`/collection/${collection.slug}`);
    return Response.json({ ok: true, id: collection.id, slug: collection.slug }, { status: 201 });
  } catch (failure) {
    console.error('[admin/collections]', failure);
    return Response.json({ error: failure instanceof Error ? failure.message : 'Collection could not be saved.' }, { status: 400 });
  }
}

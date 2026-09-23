import { revalidatePath } from 'next/cache';
import { assertSameOrigin, requireAdminApi } from '@/lib/admin/auth';
import { logoFromForm } from '@/lib/admin/catalog-input';
import { getCatalogState, saveCatalogState } from '@/lib/catalog/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  try {
    const logo = await logoFromForm(await request.formData());
    const catalog = await getCatalogState();
    if (!catalog.collections.some((collection) => collection.id === logo.collectionId)) {
      return Response.json({ error: 'Choose a valid collection.' }, { status: 400 });
    }
    if (catalog.logos.some((item) => item.id === logo.id)) {
      return Response.json({ error: 'A logo already uses this ID.' }, { status: 409 });
    }
    catalog.logos.push(logo);
    await saveCatalogState(catalog);
    revalidatePath('/custom-studio');
    return Response.json({ ok: true, id: logo.id }, { status: 201 });
  } catch (failure) {
    console.error('[admin/logos]', failure);
    return Response.json({ error: failure instanceof Error ? failure.message : 'Logo could not be saved.' }, { status: 400 });
  }
}

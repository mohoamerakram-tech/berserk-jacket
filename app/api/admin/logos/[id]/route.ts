import { revalidatePath } from 'next/cache';
import { assertSameOrigin, requireAdminApi } from '@/lib/admin/auth';
import { getCatalogState, saveCatalogState } from '@/lib/catalog/server';
import { logoFromForm } from '@/lib/admin/catalog-input';

interface RouteContext { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const { id } = await params;
  try {
    const catalog = await getCatalogState();
    const index = catalog.logos.findIndex((logo) => logo.id === id);
    if (index < 0) return Response.json({ error: 'Logo not found.' }, { status: 404 });
    const logo = await logoFromForm(await request.formData(), catalog.logos[index]);
    if (!catalog.collections.some((collection) => collection.id === logo.collectionId)) return Response.json({ error: 'Choose a valid collection.' }, { status: 400 });
    catalog.logos[index] = logo;
    await saveCatalogState(catalog);
    revalidatePath('/custom-studio');
    revalidatePath('/collection');
    return Response.json({ ok: true, id: logo.id });
  } catch (failure) {
    console.error('[admin/logos/id]', failure);
    return Response.json({ error: failure instanceof Error ? failure.message : 'Logo could not be saved.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const { id } = await params;
  const catalog = await getCatalogState();
  if (!catalog.logos.some((logo) => logo.id === id)) return Response.json({ error: 'Logo not found.' }, { status: 404 });
  catalog.logos = catalog.logos.filter((logo) => logo.id !== id);
  await saveCatalogState(catalog);
  revalidatePath('/custom-studio');
  return Response.json({ ok: true });
}

import { revalidatePath } from 'next/cache';
import { assertSameOrigin, requireAdminApi } from '@/lib/admin/auth';
import { productFromForm } from '@/lib/admin/catalog-input';
import { getCatalogState, saveCatalogState } from '@/lib/catalog/server';

interface RouteContext { params: Promise<{ id: string }> }

export const runtime = 'nodejs';

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const { id } = await params;
  try {
    const catalog = await getCatalogState();
    const index = catalog.products.findIndex((product) => product.id === id);
    if (index < 0) return Response.json({ error: 'Product not found.' }, { status: 404 });
    const previous = catalog.products[index];
    const product = await productFromForm(await request.formData(), previous);
    if (!catalog.collections.some((collection) => collection.id === product.collectionId)) {
      return Response.json({ error: 'Choose a valid collection.' }, { status: 400 });
    }
    if (catalog.products.some((item, itemIndex) => itemIndex !== index && item.slug === product.slug)) {
      return Response.json({ error: 'A product already uses this slug.' }, { status: 409 });
    }
    if (product.sku && catalog.products.some((item, itemIndex) => itemIndex !== index && item.sku?.toLowerCase() === product.sku?.toLowerCase())) {
      return Response.json({ error: 'A product already uses this SKU.' }, { status: 409 });
    }
    catalog.products[index] = product;
    await saveCatalogState(catalog);
    revalidatePath('/shop');
    revalidatePath(`/shop/${previous.slug}`);
    revalidatePath(`/shop/${product.slug}`);
    return Response.json({ ok: true, id: product.id, slug: product.slug });
  } catch (failure) {
    console.error('[admin/products/id]', failure);
    return Response.json({ error: failure instanceof Error ? failure.message : 'Product could not be saved.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const { id } = await params;
  const catalog = await getCatalogState();
  const product = catalog.products.find((item) => item.id === id);
  if (!product) return Response.json({ error: 'Product not found.' }, { status: 404 });
  catalog.products = catalog.products.filter((item) => item.id !== id);
  await saveCatalogState(catalog);
  revalidatePath('/shop');
  revalidatePath(`/shop/${product.slug}`);
  return Response.json({ ok: true });
}

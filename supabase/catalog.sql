-- Run once in the Supabase SQL editor before enabling the production admin.
-- The table is private: only the server-side service-role key can read/write it.

create table if not exists public.catalog_state (
  id text primary key,
  collections jsonb not null default '[]'::jsonb,
  products jsonb not null default '[]'::jsonb,
  logos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Safe migration for projects created with the earlier products/logos schema.
alter table public.catalog_state
  add column if not exists collections jsonb not null default '[]'::jsonb;

alter table public.catalog_state enable row level security;

-- Public files can be viewed in the storefront, but browser users receive no
-- insert/update/delete policy. Uploads are performed only by the protected server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-media',
  'catalog-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

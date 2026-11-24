-- ============================================================
-- Repwise — esquema base de Supabase
-- Ejecutar en Supabase → SQL Editor.
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  name text not null,
  exercises jsonb not null default '[]',
  created_at timestamptz default now()
);

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  distance_m numeric not null,
  duration_s int not null,
  path jsonb not null default '[]',
  created_at timestamptz default now()
);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  path text not null,
  created_at timestamptz default now()
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  name text not null,
  reps int not null,
  duration_s int not null,
  avg_tempo_s numeric,
  feedback text,
  created_at timestamptz default now()
);

-- ============================================================
-- PERMISOS (GRANT) para el rol authenticated
-- ============================================================

grant usage on schema public to authenticated;

grant select, insert, update, delete
  on table public.routines,
           public.runs,
           public.progress_photos,
           public.workout_sessions
  to authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

-- ============================================================
-- RLS: cada usuario solo ve y modifica lo suyo
-- ============================================================

alter table public.routines enable row level security;
alter table public.runs enable row level security;
alter table public.progress_photos enable row level security;
alter table public.workout_sessions enable row level security;

drop policy if exists "own rows" on public.routines;
create policy "own rows" on public.routines
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.runs;
create policy "own rows" on public.runs
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.progress_photos;
create policy "own rows" on public.progress_photos
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.workout_sessions;
create policy "own rows" on public.workout_sessions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- REALTIME: la lista de rutinas se actualiza sola
-- ============================================================

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'routines'
  ) then
    alter publication supabase_realtime add table public.routines;
  end if;
end $$;

-- ============================================================
-- STORAGE: bucket público para fotos de progreso
-- ============================================================

insert into storage.buckets (id, name, public)
values ('progress', 'progress', true)
on conflict (id) do nothing;

drop policy if exists "upload own folder" on storage.objects;
create policy "upload own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'progress'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

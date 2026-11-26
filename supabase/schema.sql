-- ============================================================
-- MODABIR — private per-user database schema
-- Run this once in Supabase → SQL Editor → New query → Run
-- Every policy below guarantees a user can ONLY touch their own row.
-- ============================================================

create table if not exists public.modabir_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.modabir_profiles enable row level security;
alter table public.modabir_profiles force row level security;

-- Remove any broad grants, then grant only signed-in users.
revoke all on table public.modabir_profiles from anon;
grant select, insert, update, delete on table public.modabir_profiles to authenticated;

drop policy if exists "modabir_select_own" on public.modabir_profiles;
drop policy if exists "modabir_insert_own" on public.modabir_profiles;
drop policy if exists "modabir_update_own" on public.modabir_profiles;
drop policy if exists "modabir_delete_own" on public.modabir_profiles;

create policy "modabir_select_own" on public.modabir_profiles
  for select to authenticated using (auth.uid() = user_id);

create policy "modabir_insert_own" on public.modabir_profiles
  for insert to authenticated with check (auth.uid() = user_id);

create policy "modabir_update_own" on public.modabir_profiles
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "modabir_delete_own" on public.modabir_profiles
  for delete to authenticated using (auth.uid() = user_id);

-- Keep updated_at fresh automatically.
create or replace function public.modabir_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists modabir_touch on public.modabir_profiles;
create trigger modabir_touch before update on public.modabir_profiles
for each row execute function public.modabir_touch_updated_at();

-- Allow email magic-link sign-in (already enabled by default in Supabase).
-- Recommended dashboard setting: Authentication → Providers → Email → ON.

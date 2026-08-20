-- ============================================================
-- Find-Crops: Supabase setup  (run once in the SQL editor)
-- ============================================================

-- 1.  Create the favorites table
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  item_id     text not null,          -- stable key: lower-case crop name slug
  item_name   text not null,          -- display name shown on card
  item_type   text,                   -- "flower" | "vegetable" | "herb" | "bulb" | "other"
  vendor      text,                   -- from buy-now link domain, nullable
  payload     jsonb,                  -- snapshot of card data (Basics, Sowing, etc.)
  created_at  timestamptz not null default now(),

  constraint favorites_unique_user_item unique (user_id, item_id)
);

-- 2.  Enable Row Level Security
alter table public.favorites enable row level security;

-- 3.  RLS policies — users may only touch their own rows
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- 4.  Index for fast per-user lookups
create index if not exists favorites_user_id_idx on public.favorites (user_id);

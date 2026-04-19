create extension if not exists "pgcrypto";

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_type text not null check (media_type in ('movie', 'tv')),
  tmdb_id bigint not null,
  title text not null,
  poster_path text,
  backdrop_path text,
  status text not null default 'planned' check (status in ('planned', 'watching', 'watched')),
  total_seasons integer not null default 0,
  total_episodes integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, media_type, tmdb_id)
);

create table if not exists public.watched_episodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  show_tmdb_id bigint not null,
  show_title text not null,
  season_number integer not null,
  episode_number integer not null,
  episode_name text not null,
  still_path text,
  watched_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, show_tmdb_id, season_number, episode_number)
);

alter table public.watchlist_items enable row level security;
alter table public.watched_episodes enable row level security;

create policy "watchlist_items_select_own"
on public.watchlist_items
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

create policy "watchlist_items_insert_own"
on public.watchlist_items
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "watchlist_items_update_own"
on public.watchlist_items
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "watchlist_items_delete_own"
on public.watchlist_items
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

create policy "watched_episodes_select_own"
on public.watched_episodes
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

create policy "watched_episodes_insert_own"
on public.watched_episodes
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "watched_episodes_update_own"
on public.watched_episodes
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "watched_episodes_delete_own"
on public.watched_episodes
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

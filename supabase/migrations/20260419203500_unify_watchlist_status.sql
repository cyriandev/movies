alter table public.watchlist_items
add column if not exists status text;

alter table public.watchlist_items
add column if not exists total_seasons integer not null default 0;

alter table public.watchlist_items
add column if not exists total_episodes integer not null default 0;

update public.watchlist_items
set status = 'planned'
where status is null;

alter table public.watchlist_items
alter column status set default 'planned';

alter table public.watchlist_items
alter column status set not null;

alter table public.watchlist_items
drop constraint if exists watchlist_items_status_check;

alter table public.watchlist_items
add constraint watchlist_items_status_check
check (status in ('planned', 'watching', 'watched'));

do $$
begin
  if exists (
    select 1
    from pg_tables
    where schemaname = 'public' and tablename = 'watched_movies'
  ) then
    insert into public.watchlist_items (
      user_id,
      media_type,
      tmdb_id,
      title,
      poster_path,
      backdrop_path,
      status,
      total_seasons,
      total_episodes,
      created_at,
      updated_at
    )
    select
      wm.user_id,
      'movie',
      wm.tmdb_id,
      wm.title,
      wm.poster_path,
      wm.backdrop_path,
      'watched',
      0,
      0,
      coalesce(wm.watched_at, timezone('utc', now())),
      timezone('utc', now())
    from public.watched_movies wm
    on conflict (user_id, media_type, tmdb_id)
    do update set
      title = excluded.title,
      poster_path = excluded.poster_path,
      backdrop_path = excluded.backdrop_path,
      status = 'watched',
      updated_at = timezone('utc', now());
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from pg_tables
    where schemaname = 'public' and tablename = 'watched_shows'
  ) then
    insert into public.watchlist_items (
      user_id,
      media_type,
      tmdb_id,
      title,
      poster_path,
      backdrop_path,
      status,
      total_seasons,
      total_episodes,
      created_at,
      updated_at
    )
    select
      ws.user_id,
      'tv',
      ws.tmdb_id,
      ws.title,
      ws.poster_path,
      ws.backdrop_path,
      case
        when ws.completed then 'watched'
        when coalesce(ws.watched_episodes, 0) > 0 then 'watching'
        else 'planned'
      end,
      coalesce(ws.total_seasons, 0),
      coalesce(ws.total_episodes, 0),
      coalesce(ws.created_at, timezone('utc', now())),
      timezone('utc', now())
    from public.watched_shows ws
    on conflict (user_id, media_type, tmdb_id)
    do update set
      title = excluded.title,
      poster_path = excluded.poster_path,
      backdrop_path = excluded.backdrop_path,
      status = excluded.status,
      total_seasons = greatest(public.watchlist_items.total_seasons, excluded.total_seasons),
      total_episodes = greatest(public.watchlist_items.total_episodes, excluded.total_episodes),
      updated_at = timezone('utc', now());
  end if;
end $$;

insert into public.watchlist_items (
  user_id,
  media_type,
  tmdb_id,
  title,
  status,
  total_seasons,
  total_episodes,
  created_at,
  updated_at
)
select
  we.user_id,
  'tv',
  we.show_tmdb_id,
  max(we.show_title),
  'watching',
  0,
  0,
  min(coalesce(we.watched_at, timezone('utc', now()))),
  timezone('utc', now())
from public.watched_episodes we
left join public.watchlist_items wi
  on wi.user_id = we.user_id
 and wi.media_type = 'tv'
 and wi.tmdb_id = we.show_tmdb_id
where wi.id is null
group by we.user_id, we.show_tmdb_id;

update public.watchlist_items wi
set status = case
  when agg.episode_count > 0 then 'watching'
  else wi.status
end,
updated_at = timezone('utc', now())
from (
  select user_id, show_tmdb_id, count(*) as episode_count
  from public.watched_episodes
  group by user_id, show_tmdb_id
) agg
where wi.user_id = agg.user_id
  and wi.media_type = 'tv'
  and wi.tmdb_id = agg.show_tmdb_id
  and wi.status = 'planned';

drop policy if exists "watched_movies_select_own" on public.watched_movies;
drop policy if exists "watched_movies_insert_own" on public.watched_movies;
drop policy if exists "watched_movies_update_own" on public.watched_movies;
drop policy if exists "watched_movies_delete_own" on public.watched_movies;

drop policy if exists "watched_shows_select_own" on public.watched_shows;
drop policy if exists "watched_shows_insert_own" on public.watched_shows;
drop policy if exists "watched_shows_update_own" on public.watched_shows;
drop policy if exists "watched_shows_delete_own" on public.watched_shows;

drop table if exists public.watched_movies;
drop table if exists public.watched_shows;

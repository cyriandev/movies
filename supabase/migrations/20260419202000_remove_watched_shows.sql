drop policy if exists "watched_shows_select_own" on public.watched_shows;
drop policy if exists "watched_shows_insert_own" on public.watched_shows;
drop policy if exists "watched_shows_update_own" on public.watched_shows;
drop policy if exists "watched_shows_delete_own" on public.watched_shows;

drop table if exists public.watched_shows;

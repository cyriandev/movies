import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { buildWatchlistPayload, buildWatchedEpisodePayload } from '../../lib/media';

const defaultLibraryContext = {
  libraryLoading: false,
  libraryError: '',
  watchlistItems: [],
  episodeEntriesByShow: {},
  isSupabaseConfigured: false,
  isActionPending: () => false,
  isInWatchlist: () => false,
  getItemStatus: () => 'planned',
  isMovieWatched: () => false,
  getShowProgress: () => ({
    status: 'planned',
    watched_episodes: 0,
    total_episodes: 0,
    completed: false,
  }),
  isEpisodeWatched: () => false,
  loadShowEpisodes: async () => [],
  toggleWatchlist: async () => ({ error: new Error('Library provider is unavailable.') }),
  setMovieWatched: async () => ({ error: new Error('Library provider is unavailable.') }),
  removeWatchedShow: async () => ({ error: new Error('Library provider is unavailable.') }),
  markSeasonWatched: async () => ({ error: new Error('Library provider is unavailable.') }),
  toggleEpisodeWatched: async () => ({ error: new Error('Library provider is unavailable.') }),
};

const LibraryContext = createContext(defaultLibraryContext);

const sortEpisodes = (entries = []) =>
  [...entries].sort((a, b) => {
    if (a.season_number !== b.season_number) {
      return a.season_number - b.season_number;
    }

    return a.episode_number - b.episode_number;
  });

const upsertRow = (rows, nextRow, matcher) => {
  const found = rows.some((row) => matcher(row, nextRow));
  const filtered = rows.filter((row) => !matcher(row, nextRow));
  return found ? [nextRow, ...filtered] : [nextRow, ...rows];
};

const getDerivedShowStatus = (watchedEpisodes, totalEpisodes) => {
  if (watchedEpisodes <= 0) {
    return 'planned';
  }

  if (totalEpisodes > 0 && watchedEpisodes >= totalEpisodes) {
    return 'watched';
  }

  return 'watching';
};

export const LibraryProvider = ({ children }) => {
  const { user, isSupabaseConfigured } = useAuth();
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState('');
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [episodeEntriesByShow, setEpisodeEntriesByShow] = useState({});
  const [pendingKeys, setPendingKeys] = useState({});
  const episodeEntriesByShowRef = useRef(episodeEntriesByShow);
  const watchlistItemsRef = useRef(watchlistItems);

  useEffect(() => {
    episodeEntriesByShowRef.current = episodeEntriesByShow;
  }, [episodeEntriesByShow]);

  useEffect(() => {
    watchlistItemsRef.current = watchlistItems;
  }, [watchlistItems]);

  const setPending = (key, value) => {
    setPendingKeys((prev) => ({ ...prev, [key]: value }));
  };

  const clearState = useCallback(() => {
    setWatchlistItems([]);
    setEpisodeEntriesByShow({});
    setLibraryError('');
    setLibraryLoading(false);
    setPendingKeys({});
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      clearState();
      return undefined;
    }

    let active = true;

    const loadLibrary = async () => {
      setLibraryLoading(true);
      setLibraryError('');

      const [watchlistRes, watchedEpisodesRes] = await Promise.all([
        supabase
          .from('watchlist_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('watched_episodes')
          .select('*')
          .eq('user_id', user.id)
          .order('show_tmdb_id', { ascending: true })
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true }),
      ]);

      if (!active) {
        return;
      }

      const nextError = watchlistRes.error?.message || watchedEpisodesRes.error?.message || '';

      if (nextError) {
        setLibraryError(nextError);
      }

      const nextEpisodeEntriesByShow = (watchedEpisodesRes.data || []).reduce((acc, entry) => {
        const showId = Number(entry.show_tmdb_id);
        acc[showId] = [...(acc[showId] || []), entry];
        return acc;
      }, {});

      setWatchlistItems(watchlistRes.data || []);
      setEpisodeEntriesByShow(nextEpisodeEntriesByShow);
      setLibraryLoading(false);
    };

    loadLibrary();

    return () => {
      active = false;
    };
  }, [clearState, user]);

  const isActionPending = useCallback((key) => Boolean(pendingKeys[key]), [pendingKeys]);

  const getWatchlistItem = useCallback(
    (mediaType, tmdbId) =>
      watchlistItems.find(
        (item) => item.media_type === mediaType && Number(item.tmdb_id) === Number(tmdbId)
      ) || null,
    [watchlistItems]
  );

  const isInWatchlist = useCallback(
    (mediaType, tmdbId) => Boolean(getWatchlistItem(mediaType, tmdbId)),
    [getWatchlistItem]
  );

  const getItemStatus = useCallback(
    (mediaType, tmdbId) => getWatchlistItem(mediaType, tmdbId)?.status || 'planned',
    [getWatchlistItem]
  );

  const isMovieWatched = useCallback(
    (tmdbId) => getItemStatus('movie', tmdbId) === 'watched',
    [getItemStatus]
  );

  const getShowProgress = useCallback(
    (tmdbId, show = null) => {
      const watchlistItem = getWatchlistItem('tv', tmdbId);
      const watchedEpisodes = episodeEntriesByShow[Number(tmdbId)]?.length || 0;
      const totalEpisodes = Number(
        show?.number_of_episodes || show?.total_episodes || watchlistItem?.total_episodes || 0
      );
      const status = watchlistItem?.status || getDerivedShowStatus(watchedEpisodes, totalEpisodes);

      return {
        status,
        watched_episodes: watchedEpisodes,
        total_episodes: totalEpisodes,
        completed: status === 'watched',
      };
    },
    [episodeEntriesByShow, getWatchlistItem]
  );

  const isEpisodeWatched = useCallback(
    (showTmdbId, seasonNumber, episodeNumber) =>
      (episodeEntriesByShow[Number(showTmdbId)] || []).some(
        (entry) =>
          Number(entry.season_number) === Number(seasonNumber) &&
          Number(entry.episode_number) === Number(episodeNumber)
      ),
    [episodeEntriesByShow]
  );

  const loadShowEpisodes = useCallback(
    async (showTmdbId, { force = false } = {}) => {
      const numericShowId = Number(showTmdbId);
      const cachedEntries = episodeEntriesByShowRef.current[numericShowId];

      if (!user || !supabase) {
        return [];
      }

      if (!force && cachedEntries) {
        return cachedEntries;
      }

      const { data, error } = await supabase
        .from('watched_episodes')
        .select('*')
        .eq('user_id', user.id)
        .eq('show_tmdb_id', numericShowId)
        .order('season_number', { ascending: true })
        .order('episode_number', { ascending: true });

      if (error) {
        setLibraryError(error.message);
        return [];
      }

      const nextEntries = data || [];
      setEpisodeEntriesByShow((prev) => ({ ...prev, [numericShowId]: nextEntries }));
      return nextEntries;
    },
    [user]
  );

  const removeWatchedShow = useCallback(
    async (showTmdbId) => {
      if (!user || !supabase) {
        return { error: new Error('Sign in to manage watched shows.') };
      }

      const numericShowId = Number(showTmdbId);
      const key = `show:${numericShowId}`;
      setPending(key, true);

      try {
        const { error: episodesError } = await supabase
          .from('watched_episodes')
          .delete()
          .eq('user_id', user.id)
          .eq('show_tmdb_id', numericShowId);

        if (episodesError) {
          setLibraryError(episodesError.message);
          return { error: episodesError };
        }

        const existingItem = watchlistItemsRef.current.find(
          (item) => item.media_type === 'tv' && Number(item.tmdb_id) === numericShowId
        );

        if (existingItem) {
          const { data, error } = await supabase
            .from('watchlist_items')
            .update({
              status: 'planned',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingItem.id)
            .select('*')
            .single();

          if (error) {
            setLibraryError(error.message);
            return { error };
          }

          setWatchlistItems((prev) => upsertRow(prev, data, (row, nextRow) => row.id === nextRow.id));
        }

        setEpisodeEntriesByShow((prev) => {
          const next = { ...prev };
          delete next[numericShowId];
          return next;
        });

        return { data: null };
      } finally {
        setPending(key, false);
      }
    },
    [user]
  );

  const toggleWatchlist = useCallback(
    async ({ item, mediaType }) => {
      if (!user || !supabase) {
        return { error: new Error('Sign in to use your watchlist.') };
      }

      const existing = watchlistItemsRef.current.find(
        (watchlistItem) =>
          watchlistItem.media_type === mediaType &&
          Number(watchlistItem.tmdb_id) === Number(item.tmdb_id || item.tmdbId || item.id)
      );
      const payload = buildWatchlistPayload({
        item,
        userId: user.id,
        mediaType,
        status: existing?.status || 'planned',
        existingItem: existing,
      });
      const key = `watchlist:${payload.media_type}:${payload.tmdb_id}`;
      setPending(key, true);

      try {
        if (existing) {
          const { error } = await supabase.from('watchlist_items').delete().eq('id', existing.id);

          if (error) {
            setLibraryError(error.message);
            return { error };
          }

          setWatchlistItems((prev) => prev.filter((watchlistItem) => watchlistItem.id !== existing.id));

          if (payload.media_type === 'tv') {
            const { error: episodeError } = await supabase
              .from('watched_episodes')
              .delete()
              .eq('user_id', user.id)
              .eq('show_tmdb_id', payload.tmdb_id);

            if (episodeError) {
              setLibraryError(episodeError.message);
              return { error: episodeError };
            }

            setEpisodeEntriesByShow((prev) => {
              const next = { ...prev };
              delete next[payload.tmdb_id];
              return next;
            });
          }

          return { data: null };
        }

        const { data, error } = await supabase
          .from('watchlist_items')
          .upsert(payload, { onConflict: 'user_id,media_type,tmdb_id' })
          .select('*')
          .single();

        if (error) {
          setLibraryError(error.message);
          return { error };
        }

        setWatchlistItems((prev) =>
          upsertRow(
            prev,
            data,
            (row, nextRow) =>
              row.media_type === nextRow.media_type && Number(row.tmdb_id) === Number(nextRow.tmdb_id)
          )
        );

        return { data };
      } finally {
        setPending(key, false);
      }
    },
    [user]
  );

  const setMovieWatched = useCallback(
    async ({ movie, watched }) => {
      if (!user || !supabase) {
        return { error: new Error('Sign in to track watched movies.') };
      }

      const existingItem = watchlistItemsRef.current.find(
        (item) => item.media_type === 'movie' && Number(item.tmdb_id) === Number(movie.tmdb_id || movie.tmdbId || movie.id)
      );

      const payload = buildWatchlistPayload({
        item: movie,
        userId: user.id,
        mediaType: 'movie',
        status: watched ? 'watched' : 'planned',
        existingItem,
      });
      const key = `movie:${payload.tmdb_id}`;
      setPending(key, true);

      try {
        const { data, error } = await supabase
          .from('watchlist_items')
          .upsert(payload, { onConflict: 'user_id,media_type,tmdb_id' })
          .select('*')
          .single();

        if (error) {
          setLibraryError(error.message);
          return { error };
        }

        setWatchlistItems((prev) =>
          upsertRow(
            prev,
            data,
            (row, nextRow) =>
              row.media_type === nextRow.media_type && Number(row.tmdb_id) === Number(nextRow.tmdb_id)
          )
        );

        return { data };
      } finally {
        setPending(key, false);
      }
    },
    [user]
  );

  const toggleEpisodeWatched = useCallback(
    async ({ show, episode, seasonNumber }) => {
      if (!user || !supabase) {
        return { error: new Error('Sign in to track episodes.') };
      }

      const numericShowId = Number(show.tmdb_id || show.tmdbId || show.id);
      const numericSeason = Number(seasonNumber);
      const numericEpisode = Number(episode.episode_number);
      const key = `episode:${numericShowId}:${numericSeason}:${numericEpisode}`;
      setPending(key, true);

      try {
        const currentEntries =
          episodeEntriesByShowRef.current[numericShowId] || (await loadShowEpisodes(numericShowId));
        const existingEntry = currentEntries.find(
          (entry) =>
            Number(entry.season_number) === numericSeason &&
            Number(entry.episode_number) === numericEpisode
        );

        let nextEntries = currentEntries;

        if (existingEntry) {
          const { error } = await supabase.from('watched_episodes').delete().eq('id', existingEntry.id);

          if (error) {
            setLibraryError(error.message);
            return { error };
          }

          nextEntries = currentEntries.filter((entry) => entry.id !== existingEntry.id);
        } else {
          const payload = buildWatchedEpisodePayload({
            show,
            episode,
            seasonNumber: numericSeason,
            userId: user.id,
          });

          const { data, error } = await supabase
            .from('watched_episodes')
            .upsert(payload, {
              onConflict: 'user_id,show_tmdb_id,season_number,episode_number',
            })
            .select('*')
            .single();

          if (error) {
            setLibraryError(error.message);
            return { error };
          }

          nextEntries = [...currentEntries, data];
        }

        const sortedEntries = sortEpisodes(nextEntries);
        setEpisodeEntriesByShow((prev) => ({ ...prev, [numericShowId]: sortedEntries }));

        const existingItem = watchlistItemsRef.current.find(
          (item) => item.media_type === 'tv' && Number(item.tmdb_id) === numericShowId
        );
        const totalEpisodes = Number(show.number_of_episodes || existingItem?.total_episodes || 0);
        const nextStatus = getDerivedShowStatus(sortedEntries.length, totalEpisodes);
        const watchlistPayload = buildWatchlistPayload({
          item: show,
          userId: user.id,
          mediaType: 'tv',
          status: nextStatus,
          existingItem,
        });

        const { data: watchlistRow, error: watchlistError } = await supabase
          .from('watchlist_items')
          .upsert(watchlistPayload, { onConflict: 'user_id,media_type,tmdb_id' })
          .select('*')
          .single();

        if (watchlistError) {
          setLibraryError(watchlistError.message);
          return { error: watchlistError };
        }

        setWatchlistItems((prev) =>
          upsertRow(
            prev,
            watchlistRow,
            (row, nextRow) =>
              row.media_type === nextRow.media_type && Number(row.tmdb_id) === Number(nextRow.tmdb_id)
          )
        );

        return { data: sortedEntries };
      } finally {
        setPending(key, false);
      }
    },
    [loadShowEpisodes, user]
  );

  const markSeasonWatched = useCallback(
    async ({ show, seasonNumber, episodes }) => {
      if (!user || !supabase) {
        return { error: new Error('Sign in to track episodes.') };
      }

      const numericShowId = Number(show.tmdb_id || show.tmdbId || show.id);
      const numericSeason = Number(seasonNumber);
      const seasonEpisodes = (episodes || []).filter((episode) => Number(episode?.episode_number) > 0);

      if (seasonEpisodes.length === 0) {
        return { data: [] };
      }

      const key = `season:${numericShowId}:${numericSeason}`;
      setPending(key, true);

      try {
        const currentEntries =
          episodeEntriesByShowRef.current[numericShowId] || (await loadShowEpisodes(numericShowId));
        const existingKeys = new Set(
          currentEntries
            .filter((entry) => Number(entry.season_number) === numericSeason)
            .map((entry) => `${Number(entry.season_number)}:${Number(entry.episode_number)}`)
        );

        const payloads = seasonEpisodes
          .filter((episode) => !existingKeys.has(`${numericSeason}:${Number(episode.episode_number)}`))
          .map((episode) =>
            buildWatchedEpisodePayload({
              show,
              episode,
              seasonNumber: numericSeason,
              userId: user.id,
            })
          );

        let insertedEntries = [];

        if (payloads.length > 0) {
          const { data, error } = await supabase
            .from('watched_episodes')
            .upsert(payloads, {
              onConflict: 'user_id,show_tmdb_id,season_number,episode_number',
            })
            .select('*');

          if (error) {
            setLibraryError(error.message);
            return { error };
          }

          insertedEntries = data || [];
        }

        const mergedMap = new Map();
        [...currentEntries, ...insertedEntries].forEach((entry) => {
          mergedMap.set(
            `${Number(entry.season_number)}:${Number(entry.episode_number)}`,
            entry
          );
        });

        const sortedEntries = sortEpisodes(Array.from(mergedMap.values()));
        setEpisodeEntriesByShow((prev) => ({ ...prev, [numericShowId]: sortedEntries }));

        const existingItem = watchlistItemsRef.current.find(
          (item) => item.media_type === 'tv' && Number(item.tmdb_id) === numericShowId
        );
        const totalEpisodes = Number(show.number_of_episodes || existingItem?.total_episodes || 0);
        const nextStatus = getDerivedShowStatus(sortedEntries.length, totalEpisodes);
        const watchlistPayload = buildWatchlistPayload({
          item: show,
          userId: user.id,
          mediaType: 'tv',
          status: nextStatus,
          existingItem,
        });

        const { data: watchlistRow, error: watchlistError } = await supabase
          .from('watchlist_items')
          .upsert(watchlistPayload, { onConflict: 'user_id,media_type,tmdb_id' })
          .select('*')
          .single();

        if (watchlistError) {
          setLibraryError(watchlistError.message);
          return { error: watchlistError };
        }

        setWatchlistItems((prev) =>
          upsertRow(
            prev,
            watchlistRow,
            (row, nextRow) =>
              row.media_type === nextRow.media_type && Number(row.tmdb_id) === Number(nextRow.tmdb_id)
          )
        );

        return { data: sortedEntries };
      } finally {
        setPending(key, false);
      }
    },
    [loadShowEpisodes, user]
  );

  const value = useMemo(
    () => ({
      libraryLoading,
      libraryError,
      watchlistItems,
      episodeEntriesByShow,
      isSupabaseConfigured,
      isActionPending,
      isInWatchlist,
      getItemStatus,
      isMovieWatched,
      getShowProgress,
      isEpisodeWatched,
      loadShowEpisodes,
      toggleWatchlist,
      setMovieWatched,
      removeWatchedShow,
      markSeasonWatched,
      toggleEpisodeWatched,
    }),
    [
      episodeEntriesByShow,
      getItemStatus,
      getShowProgress,
      isActionPending,
      isEpisodeWatched,
      isInWatchlist,
      isMovieWatched,
      isSupabaseConfigured,
      libraryError,
      libraryLoading,
      loadShowEpisodes,
      markSeasonWatched,
      removeWatchedShow,
      toggleEpisodeWatched,
      setMovieWatched,
      toggleWatchlist,
      watchlistItems,
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => useContext(LibraryContext) || defaultLibraryContext;

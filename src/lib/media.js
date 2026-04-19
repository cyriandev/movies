export const createSlug = (value = '') =>
  value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

export const getMediaTitle = (item = {}) => item.title || item.name || item.episode_name || 'Untitled';

export const getPosterPath = (item = {}) => item.poster_path || item.posterPath || null;

export const getBackdropPath = (item = {}) => item.backdrop_path || item.backdropPath || null;

export const getMediaType = (item = {}, fallback) => fallback || item.media_type || item.mediaType || 'movie';

export const getMediaRoute = (mediaType, tmdbId, title) =>
  mediaType === 'movie'
    ? `/movies/${tmdbId}/${createSlug(title)}`
    : `/tv/${tmdbId}/${createSlug(title)}`;

export const buildWatchlistPayload = ({ item, userId, mediaType, status = 'planned', existingItem = null }) => ({
  user_id: userId,
  media_type: getMediaType(item, mediaType),
  tmdb_id: Number(item.tmdb_id || item.tmdbId || item.id),
  title: getMediaTitle(item),
  poster_path: getPosterPath(item),
  backdrop_path: getBackdropPath(item),
  status,
  total_seasons: Number(item.number_of_seasons || item.total_seasons || existingItem?.total_seasons || 0),
  total_episodes: Number(item.number_of_episodes || item.total_episodes || existingItem?.total_episodes || 0),
  created_at: existingItem?.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const buildWatchedEpisodePayload = ({ show, episode, seasonNumber, userId }) => ({
  user_id: userId,
  show_tmdb_id: Number(show.tmdb_id || show.tmdbId || show.id),
  show_title: getMediaTitle(show),
  season_number: Number(seasonNumber),
  episode_number: Number(episode.episode_number),
  episode_name: episode.name || `Episode ${episode.episode_number}`,
  still_path: episode.still_path || null,
  watched_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

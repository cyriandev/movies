import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiArrowRightUpLine,
  RiBookmark3Fill,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiTimeLine,
  RiPlayListAddLine,
  RiSearch2Line,
} from 'react-icons/ri';
import { useLibrary } from '../context/library/LibraryContext';
import { getMediaRoute } from '../lib/media';
import Seo from './Seo';

const WatchlistPage = () => {
  const [query, setQuery] = useState('');
  const {
    getItemStatus,
    getShowProgress,
    isActionPending,
    isMovieWatched,
    libraryError,
    libraryLoading,
    removeWatchedShow,
    setMovieWatched,
    toggleWatchlist,
    watchlistItems,
  } = useLibrary();
  const sortByCompletion = useMemo(
    () => (items) =>
      [...items].sort((left, right) => {
        const leftStatus =
          left.media_type === 'movie'
            ? getItemStatus('movie', left.tmdb_id)
            : getShowProgress(left.tmdb_id, left).status;
        const rightStatus =
          right.media_type === 'movie'
            ? getItemStatus('movie', right.tmdb_id)
            : getShowProgress(right.tmdb_id, right).status;

        const leftRank = leftStatus === 'watched' ? 1 : 0;
        const rightRank = rightStatus === 'watched' ? 1 : 0;

        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }

        return new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime();
      }),
    [getItemStatus, getShowProgress]
  );

  const movies = useMemo(
    () => sortByCompletion(watchlistItems.filter((item) => item.media_type === 'movie')),
    [sortByCompletion, watchlistItems]
  );
  const shows = useMemo(
    () => sortByCompletion(watchlistItems.filter((item) => item.media_type === 'tv')),
    [sortByCompletion, watchlistItems]
  );
  const normalizedQuery = query.trim().toLowerCase();
  const filteredMovies = useMemo(
    () =>
      normalizedQuery
        ? movies.filter((item) => item.title?.toLowerCase().includes(normalizedQuery))
        : movies,
    [movies, normalizedQuery]
  );
  const filteredShows = useMemo(
    () =>
      normalizedQuery
        ? shows.filter((item) => item.title?.toLowerCase().includes(normalizedQuery))
        : shows,
    [normalizedQuery, shows]
  );
  const stats = useMemo(() => {
    return watchlistItems.reduce(
      (acc, item) => {
        const status =
          item.media_type === 'movie'
            ? getItemStatus('movie', item.tmdb_id)
            : getShowProgress(item.tmdb_id, item).status;

        acc.total += 1;

        if (status === 'watched') {
          acc.watched += 1;
        } else if (status === 'watching') {
          acc.watching += 1;
        } else {
          acc.planned += 1;
        }

        return acc;
      },
      { total: 0, planned: 0, watching: 0, watched: 0 }
    );
  }, [getItemStatus, getShowProgress, watchlistItems]);

  const renderSection = (title, items) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">{title}</p>
        <p className="text-sm text-[#9ca1b7]">{items.length}</p>
      </div>

      {items.length === 0 ? (
        <div className="double-shell">
          <div className="double-core px-5 py-8 text-sm text-[#9ca1b7]">
            Nothing saved here yet.
          </div>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <div key={`${item.media_type}-${item.tmdb_id}`} className="double-shell">
              <div className="double-core relative flex h-full flex-col gap-3 px-3.5 py-3.5 sm:flex-row sm:items-start">
                <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-[0.8rem] bg-[#2b2c2d]">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--accent)]">
                      <RiBookmark3Fill size={18} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 pr-12 sm:pr-14">
                  {item.media_type === 'movie' ? (
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">
                      {`Movie · ${getItemStatus('movie', item.tmdb_id)}`}
                    </p>
                  ) : (
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">
                      {(() => {
                        const progress = getShowProgress(item.tmdb_id, item);
                        const watchedEpisodes = Number(progress.watched_episodes || 0);
                        const totalEpisodes = Number(progress.total_episodes || 0);

                        if (progress.status === 'watched') {
                          return totalEpisodes > 0
                            ? `Series · watched · ${watchedEpisodes}/${totalEpisodes}`
                            : 'Series · watched';
                        }

                        if (watchedEpisodes > 0 && totalEpisodes > 0) {
                          return `Series · watching · ${watchedEpisodes}/${totalEpisodes}`;
                        }

                        if (watchedEpisodes > 0) {
                          return `Series · watching · ${watchedEpisodes}`;
                        }

                        return `Series · ${progress.status}`;
                      })()}
                    </p>
                  )}
                  <h2 className="mt-1.5 truncate text-[1.15rem] text-[#f5f6fb]">
                    <Link
                      to={getMediaRoute(item.media_type, item.tmdb_id, item.title)}
                      className="transition-colors duration-300 hover:text-[var(--accent)] focus:outline-none focus-visible:text-[var(--accent)]"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  {item.media_type === 'tv' && (() => {
                    const progress = getShowProgress(item.tmdb_id, item);
                    const watchedEpisodes = Number(progress.watched_episodes || 0);
                    const totalEpisodes = Number(progress.total_episodes || 0);

                    if (watchedEpisodes <= 0) {
                      return (
                        <p className="mt-2 text-[0.82rem] text-[#9ca1b7]">
                          Track episode progress from the series page.
                        </p>
                      );
                    }

                    return (
                      <>
                        <p className="mt-2 text-[0.82rem] text-[#9ca1b7]">
                          {watchedEpisodes}/{totalEpisodes || '?'} episodes watched
                        </p>
                        <div className="progress-track mt-3">
                          <div
                            className="progress-fill"
                            style={{
                              width:
                                totalEpisodes > 0
                                  ? `${Math.min(100, (watchedEpisodes / totalEpisodes) * 100)}%`
                                  : '0%',
                            }}
                          />
                        </div>
                      </>
                    );
                  })()}

                  {item.media_type === 'movie' ? (
                    <button
                      type="button"
                      className={`action-pill mt-3 min-h-[2.15rem] w-fit justify-center self-start px-3 py-2 text-[0.74rem] ${isMovieWatched(item.tmdb_id) ? 'action-pill-active' : ''}`}
                      onClick={() => setMovieWatched({ movie: item, watched: !isMovieWatched(item.tmdb_id) })}
                      disabled={isActionPending(`movie:${item.tmdb_id}`)}
                    >
                      {isActionPending(`movie:${item.tmdb_id}`) ? (
                        <RiLoader4Line className="animate-spin" size={15} />
                      ) : isMovieWatched(item.tmdb_id) ? (
                        <RiCheckboxCircleFill size={15} />
                      ) : (
                        <RiCheckboxCircleLine size={15} />
                      )}
                      {isMovieWatched(item.tmdb_id) ? 'Watched' : 'Mark watched'}
                    </button>
                  ) : Number(getShowProgress(item.tmdb_id, item).watched_episodes || 0) > 0 ? (
                    <button
                      type="button"
                      className="action-pill mt-3 min-h-[2.15rem] w-fit justify-center self-start px-3 py-2 text-[0.74rem]"
                      onClick={() => removeWatchedShow(item.tmdb_id)}
                      disabled={isActionPending(`show:${item.tmdb_id}`)}
                    >
                      {isActionPending(`show:${item.tmdb_id}`) ? (
                        <RiLoader4Line className="animate-spin" size={15} />
                      ) : (
                        <RiTimeLine size={15} />
                      )}
                      Clear watched progress
                    </button>
                  ) : null}
                </div>

                <div className="absolute right-3.5 top-3.5 flex flex-col items-end gap-2">
                  <Link
                    to={getMediaRoute(item.media_type, item.tmdb_id, item.title)}
                    className="action-pill action-pill-icon"
                    aria-label={`Open ${item.title}`}
                    title={`Open ${item.title}`}
                  >
                    <RiArrowRightUpLine size={15} />
                  </Link>

                  <button
                    type="button"
                    className="action-pill action-pill-icon"
                    onClick={() => toggleWatchlist({ item, mediaType: item.media_type })}
                    disabled={isActionPending(`watchlist:${item.media_type}:${item.tmdb_id}`)}
                    aria-label={`Remove ${item.title} from watchlist`}
                    title={`Remove ${item.title} from watchlist`}
                  >
                    {isActionPending(`watchlist:${item.media_type}:${item.tmdb_id}`) ? (
                      <RiLoader4Line className="animate-spin" size={15} />
                    ) : (
                      <RiDeleteBinLine size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <Seo title="Watchlist - moviesntv" description="Save titles, mark movies watched, and track series progress in one place." />

      <div className="double-shell">
        <div className="double-core px-5 py-6 sm:px-6 sm:py-7">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">Library</p>
          <h1 className="headline-gradient mt-3 text-[2.4rem] leading-[0.92] sm:text-[3.2rem]">
            Your watchlist
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9ca1b7]">
            Keep your saved titles in one place, mark movies watched here, and jump into series to track episode progress.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Saved titles', value: stats.total, icon: RiPlayListAddLine },
          { label: 'Planned next', value: stats.planned, icon: RiBookmark3Fill },
          { label: 'In progress', value: stats.watching, icon: RiTimeLine },
          { label: 'Watched', value: stats.watched, icon: RiCheckboxCircleFill, accent: true },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="double-shell">
            <div className="double-core stat-card h-full px-3.5 py-3.5">
              <div className="stat-card-head">
                <span className="stat-card-icon">
                  <Icon size={14} />
                </span>
                <p className="stat-card-label">{label}</p>
              </div>
              <p className={`stat-card-value ${accent ? 'stat-card-value-accent' : ''}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="double-shell">
        <div className="double-core px-5 py-4 sm:px-6">
          <div className="input-shell flex items-center gap-3 px-4 py-3">
            <RiSearch2Line className="text-[var(--text-warm)]" size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your watchlist"
              className="w-full bg-transparent text-sm text-[#f4f7fb] placeholder:text-[var(--muted-warm-soft)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {libraryError && (
        <div className="double-shell">
          <div className="double-core px-5 py-4 text-sm text-[#f5f6fb]">{libraryError}</div>
        </div>
      )}

      {libraryLoading ? (
        <div className="double-shell">
          <div className="double-core flex h-64 items-center justify-center">
            <div className="spinner" />
          </div>
        </div>
      ) : (
        <>
          {renderSection('Movies', filteredMovies)}
          {renderSection('Series', filteredShows)}
        </>
      )}
    </div>
  );
};

export default WatchlistPage;

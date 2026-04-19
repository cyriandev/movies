import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiClapperboardLine,
  RiImageLine,
  RiLoader4Line,
  RiStarSFill,
  RiTv2Line,
} from 'react-icons/ri';
import TvContext from '../context/tv/tvContext';
import { useAuth } from '../context/auth/AuthContext';
import { useLibrary } from '../context/library/LibraryContext';
import Reveal from './Reveal';
import Seo from './Seo';

const SeasonDetail = () => {
  const { id, seasonNumber, title } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tvContext = useContext(TvContext);
  const { getTv, tv, tv_loading, getSeason, season, season_loading } = tvContext;
  const { user } = useAuth();
  const {
    episodeEntriesByShow,
    getShowProgress,
    isActionPending,
    isEpisodeWatched,
    loadShowEpisodes,
    markSeasonWatched,
    toggleEpisodeWatched,
  } = useLibrary();

  useEffect(() => {
    getTv(id);
    getSeason(id, seasonNumber);
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id, seasonNumber]);

  useEffect(() => {
    if (user && tv?.id) {
      loadShowEpisodes(tv.id);
    }
  }, [loadShowEpisodes, tv?.id, user]);

  if (tv_loading || season_loading || !season) {
    return (
      <div className="double-shell w-full">
        <div className="double-core flex h-[28rem] items-center justify-center">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const showSlug = (tv?.name || title || 'series').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const episodes = season.episodes || [];
  const overview = season.overview || 'No overview is available for this season yet.';
  const showId = Number(tv?.id || id);
  const seasonWatchedEpisodes = (episodeEntriesByShow[showId] || []).filter(
    (entry) => Number(entry.season_number) === Number(seasonNumber)
  ).length;
  const showProgress = getShowProgress(showId, tv);
  const showProgressLabel =
    Number(showProgress.total_episodes || 0) > 0
      ? `${showProgress.watched_episodes || 0}/${showProgress.total_episodes} series episodes watched`
      : `${showProgress.watched_episodes || 0} series episodes watched`;
  const seasonActionPending = isActionPending(`season:${showId}:${Number(seasonNumber)}`);
  const allSeasonEpisodesWatched = episodes.length > 0 && seasonWatchedEpisodes >= episodes.length;
  const backToShow = location.search
    ? { pathname: `/tv/${id}/${showSlug}`, search: location.search }
    : `/tv/${id}/${showSlug}`;

  const metadata = [
    {
      label: 'Season',
      value: season.name || `Season ${seasonNumber}`,
      icon: RiTv2Line,
      compact: true,
    },
    {
      label: 'First aired',
      value: season.air_date ? moment(season.air_date).format('DD MMM YYYY') : 'TBA',
      icon: RiCalendarLine,
      compact: true,
    },
    {
      label: 'Episodes',
      value: season.episodes?.length || 0,
      icon: RiClapperboardLine,
    },
    {
      label: 'Rating',
      value: season.vote_average ? season.vote_average.toFixed(1) : 'N/A',
      icon: RiStarSFill,
      accent: true,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <Seo
        title={`${tv?.name || 'Series'} - ${season.name || `Season ${seasonNumber}`} - moviesntv`}
        description={overview}
      />

      <Reveal>
        <div className="double-shell">
          <div className="double-core relative overflow-hidden">
            <div className="absolute inset-0">
              {season.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${season.poster_path}`}
                  alt={season.name}
                  className="h-full w-full object-cover object-center opacity-20"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,5,0.95)_0%,rgba(7,6,5,0.88)_52%,rgba(7,6,5,0.92)_100%)]" />
            </div>

            <div className="relative grid gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[12rem,1fr] lg:px-8 lg:py-8">
              <div className="double-shell max-w-[12rem]">
                <div className="double-core overflow-hidden">
                  {season.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${season.poster_path}`}
                      alt={season.name}
                      className="aspect-[0.9] h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[0.9] items-center justify-center text-[var(--accent)]">
                      <RiImageLine size={30} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to={backToShow}
                      className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-black/78 px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black/82"
                    >
                      <RiArrowLeftLine size={16} />
                      Back to series
                    </Link>

                  </div>

                  <h1 className="headline-gradient mt-4 text-[2.4rem] leading-[0.94] sm:text-[3.6rem]">
                    {season.name || `Season ${seasonNumber}`}
                  </h1>
                  <p className="mt-3 text-sm leading-7 text-[#9ca1b7]">
                    {overview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid gap-2.5 lg:grid-cols-4">
          {metadata.map(({ label, value, icon: Icon, accent, compact }) => (
              <div key={label} className="double-shell">
                <div className="double-core stat-card h-full px-3.5 py-3.5">
                  <div className="stat-card-head">
                    <span className="stat-card-icon">
                      <Icon size={14} />
                    </span>
                    <p className="stat-card-label">{label}</p>
                  </div>
                <p className={`stat-card-value ${accent ? 'stat-card-value-accent' : ''} ${compact ? 'stat-card-value-compact' : ''}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={140}>
        {!user && (
          <div className="double-shell mb-3">
            <div className="double-core flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7c8197]">Episode tracker</p>
                <p className="mt-2 text-sm text-[#f5f6fb]">
                  Sign in to mark episodes as watched and sync your series progress.
                </p>
              </div>
              <button
                type="button"
                className="action-pill action-pill-active"
                onClick={() => navigate(`/login?next=${encodeURIComponent(location.pathname)}`)}
              >
                Track progress
              </button>
            </div>
          </div>
        )}

        <div className="double-shell mb-3">
          <div className="double-core flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7c8197]">Season progress</p>
              <h2 className="mt-2 text-[1.35rem] text-[#f5f6fb]">
                {seasonWatchedEpisodes}/{episodes.length} episodes watched
              </h2>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <div>
                <p className="mb-2 text-[0.76rem] text-[#9ca1b7]">{showProgressLabel}</p>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        episodes.length > 0
                          ? `${Math.min(100, (seasonWatchedEpisodes / episodes.length) * 100)}%`
                          : '0%',
                    }}
                  />
                </div>
              </div>

              {episodes.length > 0 && (
                <button
                  type="button"
                  className={`action-pill min-h-[2.15rem] w-fit justify-center self-start px-3 py-2 text-[0.74rem] ${allSeasonEpisodesWatched ? 'action-pill-active' : ''}`}
                  onClick={() => {
                    if (!user) {
                      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
                      return;
                    }

                    markSeasonWatched({
                      show: tv,
                      seasonNumber,
                      episodes,
                    });
                  }}
                  disabled={seasonActionPending || allSeasonEpisodesWatched}
                >
                  {seasonActionPending ? (
                    <RiLoader4Line className="animate-spin" size={14} />
                  ) : (
                    <RiCheckboxCircleFill size={14} />
                  )}
                  {allSeasonEpisodesWatched ? 'Season watched' : 'Mark all watched'}
                </button>
              )}
            </div>
          </div>
        </div>

        {episodes.length === 0 ? (
          <div className="double-shell">
            <div className="double-core px-6 py-14 text-center">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No episodes</p>
              <p className="mt-3 text-[1.7rem] text-[#f5f6fb]">Episode details are not available for this season.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {episodes.map((episode) => (
              <div key={episode.id} className="double-shell">
                <div className="double-core flex flex-col gap-3 px-3.5 py-3.5 sm:flex-row">
                  <div className="aspect-video w-full overflow-hidden rounded-[0.8rem] bg-[#242526] sm:w-48 sm:flex-shrink-0">
                    {episode.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                        alt={episode.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full min-h-[8.5rem] items-center justify-center text-[var(--accent)]">
                        <RiImageLine size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">
                          Episode {episode.episode_number}
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242526] px-2 py-1 text-[0.72rem] text-[#e7e1d7]">
                          <RiStarSFill className="text-[var(--accent)]" size={12} />
                          {episode.vote_average ? episode.vote_average.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <h3 className="mt-2 text-[1.15rem] leading-[1.08] text-[#f5f6fb]">{episode.name}</h3>
                      <p className="mt-2 text-[0.84rem] leading-6 text-[#9ca1b7]">
                        {episode.air_date ? moment(episode.air_date).format('DD MMM YYYY') : 'Air date TBA'}
                        {episode.vote_count ? ` · ${episode.vote_count} votes` : ''}
                      </p>

                      <p className="mt-3 line-clamp-4 text-[0.84rem] leading-6 text-[#9ca1b7]">
                        {episode.overview || 'No overview is available for this episode yet.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`action-pill w-full justify-center px-3 py-2 text-[0.78rem] sm:ml-4 sm:mt-0 sm:w-auto sm:flex-shrink-0 ${isEpisodeWatched(showId, seasonNumber, episode.episode_number) ? 'action-pill-active' : ''}`}
                      onClick={() => {
                        if (!user) {
                          navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
                          return;
                        }

                        toggleEpisodeWatched({
                          show: tv,
                          episode,
                          seasonNumber,
                        });
                      }}
                      disabled={isActionPending(`episode:${showId}:${Number(seasonNumber)}:${Number(episode.episode_number)}`)}
                    >
                      {isActionPending(`episode:${showId}:${Number(seasonNumber)}:${Number(episode.episode_number)}`) ? (
                        <RiLoader4Line className="animate-spin" size={14} />
                      ) : isEpisodeWatched(showId, seasonNumber, episode.episode_number) ? (
                        <RiCheckboxCircleFill size={14} />
                      ) : (
                        <RiCheckboxCircleLine size={14} />
                      )}
                      {isEpisodeWatched(showId, seasonNumber, episode.episode_number) ? 'Watched' : 'Mark watched'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
};

export default SeasonDetail;

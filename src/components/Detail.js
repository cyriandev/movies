import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {
    RiArrowLeftLine,
    RiBookmark3Fill,
    RiBookmark3Line,
    RiCalendarLine,
    RiCheckboxCircleFill,
    RiCheckboxCircleLine,
    RiClapperboardLine,
    RiFilmLine,
    RiLoader4Line,
    RiStarSFill,
    RiTimeLine,
} from 'react-icons/ri';
import MoviesContext from '../context/movies/moviesContext';
import { useAuth } from '../context/auth/AuthContext';
import { useLibrary } from '../context/library/LibraryContext';
import Cast from './Cast';
import Crew from './Crew';
import Review from './Review';
import Video, { sortVideosByPriority } from './Video';
import Reveal from './Reveal';
import Seo from './Seo';

const TABS = ['Videos', 'Reviews', 'Cast', 'Crew'];

const renderTabCount = (tab, reviews, videos) => {
  if (tab === 'Reviews') {
    return reviews.length;
  }

  if (tab === 'Videos') {
    return videos.length;
  }

  return null;
};

export const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const moviesContext = useContext(MoviesContext);
  const {
    getMovie, movie_loading, movie,
    getCast, cast_loading, credits,
    getReviews, reviews_loading, reviews,
    getVideos, videos_loading, videos,
  } = moviesContext;
  const { user } = useAuth();
  const {
    getItemStatus,
    isActionPending,
    isInWatchlist,
    isMovieWatched,
    setMovieWatched,
    toggleWatchlist,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState('Videos');

  useEffect(() => {
    getMovie(id);
    getCast(id);
    getReviews(id);
    getVideos(id);
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id]);

  if (movie_loading) {
    return (
      <div className="double-shell w-full">
        <div className="double-core flex h-[38rem] items-center justify-center">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const metadata = [
    {
      label: 'Release',
      value: movie.release_date ? moment(movie.release_date).format('DD MMM YYYY') : 'TBA',
      icon: RiCalendarLine,
      compact: true,
    },
    {
      label: 'Runtime',
      value: movie.runtime > 0 ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown',
      icon: RiTimeLine,
    },
    {
      label: 'Rating',
      value: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      icon: RiStarSFill,
      accent: true,
    },
    {
      label: 'Type',
      value: 'Feature film',
      icon: RiClapperboardLine,
      compact: true,
    },
  ];

  const overview = movie.overview || 'No overview available for this title yet.';
  const genres = movie.genres || [];
  const castMembers = credits.cast?.slice(0, 12) || [];
  const crewMembers = credits.crew?.slice(0, 12) || [];
  const sortedVideos = sortVideosByPriority(videos);
  const featuredVideo = sortedVideos[0];
  const remainingVideos = sortedVideos.slice(1);
  const movieId = Number(movie.id || id);
  const inWatchlist = isInWatchlist('movie', movieId);
  const watchedMovie = isMovieWatched(movieId);
  const movieStatus = getItemStatus('movie', movieId);
  const watchlistPending = isActionPending(`watchlist:movie:${movieId}`);
  const watchedPending = isActionPending(`movie:${movieId}`);
  const backToMovies = location.search ? { pathname: '/movies', search: location.search } : '/movies';

  const requireAuth = () => {
    navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
  };

  const handleWatchlistToggle = async () => {
    if (!user) {
      requireAuth();
      return;
    }

    await toggleWatchlist({ item: movie, mediaType: 'movie' });
  };

  const handleWatchedToggle = async () => {
    if (!user) {
      requireAuth();
      return;
    }

    await setMovieWatched({ movie, watched: !watchedMovie });
  };

  return (
    <div className="w-full space-y-6">
      <Seo title={`${movie?.title || 'Movie'} - moviesntv`} description={overview} />

      <Reveal>
        <div className="double-shell">
          <div className="double-core relative overflow-hidden">
            <div className="absolute inset-0">
              {movie.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover object-center opacity-45"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,5,0.95)_0%,rgba(7,6,5,0.82)_38%,rgba(7,6,5,0.48)_72%,rgba(7,6,5,0.9)_100%)]" />
            </div>

            <div className="relative grid gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[15rem,1fr] lg:px-8 lg:py-8">
              <div className="double-shell max-w-[15rem]">
                <div className="double-core overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[0.72] items-center justify-center text-[var(--accent)]">
                      <RiFilmLine size={52} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to={backToMovies}
                      className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-black/78 px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black/82"
                    >
                      <RiArrowLeftLine size={16} />
                      Back to films
                    </Link>

                    <button
                      type="button"
                      onClick={handleWatchlistToggle}
                      className={`action-pill ${inWatchlist ? 'action-pill-active' : ''}`}
                      disabled={watchlistPending}
                    >
                      {watchlistPending ? (
                        <RiLoader4Line className="animate-spin" size={16} />
                      ) : inWatchlist ? (
                        <RiBookmark3Fill size={16} />
                      ) : (
                        <RiBookmark3Line size={16} />
                      )}
                      {inWatchlist ? 'In watchlist' : 'Add to watchlist'}
                    </button>

                    <button
                      type="button"
                      onClick={handleWatchedToggle}
                      className={`action-pill ${watchedMovie ? 'action-pill-active' : ''}`}
                      disabled={watchedPending}
                    >
                      {watchedPending ? (
                        <RiLoader4Line className="animate-spin" size={16} />
                      ) : watchedMovie ? (
                        <RiCheckboxCircleFill size={16} />
                      ) : (
                        <RiCheckboxCircleLine size={16} />
                      )}
                      {movieStatus === 'watched' ? 'Watched' : 'Mark watched'}
                    </button>

                  </div>

                  <h1 className="headline-gradient mt-4 text-[2.7rem] leading-[0.92] sm:text-[4rem]">
                    {movie.title}
                  </h1>

                  {movie.tagline && (
                    <p className="mt-3 text-base italic text-[#c9c1a1]">&ldquo;{movie.tagline}&rdquo;</p>
                  )}

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#9ca1b7]">
                    {overview}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-black/78 px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.18em] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md"
                    >
                      {genre.name}
                    </span>
                  ))}
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
        <div className="double-shell">
          <div className="double-core px-3.5 py-3.5 sm:px-4">
            <div className="flex justify-start">
              <div className="flex flex-wrap items-center gap-1.5 rounded-[0.85rem] bg-[#242526] p-1.5">
                {TABS.map((tab) => {
                  const count = renderTabCount(tab, reviews, videos);

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`tab-pill ${activeTab === tab ? 'tab-pill-active' : ''}`}
                    >
                      {tab}
                      {count !== null ? ` (${count})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div>
        {activeTab === 'Cast' && (
          cast_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {castMembers.map((item) => (
                <Cast key={item.id} cast={item} />
              ))}
            </div>
          )
        )}

        {activeTab === 'Crew' && (
          cast_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {crewMembers.map((item, index) => (
                <Crew key={`${item.credit_id || item.name}-${index}`} crew={item} />
              ))}
            </div>
          )
        )}

        {activeTab === 'Reviews' && (
          reviews_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="double-shell">
              <div className="double-core px-6 py-14 text-center">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No reviews</p>
                <p className="mt-3 text-[1.7rem] text-[#f5f6fb]">No written reviews are available yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((item) => (
                <Review key={item.id} item={item} />
              ))}
            </div>
          )
        )}

        {activeTab === 'Videos' && (
          videos_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="double-shell">
              <div className="double-core px-6 py-14 text-center">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No videos</p>
                <p className="mt-3 text-[1.7rem] text-[#f5f6fb]">No trailers or related video clips are available.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {featuredVideo && <Video key={featuredVideo.id} video={featuredVideo} featured />}
              {remainingVideos.length > 0 && (
                <div className="grid gap-3 lg:grid-cols-2">
                  {remainingVideos.map((item) => (
                    <Video key={item.id} video={item} />
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

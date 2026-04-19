import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { RiArrowRightUpLine, RiFilmLine, RiStarSFill } from 'react-icons/ri';
import { useAuth } from '../context/auth/AuthContext';
import { useLibrary } from '../context/library/LibraryContext';
import MovieStatusMenu from './MovieStatusMenu';

export const Movie = ({ movie }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getItemStatus, isActionPending, isInWatchlist, setMovieWatched, toggleWatchlist } = useLibrary();
  const slug = movie.title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  const inWatchlist = isInWatchlist('movie', movie.id);
  const movieStatus = inWatchlist ? getItemStatus('movie', movie.id) : '';
  const watchlistPending = isActionPending(`watchlist:movie:${movie.id}`);
  const moviePending = isActionPending(`movie:${movie.id}`);
  const statusPending = watchlistPending || moviePending;
  const originalLanguage = movie.original_language ? movie.original_language.toUpperCase() : '';
  const yearLabel = movie.release_date ? moment(movie.release_date).format('YYYY') : 'Coming soon';
  const detailLink =
    location.pathname === '/movies'
      ? { pathname: `/movies/${movie.id}/${slug}`, search: location.search }
      : `/movies/${movie.id}/${slug}`;

  const handleStatusSelect = async (value) => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    if (value === 'remove') {
      await toggleWatchlist({ item: movie, mediaType: 'movie' });
      return;
    }

    await setMovieWatched({ movie, watched: value === 'watched' });
  };

  return (
    <Link to={detailLink} className="group block h-full">
      <div className="double-shell h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1.5">
        <div className="double-core flex h-full flex-col">
          <div className="relative aspect-[0.78] overflow-hidden bg-[#232432]">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                className="h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[var(--accent)]">
                <RiFilmLine size={38} />
              </div>
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,25,36,0.04)_0%,rgba(24,25,36,0.18)_55%,rgba(24,25,36,0.9)_100%)]" />
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/78 px-2.5 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
              Film
            </div>
            <MovieStatusMenu
              title={movie.title}
              inWatchlist={inWatchlist}
              pending={statusPending}
              currentStatus={movieStatus}
              onSelect={handleStatusSelect}
              positionClassName="bottom-3 right-3"
            />
            <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/78 px-2.5 py-1.5 text-[0.7rem] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
              <RiStarSFill className="text-[var(--accent)]" size={13} />
              {movie.vote_average != null ? Number(movie.vote_average).toFixed(1) : 'N/A'}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between px-3.5 py-3.5">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#7c8197]">
                {yearLabel}
                {originalLanguage ? ` · ${originalLanguage}` : ''}
              </p>
              <h3 className="mt-2.5 line-clamp-2 text-[1.2rem] leading-[1.08] text-[#e7e1d7] transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[var(--accent)]">
                {movie.title}
              </h3>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-[#9ca1b7]">
              <span>{movie.release_date ? moment(movie.release_date).format('DD MMM YYYY') : 'Release TBA'}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(36,37,38,0.42)] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:bg-[rgba(36,37,38,0.5)]">
                <RiArrowRightUpLine size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

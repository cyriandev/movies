import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { RiArrowRightUpLine, RiBookmark3Fill, RiBookmark3Line, RiFilmLine, RiLoader4Line, RiStarSFill, RiTv2Line } from 'react-icons/ri';
import { useAuth } from '../context/auth/AuthContext';
import { useLibrary } from '../context/library/LibraryContext';
import MovieStatusMenu from './MovieStatusMenu';

const Result = ({ item }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { getItemStatus, isActionPending, isInWatchlist, setMovieWatched, toggleWatchlist } = useLibrary();
    if ((item.media_type !== 'movie' && item.media_type !== 'tv') || (!item.title && !item.name)) return null;

    const title = item.media_type === 'movie' ? item.title : item.name;
    const date = item.media_type === 'movie' ? item.release_date : item.first_air_date;
    const footerText =
        item.media_type === 'movie'
            ? (date ? moment(date).format('DD MMM YYYY') : 'Release TBA')
            : (date ? moment(date).format('DD MMM YYYY') : 'First aired TBA');
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const to =
        item.media_type === 'movie'
            ? `/movies/${item.id}/${slug}`
            : `/tv/${item.id}/${slug}`;
    const originalLanguage = item.original_language ? item.original_language.toUpperCase() : '';
    const yearLabel = date ? moment(date).format('YYYY') : 'Unknown year';
    const inWatchlist = isInWatchlist(item.media_type, item.id);
    const movieStatus = item.media_type === 'movie' && inWatchlist ? getItemStatus('movie', item.id) : '';
    const watchlistPending = isActionPending(`watchlist:${item.media_type}:${item.id}`);
    const moviePending = item.media_type === 'movie' ? isActionPending(`movie:${item.id}`) : false;
    const statusPending = watchlistPending || moviePending;

    const handleWatchlistToggle = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
            return;
        }

        await toggleWatchlist({ item, mediaType: item.media_type });
    };

    const handleMovieStatusSelect = async (value) => {
        if (!user) {
            navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
            return;
        }

        if (value === 'remove') {
            await toggleWatchlist({ item, mediaType: 'movie' });
            return;
        }

        await setMovieWatched({ movie: item, watched: value === 'watched' });
    };

    return (
        <Link to={to} className="group block">
            <div className="double-shell h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-2">
                <div className="double-core flex h-full flex-col">
                    <div className="relative aspect-[0.78] overflow-hidden bg-[#232432]">
                    {item.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                            alt={title}
                            className="h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--accent)]">
                            {item.media_type === 'tv' ? <RiTv2Line size={38} /> : <RiFilmLine size={38} />}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,25,36,0.04)_0%,rgba(24,25,36,0.18)_55%,rgba(24,25,36,0.9)_100%)]" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/78 px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                        {item.media_type === 'tv' ? 'Series' : 'Film'}
                    </div>
                    {item.media_type === 'movie' ? (
                        <MovieStatusMenu
                            title={title}
                            inWatchlist={inWatchlist}
                            pending={statusPending}
                            currentStatus={movieStatus}
                            onSelect={handleMovieStatusSelect}
                            positionClassName="bottom-4 right-4"
                        />
                    ) : (
                        <div className="absolute bottom-4 right-4">
                            <button
                                type="button"
                                onClick={handleWatchlistToggle}
                                className={`relative inline-grid h-9 w-9 place-items-center overflow-hidden rounded-full leading-none shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${inWatchlist ? 'bg-[linear-gradient(135deg,#ffe28a,var(--accent))] text-[#1b1c27] ring-[rgba(var(--accent-rgb),0.28)] shadow-[0_8px_18px_rgba(var(--accent-rgb),0.24)]' : 'bg-black/78 text-white ring-white/10 hover:bg-black/82'} ${watchlistPending ? 'cursor-wait' : ''}`}
                                aria-label={`${inWatchlist ? 'Remove' : 'Add'} ${title} ${inWatchlist ? 'from' : 'to'} watchlist`}
                                title={`${inWatchlist ? 'Remove from' : 'Add to'} watchlist`}
                                disabled={watchlistPending}
                            >
                                {watchlistPending ? (
                                    <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                                        <RiLoader4Line className="block animate-spin" size={15} />
                                    </span>
                                ) : inWatchlist ? (
                                    <RiBookmark3Fill size={15} />
                                ) : (
                                    <RiBookmark3Line size={15} />
                                )}
                            </button>
                        </div>
                    )}
                    <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/78 px-3 py-2 text-xs font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                        <RiStarSFill className="text-[var(--accent)]" size={13} />
                        {item.vote_average != null ? Number(item.vote_average).toFixed(1) : 'N/A'}
                    </div>
                </div>
                    <div className="flex flex-1 flex-col justify-between px-4 py-4">
                        <div>
                            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#7c8197]">
                                {yearLabel}
                                {originalLanguage ? ` · ${originalLanguage}` : ''}
                            </p>
                            <h3 className="mt-3 line-clamp-2 text-[1.35rem] leading-[1.05] text-[#e7e1d7] transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[var(--accent)]">
                                {title}
                            </h3>
                        </div>
                        <div className="mt-5 flex items-center justify-between text-sm text-[#9ca1b7]">
                            <span>{footerText}</span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(36,37,38,0.42)] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:bg-[rgba(36,37,38,0.5)]">
                                <RiArrowRightUpLine size={16} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Result;

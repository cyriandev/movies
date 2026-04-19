import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { RiArrowRightUpLine, RiBookmark3Fill, RiBookmark3Line, RiLoader4Line, RiStarSFill, RiTv2Line } from 'react-icons/ri';
import { useAuth } from '../context/auth/AuthContext';
import { useLibrary } from '../context/library/LibraryContext';

const TvItem = ({ tv }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { isActionPending, isInWatchlist, toggleWatchlist } = useLibrary();
    const slug = tv.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    const inWatchlist = isInWatchlist('tv', tv.id);
    const watchlistPending = isActionPending(`watchlist:tv:${tv.id}`);
    const originalLanguage = tv.original_language ? tv.original_language.toUpperCase() : '';
    const yearLabel = tv.first_air_date ? moment(tv.first_air_date).format('YYYY') : 'Upcoming';

    const handleWatchlistToggle = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
            return;
        }

        await toggleWatchlist({ item: tv, mediaType: 'tv' });
    };

    return (
        <Link to={`/tv/${tv.id}/${slug}`} className="group block">
            <div className="double-shell h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1.5">
                <div className="double-core flex h-full flex-col">
                    <div className="relative aspect-[0.78] overflow-hidden bg-[#232432]">
                    {tv.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${tv.poster_path}`}
                            alt={tv.name}
                            className="h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--accent)]">
                            <RiTv2Line size={38} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,25,36,0.04)_0%,rgba(24,25,36,0.18)_55%,rgba(24,25,36,0.9)_100%)]" />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/78 px-2.5 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                        Series
                    </div>
                    <div className="absolute bottom-3 right-3">
                        <button
                            type="button"
                            onClick={handleWatchlistToggle}
                            className={`relative inline-grid h-9 w-9 place-items-center overflow-hidden rounded-full leading-none shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${inWatchlist ? 'bg-[linear-gradient(135deg,#ffe28a,var(--accent))] text-[#1b1c27] ring-[rgba(var(--accent-rgb),0.28)] shadow-[0_8px_18px_rgba(var(--accent-rgb),0.24)]' : 'bg-black/78 text-white ring-white/10 hover:bg-black/82'} ${watchlistPending ? 'cursor-wait' : ''}`}
                            aria-label={`${inWatchlist ? 'Remove' : 'Add'} ${tv.name} ${inWatchlist ? 'from' : 'to'} watchlist`}
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
                    <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/78 px-2.5 py-1.5 text-[0.7rem] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                        <RiStarSFill className="text-[var(--accent)]" size={13} />
                        {tv.vote_average != null ? Number(tv.vote_average).toFixed(1) : 'N/A'}
                    </div>
                </div>
                    <div className="flex flex-1 flex-col justify-between px-3.5 py-3.5">
                        <div>
                            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#7c8197]">
                                {yearLabel}
                                {originalLanguage ? ` · ${originalLanguage}` : ''}
                            </p>
                            <h3 className="mt-2.5 line-clamp-2 text-[1.2rem] leading-[1.08] text-[#e7e1d7] transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[var(--accent)]">
                                {tv.name}
                            </h3>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-[#9ca1b7]">
                            <span>{tv.first_air_date ? moment(tv.first_air_date).format('DD MMM YYYY') : 'First aired TBA'}</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(36,37,38,0.42)] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:bg-[rgba(36,37,38,0.5)]">
                                <RiArrowRightUpLine size={16} />
                            </span>
                        </div>
                    </div>
                </div>
            </div >
        </Link>
    );
};

export default TvItem;

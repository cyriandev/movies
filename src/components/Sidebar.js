import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    RiCloseLine,
    RiClapperboardLine,
    RiFilmLine,
    RiLoader4Line,
    RiSearch2Line,
    RiStarSFill,
    RiTv2Line,
} from 'react-icons/ri';

const navItems = [
    { to: '/movies', label: 'Movies', subtitle: 'Feature films', icon: RiFilmLine, matches: ['/movies', '/movie/'] },
    { to: '/tv', label: 'TV Shows', subtitle: 'Series and episodes', icon: RiTv2Line, matches: ['/tv', '/tv/'] },
];

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const createSlug = (value) => value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setSuggestionsLoading(false);
            setSuggestionsError('');
            return undefined;
        }

        let active = true;
        const timeoutId = setTimeout(async () => {
            setSuggestionsLoading(true);
            setSuggestionsError('');

            try {
                const res = await axios.get('https://api.themoviedb.org/3/search/multi', {
                    params: {
                        api_key: API_KEY,
                        query: query.trim(),
                    },
                });

                if (!active) {
                    return;
                }

                const nextSuggestions = (res.data.results || [])
                    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
                    .slice(0, 6);

                setSuggestions(nextSuggestions);
            } catch {
                if (!active) {
                    return;
                }

                setSuggestions([]);
                setSuggestionsError('Suggestions unavailable');
            } finally {
                if (active) {
                    setSuggestionsLoading(false);
                }
            }
        }, 250);

        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [query]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!(event.target instanceof Element) || !event.target.closest('[data-sidebar-search]')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
        };
    }, []);

    const resetSearchState = () => {
        setQuery('');
        setSuggestions([]);
        setSuggestionsError('');
        setShowSuggestions(false);
    };

    const handleFullSearch = () => {
        if (!query.trim()) {
            return;
        }

        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        resetSearchState();
        onClose();
    };

    const handleSuggestionSelect = (item) => {
        const title = item.media_type === 'movie' ? item.title : item.name;
        const basePath = item.media_type === 'movie' ? 'movies' : 'tv';

        navigate(`/${basePath}/${item.id}/${createSlug(title)}`);
        resetSearchState();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFullSearch();
    };

    const navLinkClassName = ({ isActive }) =>
        `group relative flex items-center gap-3 rounded-[0.9rem] px-3 py-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isActive
            ? 'bg-[rgba(255,204,53,0.12)] text-[#f5f6fb]'
            : 'text-[#989188] hover:bg-[#2b2c2d] hover:text-[#e7e1d7]'
        }`;

    const isNavItemActive = (matches) =>
        matches.some((match) => (
            location.pathname === match || location.pathname.startsWith(match)
        ));

    const content = (
        <div className="flex h-full flex-col bg-[#242526] px-4 py-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[linear-gradient(135deg,#ffe28a,#ffcc35)] text-[#1b1c27] shadow-[0_10px_22px_rgba(255,204,53,0.18)]">
                            <RiClapperboardLine size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#7f869b]">movies + series</p>
                            <h1 className="mt-1 text-[1.22rem] leading-none text-[#f5f6fb]">moviesntv</h1>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2c2d] text-[#e7e1d7] lg:hidden"
                    >
                        <RiCloseLine size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5" data-sidebar-search>
                    <div className="relative">
                        <div className="input-shell flex items-center gap-3 rounded-[0.85rem] px-3 py-2.5">
                            <RiSearch2Line className="text-[#858ba1]" size={17} />
                            <input
                                type="search"
                                placeholder="Search titles"
                                value={query}
                                autoComplete="off"
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setShowSuggestions(false);
                                    }
                                }}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                className="w-full bg-transparent text-sm text-[#e7e1d7] placeholder:text-[#807a73] focus:outline-none"
                            />
                            {suggestionsLoading && <RiLoader4Line className="animate-spin text-[#7f8499]" size={16} />}
                        </div>

                        {showSuggestions && query.trim().length >= 2 && (
                            <div className="absolute inset-x-0 top-[calc(100%+0.45rem)] z-20 overflow-hidden rounded-[0.85rem] bg-[#242526] shadow-[0_16px_36px_rgba(0,0,0,0.24)] ring-1 ring-white/[0.04]">
                                {suggestionsError ? (
                                    <div className="px-3 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#7f8499]">
                                        {suggestionsError}
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <div className="p-2">
                                        {suggestions.map((item) => {
                                            const title = item.media_type === 'movie' ? item.title : item.name;
                                            const date = item.media_type === 'movie' ? item.release_date : item.first_air_date;

                                            return (
                                                <button
                                                    key={`${item.media_type}-${item.id}`}
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => handleSuggestionSelect(item)}
                                                    className="flex w-full items-center gap-3 rounded-[0.75rem] px-2.5 py-2 text-left transition-colors duration-300 hover:bg-[#2b2c2d]"
                                                >
                                                    <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-[0.75rem] bg-[#2b2c2d]">
                                                        {item.poster_path ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w154/${item.poster_path}`}
                                                                alt={title}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[var(--accent)]">
                                                                {item.media_type === 'movie' ? <RiFilmLine size={16} /> : <RiTv2Line size={16} />}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-[0.95rem] text-[#f5f6fb]">{title}</p>
                                                        <p className="mt-0.5 text-[0.66rem] uppercase tracking-[0.16em] text-[#7f8499]">
                                                            {item.media_type === 'movie' ? 'Movie' : 'Series'}
                                                            {date ? ` · ${new Date(date).getFullYear()}` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="inline-flex items-center gap-1 text-[0.72rem] text-[#d9deea]">
                                                        <RiStarSFill className="text-[var(--accent)]" size={12} />
                                                        {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={handleFullSearch}
                                            className="mt-2 flex w-full items-center justify-between rounded-[0.75rem] border-t border-white/[0.04] px-2.5 pt-3 pb-1.5 text-left text-[0.68rem] uppercase tracking-[0.18em] text-[#9ca1b7] transition-colors duration-300 hover:text-[#e7e1d7]"
                                        >
                                            View full search results
                                            <RiSearch2Line size={14} />
                                        </button>
                                    </div>
                                ) : !suggestionsLoading ? (
                                    <div className="px-3 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#7f8499]">
                                        No matches
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </form>

                <div className="mt-6">
                    <nav className="space-y-2">
                    {navItems.map(({ to, label, subtitle, icon: Icon, matches }, index) => {
                        const isActive = isNavItemActive(matches);

                        return (
                        <NavLink
                            key={to}
                            to={to}
                            className={() => navLinkClassName({ isActive })}
                            onClick={onClose}
                            style={{ transitionDelay: `${100 + index * 70}ms` }}
                        >
                            {() => (
                                <>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-[0.8rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isActive ? 'bg-[linear-gradient(135deg,#ffe28a,#ffcc35)] text-[#1b1c27]' : 'bg-white/[0.05] text-[#d8dde9] group-hover:bg-[#313234]'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-inherit">{label}</p>
                                        <p className={`mt-1 text-xs transition-colors duration-500 ${isActive ? 'text-[#c9dbf2]' : 'text-[#777f95]'}`}>{subtitle}</p>
                                    </div>
                                </>
                            )}
                        </NavLink>
                    )})}
                    </nav>
                </div>

                <div className="mt-auto pt-6">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#6f7489]">
                        moviesntv · TMDB data
                    </p>
                </div>
        </div>
    );

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[19rem] lg:block">
                {content}
            </aside>

            <div className={`fixed inset-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
                <div
                    className="absolute inset-0 bg-black/82 backdrop-blur-3xl"
                    onClick={onClose}
                />
                <div className={`absolute inset-y-0 left-0 w-[19rem] max-w-[88vw] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                    {content}
                </div>
            </div>
        </>
    );
};

export default Sidebar;

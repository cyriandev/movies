import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    RiBookmark3Line,
    RiCloseLine,
    RiClapperboardLine,
    RiFilmLine,
    RiLoginBoxLine,
    RiLoader4Line,
    RiLogoutBoxLine,
    RiSearch2Line,
    RiStarSFill,
    RiTv2Line,
} from 'react-icons/ri';
import { useAuth } from '../context/auth/AuthContext';

const navItems = [
    { to: '/movies', label: 'Movies', icon: RiFilmLine, matches: ['/movies', '/movie/'] },
    { to: '/tv', label: 'TV Shows', icon: RiTv2Line, matches: ['/tv', '/tv/'] },
    { to: '/watchlist', label: 'Watchlist', icon: RiBookmark3Line, matches: ['/watchlist'] },
];

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const createSlug = (value) => value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { authLoading, signOut, user } = useAuth();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const nextQuery = location.pathname.startsWith('/search') ? searchParams.get('q') || '' : '';
        setQuery(nextQuery);
        setSuggestions([]);
        setSuggestionsError('');
        setShowSuggestions(false);
    }, [location.pathname, location.search]);

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

    const handleAuthNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/movies');
        onClose();
    };

    const navLinkClassName = ({ isActive }) =>
        `sidebar-nav-item group ${isActive
            ? 'sidebar-nav-item-active'
            : ''
        }`;

    const isNavItemActive = (matches) =>
        matches.some((match) => (
            location.pathname === match || location.pathname.startsWith(match)
        ));

    const content = (
        <div className="sidebar-panel flex h-full flex-col px-4 py-5">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-white/10 bg-[linear-gradient(135deg,#ffe28a,#ffcc35)] text-[#1b1c27]">
                            <RiClapperboardLine size={18} />
                        </div>
                        <h1 className="min-w-0 text-[1.22rem] leading-none text-[#f5f6fb]">moviesntv</h1>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#e7e1d7] backdrop-blur-md lg:hidden"
                    >
                        <RiCloseLine size={20} />
                    </button>
                </div>

                <div className="relative z-30 mt-5 rounded-[1.1rem] border border-white/[0.08] bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex items-center justify-between gap-3">
                        <p className="sidebar-section-label">Quick search</p>
                    </div>
                    <p className="mt-2 text-[0.78rem] leading-5 text-[#f5f6fb]">
                        Jump into films and series without leaving the dock.
                    </p>

                <form onSubmit={handleSubmit} className="mt-3" data-sidebar-search>
                    <div className="relative">
                        <div className="input-shell flex items-center gap-3 rounded-[0.95rem] bg-white/[0.04] px-3 py-2.5 backdrop-blur-md">
                            <RiSearch2Line className="text-[var(--muted-warm)]" size={17} />
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
                            <div className="sidebar-search-panel absolute inset-x-0 top-[calc(100%+0.55rem)] z-40 overflow-hidden rounded-[0.95rem]">
                                {suggestionsError ? (
                                    <div className="px-3 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#f5f6fb]">
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
                                                    className="flex w-full items-center gap-3 rounded-[0.8rem] px-2.5 py-2 text-left transition-colors duration-300 hover:bg-white/[0.05]"
                                                >
                                                    <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-[0.75rem] bg-white/[0.05]">
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
                                                        <p className="mt-0.5 text-[0.66rem] uppercase tracking-[0.16em] text-[#f5f6fb]">
                                                            {item.media_type === 'movie' ? 'Movie' : 'Series'}
                                                            {date ? ` · ${new Date(date).getFullYear()}` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="inline-flex items-center gap-1 text-[0.72rem] text-[#e7e1d7]">
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
                                            className="mt-2 flex w-full items-center justify-between rounded-[0.75rem] border-t border-white/[0.04] px-2.5 pt-3 pb-1.5 text-left text-[0.68rem] uppercase tracking-[0.18em] text-[#f5f6fb] transition-colors duration-300 hover:text-[#e7e1d7]"
                                        >
                                            View full search results
                                            <RiSearch2Line size={14} />
                                        </button>
                                    </div>
                                ) : !suggestionsLoading ? (
                                    <div className="px-3 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#f5f6fb]">
                                        No matches
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </form>
                </div>

                <div className="relative mt-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="sidebar-section-label">Navigation</p>
                        <span className="h-px flex-1 bg-white/[0.06]" />
                    </div>
                    <nav className="space-y-2">
                    {navItems.map(({ to, label, icon: Icon, matches }, index) => {
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
                                    <div className={`flex h-[2.125rem] w-[2.125rem] items-center justify-center transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted-warm)] group-hover:text-[#e7e1d7]'}`}>
                                        <Icon size={17} />
                                    </div>
                                    <p className="min-w-0 flex-1 text-[0.95rem] text-inherit">{label}</p>
                                </>
                            )}
                        </NavLink>
                    )})}
                    </nav>
                </div>

                <div className="relative z-10 mt-auto space-y-3 pt-6">
                    <div className="space-y-2">
                        <p className="sidebar-section-label">Account</p>
                        {authLoading ? (
                            <div className="double-core px-3 py-3 text-sm text-[#9ca1b7]">Loading account...</div>
                        ) : user ? (
                            <div className="double-core rounded-[1rem] px-3.5 py-3.5">
                                <p className="truncate text-sm text-[#f5f6fb]">{user.email || 'Signed in user'}</p>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="action-pill mt-3 w-full justify-center"
                                >
                                    <RiLogoutBoxLine size={16} />
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAuthNavigation('/login')}
                                    className="action-pill flex-1 justify-center"
                                >
                                    <RiLoginBoxLine size={16} />
                                    Continue with email
                                </button>
                            </div>
                        )}
                    </div>
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

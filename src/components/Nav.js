import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { RiArrowRightUpLine, RiSearch2Line } from 'react-icons/ri';

const links = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv', label: 'TV Shows' },
];

const Nav = ({ onMenuClick, menuOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [q, setQ] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const nextQuery = location.pathname.startsWith('/search') ? searchParams.get('q') || '' : '';
        setQ(nextQuery);
    }, [location.pathname, location.search]);

    const activeLabel = useMemo(() => {
        if (location.pathname.startsWith('/tv')) {
            return 'Browse TV';
        }

        if (location.pathname.startsWith('/search')) {
            return 'Search catalog';
        }

        if (location.pathname.startsWith('/movie') || location.pathname.startsWith('/tv/')) {
            return 'Title details';
        }

        return 'Browse movies';
    }, [location.pathname]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (q.trim()) {
            navigate(`/search?q=${encodeURIComponent(q.trim())}`);
            setSearchOpen(false);
            setQ('');
        }
    };

    return (
        <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <div className="mx-auto max-w-[1680px]">
                <div className="glass-pill mx-auto flex w-full max-w-[1160px] items-center justify-between gap-3 rounded-full px-3 py-3 backdrop-blur-3xl sm:px-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenuClick}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 lg:hidden"
                            aria-label="Open menu"
                        >
                            <span className="relative h-4 w-5">
                                <span className={`absolute left-0 top-0 block h-px w-5 bg-[#f4f7fb] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                                <span className={`absolute left-0 top-[7px] block h-px w-5 bg-[#f4f7fb] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <span className={`absolute left-0 top-[14px] block h-px w-5 bg-[#f4f7fb] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
                            </span>
                        </button>

                        <div className="hidden sm:block">
                            <p className="text-[0.64rem] uppercase tracking-[0.28em] text-[var(--muted-warm)]">moviesntv</p>
                            <p className="mt-1 text-sm text-[#f4f7fb]">{activeLabel}</p>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) =>
                                    `tab-pill ${isActive ? 'tab-pill-active' : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <form onSubmit={handleSubmit} className="hidden items-center gap-2 lg:flex">
                        <div className="input-shell flex items-center gap-3 px-4 py-3">
                            <RiSearch2Line className="text-[var(--text-warm)]" size={18} />
                            <input
                                type="search"
                                placeholder="Search movies, TV shows..."
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-72 bg-transparent text-sm text-[#f4f7fb] placeholder:text-[var(--muted-warm-soft)] focus:outline-none"
                            />
                        </div>

                        <button type="submit" className="island-button group text-sm">
                            Search
                            <span className="icon-island">
                                <RiArrowRightUpLine size={16} />
                            </span>
                        </button>
                    </form>

                    <button
                        onClick={() => setSearchOpen((value) => !value)}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f4f7fb] lg:hidden"
                        aria-label="Toggle search"
                    >
                        <RiSearch2Line size={18} />
                    </button>
                </div>

                <div className={`mx-auto mt-3 max-w-[1160px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${searchOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="double-shell">
                        <div className="double-core px-4 py-4">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                                <div className="input-shell flex flex-1 items-center gap-3 px-4 py-3">
                                    <RiSearch2Line className="text-[var(--text-warm)]" size={18} />
                                    <input
                                        type="search"
                                        placeholder="Search movies, TV shows..."
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        autoFocus
                                        className="w-full bg-transparent text-sm text-[#f4f7fb] placeholder:text-[var(--muted-warm-soft)] focus:outline-none"
                                    />
                                </div>
                                <button type="submit" className="island-button group w-full justify-center text-sm sm:w-auto">
                                    Search
                                    <span className="icon-island">
                                        <RiArrowRightUpLine size={16} />
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Nav;

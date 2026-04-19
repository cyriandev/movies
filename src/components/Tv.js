import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RiLoader4Line } from 'react-icons/ri';
import TvContext from '../context/tv/tvContext';
import TvItem from './TvItem';
import HeroSlider from './HeroSlider';
import Filters from './Filters';
import PaginationControls from './PaginationControls';
import Reveal from './Reveal';
import Seo from './Seo';

const getInitialTab = (searchParams) => (
    searchParams.get('tab') === 'top_rated' ? 'top_rated' : 'popular'
);

const getInitialPage = (searchParams) => {
    const value = Number(searchParams.get('page'));

    if (!Number.isInteger(value) || value < 1) {
        return 1;
    }

    return Math.min(value, 500);
};

const Tv = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tvContext = useContext(TvContext);
    const {
        getOnAir, onAir_loading, onAir,
        getTopRated, top_rated_loading, top_rated, top_rated_page, top_rated_total_pages,
        getPopular, popular_loading, popular, popular_page, popular_total_pages,
        getTvGenres, tvGenres,
    } = tvContext;

    const initialTab = getInitialTab(searchParams);
    const initialPage = getInitialPage(searchParams);

    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortBy, setSortBy] = useState('default');
    const [pageByTab, setPageByTab] = useState(() => ({
        popular: initialTab === 'popular' ? initialPage : 1,
        top_rated: initialTab === 'top_rated' ? initialPage : 1,
    }));

    useEffect(() => {
        getOnAir();
        getTvGenres();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const nextPage = pageByTab[activeTab];

        if (activeTab === 'popular' && popular_page === nextPage && popular.length > 0) {
            return;
        }

        if (activeTab === 'top_rated' && top_rated_page === nextPage && top_rated.length > 0) {
            return;
        }

        if (activeTab === 'popular') {
            getPopular(nextPage);
            return;
        }

        getTopRated(nextPage);
        // getPopular/getTopRated come from context providers and change identity after dispatches.
        // Depending on them here retriggers the effect into a fetch loop in App-level renders.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, pageByTab, popular.length, popular_page, top_rated.length, top_rated_page]);

    const sourceData = activeTab === 'popular' ? popular : top_rated;
    const loading = activeTab === 'popular' ? popular_loading : top_rated_loading;
    const currentPage = activeTab === 'popular' ? pageByTab.popular : pageByTab.top_rated;
    const totalPages = activeTab === 'popular' ? popular_total_pages : top_rated_total_pages;

    useEffect(() => {
        if (searchParams.get('tab') === activeTab && searchParams.get('page') === String(currentPage)) {
            return;
        }

        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', activeTab);
        nextParams.set('page', String(currentPage));
        setSearchParams(nextParams, { replace: true });
    }, [activeTab, currentPage, searchParams, setSearchParams]);

    const filteredShows = useMemo(() => {
        let data = [...sourceData];
        if (selectedGenres.length > 0) {
            data = data.filter((t) => t.genre_ids?.some((id) => selectedGenres.includes(id)));
        }
        if (sortBy === 'latest') {
            data = [...data].sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
        } else if (sortBy === 'oldest') {
            data = [...data].sort((a, b) => new Date(a.first_air_date) - new Date(b.first_air_date));
        } else if (sortBy === 'rating_desc') {
            data = [...data].sort((a, b) => b.vote_average - a.vote_average);
        } else if (sortBy === 'rating_asc') {
            data = [...data].sort((a, b) => a.vote_average - b.vote_average);
        }
        return data;
    }, [sourceData, selectedGenres, sortBy]);

    const toggleGenre = (id) => {
        setSelectedGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handlePageChange = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
            return;
        }

        setPageByTab((prev) => ({
            ...prev,
            [activeTab]: nextPage,
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full space-y-8">
            <Seo
                title="moviesntv - TV Shows"
                description="Get TV show information from TMDB's API"
            />

            {onAir_loading ? (
                <div className="double-shell">
                    <div className="double-core flex h-[28rem] items-center justify-center">
                        <div className="spinner" />
                    </div>
                </div>
            ) : (
                <HeroSlider items={onAir} type="tv" />
            )}

            <Reveal delay={60}>
                <div className="double-shell">
                    <div className="double-core px-4 py-2 sm:px-5 sm:py-2.5">
                        <Filters
                            genres={tvGenres}
                            selectedGenres={selectedGenres}
                            onGenreToggle={toggleGenre}
                            onClearGenres={() => setSelectedGenres([])}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            headerControls={
                                <div className="flex flex-wrap items-center gap-2 rounded-[0.9rem] bg-[#242526] p-1.5">
                                    {[
                                        { value: 'popular', label: 'Most Popular' },
                                        { value: 'top_rated', label: 'Top Rated' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                            className={`tab-pill ${activeTab === tab.value ? 'tab-pill-active' : ''}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            }
                        />
                    </div>
                </div>
            </Reveal>

            <Reveal delay={180}>
                {loading && sourceData.length === 0 ? (
                    <div className="double-shell">
                        <div className="double-core flex h-64 items-center justify-center">
                            <div className="spinner" />
                        </div>
                    </div>
                ) : filteredShows.length === 0 ? (
                    <div className="double-shell">
                        <div className="double-core px-6 py-16 text-center">
                            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No match</p>
                             <p className="mt-3 text-[1.75rem] text-[#f5f6fb]">No TV shows fit the current selection.</p>
                            <p className="mt-3 text-sm text-[#9ca1b7]">Adjust the rating threshold or clear a genre to reopen the stack.</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative space-y-6">
                        <div
                            className={`grid grid-cols-1 gap-4 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${loading ? 'opacity-45' : 'opacity-100'}`}
                            aria-busy={loading}
                        >
                            {filteredShows.map((tv) => (
                                <TvItem key={tv.id} tv={tv} />
                            ))}
                        </div>
                        {loading && (
                            <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#242526]/94 px-3 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#f5f6fb] ring-1 ring-white/10 backdrop-blur-md">
                                    <RiLoader4Line className="animate-spin" size={14} />
                                    Loading page
                                </div>
                            </div>
                        )}
                        <PaginationControls
                            label={activeTab === 'popular' ? 'Popular series' : 'Top rated series'}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </Reveal>
        </div>
    );
};

export default Tv;

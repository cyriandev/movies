import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const fetchedPagesRef = useRef({
        popular: new Set(),
        top_rated: new Set(),
    });
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
        if (popular.length > 0 && popular_page > 0) {
            fetchedPagesRef.current.popular.add(popular_page);
        }

        if (top_rated.length > 0 && top_rated_page > 0) {
            fetchedPagesRef.current.top_rated.add(top_rated_page);
        }
    }, [popular, popular_page, top_rated, top_rated_page]);

    useEffect(() => {
        const nextPage = pageByTab[activeTab];
        const fetchedPages = fetchedPagesRef.current[activeTab];

        if (fetchedPages.has(nextPage)) {
            return;
        }

        fetchedPages.add(nextPage);

        if (activeTab === 'popular') {
            getPopular(nextPage);
            return;
        }

        getTopRated(nextPage);
    }, [activeTab, getPopular, getTopRated, pageByTab]);

    const sourceData = activeTab === 'popular' ? popular : top_rated;
    const loading = activeTab === 'popular' ? popular_loading : top_rated_loading;
    const currentPage = activeTab === 'popular' ? pageByTab.popular : pageByTab.top_rated;
    const totalPages = activeTab === 'popular' ? popular_total_pages : top_rated_total_pages;

    useEffect(() => {
        if (searchParams.get('tab') === activeTab && searchParams.get('page') === String(currentPage)) {
            return;
        }

        const nextParams = new URLSearchParams();
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
        if (nextPage < 1 || nextPage > totalPages) {
            return;
        }

        setPageByTab((prev) => ({
            ...prev,
            [activeTab]: nextPage,
        }));
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
                {loading ? (
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
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {filteredShows.map((tv) => (
                                <TvItem key={tv.id} tv={tv} />
                            ))}
                        </div>
                        <PaginationControls
                            label={activeTab === 'popular' ? 'Popular series' : 'Top rated series'}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </Reveal>
        </div>
    );
};

export default Tv;

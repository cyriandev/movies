import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MoviesContext from '../context/movies/moviesContext';
import Result from './Result';
import Reveal from './Reveal';
import Seo from './Seo';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Search = () => {
    let query = useQuery();
    let q = query.get('q');
    const moviesContext = useContext(MoviesContext);
    const { getResults, results_loading, results } = moviesContext;
    const titleResults = results.filter((item) => (
        (item.media_type === 'movie' || item.media_type === 'tv') && (item.title || item.name)
    ));

    useEffect(() => {
        if (q) getResults(q);
        // eslint-disable-next-line
    }, [q]);

    return (
        <div className="w-full space-y-6">
            <Seo
                title={`${q || 'Search'} - moviesntv`}
                description={q ? `Search results for ${q} on moviesntv.` : 'Search movies and series on moviesntv.'}
            />

            <Reveal>
                <div className="double-shell">
                    <div className="double-core px-5 py-5 sm:px-6 sm:py-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <h1 className="headline-gradient text-[2.2rem] leading-[0.95] sm:text-[3rem]">
                                Results for &ldquo;{q || 'your query'}&rdquo;
                            </h1>
                            <p className="text-sm text-[#9ca1b7]">
                                {results_loading ? 'Loading results...' : `${titleResults.length} ${titleResults.length === 1 ? 'result' : 'results'}`}
                            </p>
                        </div>
                    </div>
                </div>
            </Reveal>

            <Reveal delay={120}>
                {results_loading ? (
                    <div className="double-shell">
                        <div className="double-core flex h-64 items-center justify-center">
                            <div className="spinner" />
                        </div>
                    </div>
                ) : titleResults.length === 0 ? (
                    <div className="double-shell">
                        <div className="double-core px-6 py-16 text-center">
                            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No result</p>
                            <p className="mt-3 text-[1.75rem] text-[#f5f6fb]">Nothing surfaced for &ldquo;{q}&rdquo;.</p>
                            <p className="mt-3 text-sm text-[#9ca1b7]">Try a different title, a lead actor, or a broader keyword.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {titleResults.map((item) => (
                            <Result key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </Reveal>
        </div>
    );
};

export default Search;

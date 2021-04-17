import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom'
import MoviesContext from '../context/movies/moviesContext';
import Result from './Result';


// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}
const Search = () => {

    let query = useQuery();
    let q = query.get('q');
    const moviesContext = useContext(MoviesContext);
    const {
        getResults,
        results_loading,
        results
    } = moviesContext;

    useEffect(() => {
        getResults(q);
    }, [q])

    if (results_loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div>
    }

    return (
        <div className="searchM">
            <Helmet>
                <title>{q}</title>
                {/* <meta name="description" content={`${movie.overview}`} /> */}
            </Helmet>
            <div className="container mt-5">
                <h1 className="heading">Results ({results.length})</h1>

                <div className="row g-0 mt-4">

                    {
                        !results ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>Opps. Nothing was found with {q}</div> :
                            results.map((item, index) => (
                                <Result key={index} item={item} />
                            ))
                    }

                </div>
            </div>
        </div>
    )
}

export default Search

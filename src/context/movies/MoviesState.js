import React, { useReducer } from 'react';
import axios from 'axios';
import MoviesContext from './moviesContext';
import MoviesReducer from './moviesReducer';
import {
    CLEAR_ERRORS,
    PLAYING_LOADING,
    PLAYING_ERROR,
    GET_PLAYING,
    TOP_RATED_LOADING,
    TOP_RATED_ERROR,
    GET_TOP_RATED,
    POPULAR_LOADING,
    POPULAR_ERROR,
    GET_POPULAR,
    GET_MOVIE,
    MOVIE_LOADING,
    MOVIE_ERROR,
    GET_CREDITS,
    CAST_ERROR,
    CAST_LOADING,
    GET_REVIEWS,
    REVIEWS_ERROR,
    REVIEWS_LOADING,
    GET_VIDEOS,
    VIDEOS_ERROR,
    VIDEOS_LOADING,
    GET_RESULTS,
    RESULTS_ERROR,
    RESULTS_LOADING,
    GET_GENRES,
    GENRES_LOADING,
} from '../types';


const MoviesState = ({ children }) => {
    const initialState = {
        playing: [],
        top_rated: [],
        top_rated_page: 1,
        top_rated_total_pages: 1,
        popular: [],
        popular_page: 1,
        popular_total_pages: 1,
        movie: [],
        credits: [],
        reviews: [],
        videos: [],
        results: [],
        genres: [],
        error: null,
        playing_loading: false,
        movie_loading: false,
        top_rated_loading: false,
        popular_loading: false,
        cast_loading: false,
        reviews_loading: false,
        videos_loading: false,
        results_loading: false,
        genres_loading: false,
    }
    const [state, dispatch] = useReducer(MoviesReducer, initialState);


    // Get Playing Movies
    const getPlaying = async () => {

        setPlayingLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_PLAYING,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: PLAYING_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }


    // Get Top Rated Movies
    const getTopRated = async (page = 1) => {

        setTopRatedLoading();
        try {
            const res = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
                params: {
                    api_key: process.env.REACT_APP_TMDB_API_KEY,
                    page,
                },
            });
            dispatch({
                type: GET_TOP_RATED,
                payload: {
                    results: res.data.results,
                    page: res.data.page || page,
                    total_pages: Math.max(1, Math.min(res.data.total_pages || 1, 500)),
                }
            })
        } catch (err) {
            dispatch({
                type: TOP_RATED_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get Top Rated Movies
    const getPopular = async (page = 1) => {

        setPopularLoading();
        try {
            const res = await axios.get('https://api.themoviedb.org/3/movie/popular', {
                params: {
                    api_key: process.env.REACT_APP_TMDB_API_KEY,
                    page,
                },
            });
            dispatch({
                type: GET_POPULAR,
                payload: {
                    results: res.data.results,
                    page: res.data.page || page,
                    total_pages: Math.max(1, Math.min(res.data.total_pages || 1, 500)),
                }
            })
        } catch (err) {
            dispatch({
                type: POPULAR_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }
    // Get  Movie (id)
    const getMovie = async (id) => {

        setMovieLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_MOVIE,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: MOVIE_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get  Cast (id)
    const getCast = async (id) => {

        setCastLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_CREDITS,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: CAST_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get  Reviews (id)
    const getReviews = async (id) => {

        setReviewsLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_REVIEWS,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: REVIEWS_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }
    // Get  Videos (id)
    const getVideos = async (id) => {

        setVideosLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_VIDEOS,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: VIDEOS_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }
    // Get  Search Results (id)
    const getResults = async (q) => {

        setResultsLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/search/multi?query=${q}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_RESULTS,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: RESULTS_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }


    // Get Genres
    const getGenres = async () => {
        dispatch({ type: GENRES_LOADING });
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            dispatch({
                type: GET_GENRES,
                payload: res.data.genres
            });
        } catch (err) {
            // non-critical, fail silently
        }
    }


    // Clear Errors
    const clearErrors = () => dispatch({
        type: CLEAR_ERRORS
    })

    // Set Loading
    const setPlayingLoading = () => dispatch({ type: PLAYING_LOADING })
    const setTopRatedLoading = () => dispatch({ type: TOP_RATED_LOADING })
    const setPopularLoading = () => dispatch({ type: POPULAR_LOADING })
    const setMovieLoading = () => dispatch({ type: MOVIE_LOADING })
    const setCastLoading = () => dispatch({ type: CAST_LOADING })
    const setReviewsLoading = () => dispatch({ type: REVIEWS_LOADING })
    const setVideosLoading = () => dispatch({ type: VIDEOS_LOADING })
    const setResultsLoading = () => dispatch({ type: RESULTS_LOADING })


    return <MoviesContext.Provider
        value={{

            playing: state.playing,
            movie: state.movie,
            credits: state.credits,
            videos: state.videos,
            top_rated: state.top_rated,
            top_rated_page: state.top_rated_page,
            top_rated_total_pages: state.top_rated_total_pages,
            popular: state.popular,
            popular_page: state.popular_page,
            popular_total_pages: state.popular_total_pages,
            reviews: state.reviews,
            results: state.results,
            genres: state.genres,
            playing_loading: state.playing_loading,
            cast_loading: state.cast_loading,
            movie_loading: state.movie_loading,
            top_rated_loading: state.top_rated_loading,
            popular_loading: state.popular_loading,
            reviews_loading: state.reviews_loading,
            videos_loading: state.videos_loading,
            results_loading: state.results_loading,
            genres_loading: state.genres_loading,
            getPlaying,
            getTopRated,
            getPopular,
            getMovie,
            getCast,
            getReviews,
            getVideos,
            getResults,
            getGenres,

        }}
    >
        {children}
    </MoviesContext.Provider>
}

export default MoviesState;

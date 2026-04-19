import React, { useReducer } from 'react';
import axios from 'axios';
import TvContext from './tvContext';
import TvReducer from './tvReducer';
import {
    CLEAR_TV_ERRORS,
    ON_AIR_LOADING,
    ON_AIR_ERROR,
    GET_ON_AIR,
    TOP_RATED_LOADING,
    TOP_RATED_ERROR,
    GET_TOP_RATED,
    POPULAR_LOADING,
    POPULAR_ERROR,
    GET_POPULAR,
    GET_TV,
    TV_LOADING,
    TV_ERROR,
    GET_CREDITS,
    CAST_ERROR,
    CAST_LOADING,
    GET_REVIEWS,
    REVIEWS_ERROR,
    REVIEWS_LOADING,
    GET_VIDEOS,
    VIDEOS_ERROR,
    VIDEOS_LOADING,
    GET_TV_GENRES,
    TV_GENRES_LOADING,
    GET_SEASON,
    SEASON_LOADING,
    SEASON_ERROR,
} from '../types';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const TvState = ({ children }) => {
    const initialState = {
        top_rated: [],
        top_rated_page: 1,
        top_rated_total_pages: 1,
        reviews: [],
        popular: [],
        popular_page: 1,
        popular_total_pages: 1,
        videos: [],
        onAir: [],
        credits: [],
        tv: [],
        season: null,
        tvGenres: [],
        error: null,
        onAir_loading: false,
        top_rated_loading: false,
        popular_loading: false,
        tv_loading: false,
        cast_loading: false,
        reviews_loading: false,
        videos_loading: false,
        tvGenres_loading: false,
        season_loading: false,
    }
    const [state, dispatch] = useReducer(TvReducer, initialState);


    // Get On Air TV
    const getOnAir = async () => {

        setOnAirLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`);
            dispatch({
                type: GET_ON_AIR,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: ON_AIR_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get Top Rated Tv
    const getTopRated = async (page = 1) => {

        setTopRatedLoading();
        try {
            const res = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
                params: {
                    api_key: API_KEY,
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

    // Get Popular Tv
    const getPopular = async (page = 1) => {

        setPopularLoading();
        try {
            const res = await axios.get('https://api.themoviedb.org/3/tv/popular', {
                params: {
                    api_key: API_KEY,
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

    // Get Tv by id
    const getTv = async (id) => {

        setTvLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
            dispatch({
                type: GET_TV,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: TV_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get Cast
    const getCast = async (id) => {

        setCastLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`);
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

    // Get Reviews
    const getReviews = async (id) => {

        setReviewsLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${API_KEY}`);
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

    // Get Videos
    const getVideos = async (id) => {

        setVideosLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`);
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

    // Get TV Genres
    const getTvGenres = async () => {
        dispatch({ type: TV_GENRES_LOADING });
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`);
            dispatch({
                type: GET_TV_GENRES,
                payload: res.data.genres
            })
        } catch (err) {
            // non-critical, fail silently
        }
    }

    // Get TV Season
    const getSeason = async (id, seasonNumber) => {
        dispatch({ type: SEASON_LOADING });
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`);
            dispatch({
                type: GET_SEASON,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: SEASON_ERROR,
                payload: (err.response || {}).data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Clear Errors
    const clearErrors = () => dispatch({
        type: CLEAR_TV_ERRORS
    })

    // Set Loading
    const setOnAirLoading = () => dispatch({ type: ON_AIR_LOADING })
    const setTopRatedLoading = () => dispatch({ type: TOP_RATED_LOADING })
    const setPopularLoading = () => dispatch({ type: POPULAR_LOADING })
    const setTvLoading = () => dispatch({ type: TV_LOADING })
    const setCastLoading = () => dispatch({ type: CAST_LOADING })
    const setReviewsLoading = () => dispatch({ type: REVIEWS_LOADING })
    const setVideosLoading = () => dispatch({ type: VIDEOS_LOADING })


    return <TvContext.Provider
        value={{
            onAir: state.onAir,
            onAir_loading: state.onAir_loading,
            top_rated: state.top_rated,
            top_rated_page: state.top_rated_page,
            top_rated_total_pages: state.top_rated_total_pages,
            top_rated_loading: state.top_rated_loading,
            popular: state.popular,
            popular_page: state.popular_page,
            popular_total_pages: state.popular_total_pages,
            popular_loading: state.popular_loading,
            tv: state.tv,
            tv_loading: state.tv_loading,
            season: state.season,
            season_loading: state.season_loading,
            credits: state.credits,
            cast_loading: state.cast_loading,
            videos: state.videos,
            reviews: state.reviews,
            reviews_loading: state.reviews_loading,
            videos_loading: state.videos_loading,
            tvGenres: state.tvGenres,
            tvGenres_loading: state.tvGenres_loading,
            getReviews,
            getVideos,
            getCast,
            getTv,
            getSeason,
            getPopular,
            getTopRated,
            getOnAir,
            getTvGenres,
        }}
    >
        {children}
    </TvContext.Provider>
}

export default TvState;

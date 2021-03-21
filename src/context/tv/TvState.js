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
    GET_CAST,
    CAST_ERROR,
    CAST_LOADING,
    GET_REVIEWS,
    REVIEWS_ERROR,
    REVIEWS_LOADING,
    GET_VIDEOS,
    VIDEOS_ERROR,
    VIDEOS_LOADING,
} from '../types';


const TvState = ({ children }) => {
    const initialState = {
        top_rated: [],
        reviews: [],
        popular: [],
        videos: [],
        onAir: [],
        cast: [],
        tv: [],
        error: null,
        onAir_loading: false,
        top_rated_loading: false,
        popular_loading: false,
        tv_loading: false,
        cast_loading: false,
        reviews_loading: false,
        videos_loading: false,

    }
    const [state, dispatch] = useReducer(TvReducer, initialState);


    // Get Playing Movies
    const getOnAir = async () => {

        setOnAirLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_ON_AIR,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: ON_AIR_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get Top Rated Tv
    const getTopRated = async () => {

        setTopRatedLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_TOP_RATED,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: TOP_RATED_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get Top Rated Tv
    const getPopular = async () => {

        setPopularLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_POPULAR,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: POPULAR_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get  Movie (id)
    const getTv = async (id) => {

        setTvLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_TV,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: TV_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get  Cast (id)
    const getCast = async (id) => {

        setCastLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_CAST,
                payload: res.data.cast
            })
        } catch (err) {
            dispatch({
                type: CAST_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get  Reviews (id)
    const getReviews = async (id) => {

        setReviewsLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_REVIEWS,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: REVIEWS_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }
    // Get  Videos (id)
    const getVideos = async (id) => {

        setVideosLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_VIDEOS,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: VIDEOS_ERROR,
                payload: err.response.data
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
            top_rated_loading: state.top_rated_loading,
            popular: state.popular,
            popular_loading: state.popular_loading,
            tv: state.tv,
            tv_loading: state.tv_loading,
            cast: state.cast,
            cast_loading: state.cast_loading,
            videos: state.videos,
            reviews: state.reviews,
            reviews_loading: state.reviews_loading,
            videos_loading: state.videos_loading,
            getReviews,
            getVideos,
            getCast,
            getTv,
            getPopular,
            getTopRated,
            getOnAir,
        }}
    >
        {children}
    </TvContext.Provider>
}

export default TvState;


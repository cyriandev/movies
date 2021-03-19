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
    GET_CAST,
    CAST_ERROR,
    CAST_LOADING
} from '../types';


const MoviesState = ({ children }) => {
    const initialState = {
        playing: [],
        top_rated: [],
        popular: [],
        movie: [],
        cast: [],
        error: null,
        playing_loading: false,
        movie_loading: false,
        top_rated_loading: false,
        popular_loading: false,
        cast_loading: false,

    }
    const [state, dispatch] = useReducer(MoviesReducer, initialState);


    // Get Playing Movies
    const getPlaying = async () => {

        setPlayingLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_PLAYING,
                payload: res.data.results
            })
        } catch (err) {
            dispatch({
                type: PLAYING_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }


    // Get Top Rated Movies
    const getTopRated = async () => {

        setTopRatedLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
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

    // Get Top Rated Movies
    const getPopular = async () => {

        setPopularLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
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
    const getMovie = async (id) => {

        setMovieLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
            dispatch({
                type: GET_MOVIE,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: MOVIE_ERROR,
                payload: err.response.data
            })
            setTimeout(() => clearErrors(), 5000);
        }
    }

    // Get  Cast (id)
    const getCast = async (id) => {

        setCastLoading();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=1594420be7b6feaa53bb4b0ec89cbc07`);
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


    return <MoviesContext.Provider
        value={{

            playing: state.playing,
            movie: state.movie,
            cast: state.cast,
            top_rated: state.top_rated,
            popular: state.popular,
            plying_loading: state.plying_loading,
            cast_loading: state.cast_loading,
            movie_loading: state.movie_loading,
            top_rated_loading: state.top_rated_loading,
            popular_loading: state.popular_loading,
            getPlaying,
            getTopRated,
            getPopular,
            getMovie,
            getCast,

        }}
    >
        {children}
    </MoviesContext.Provider>
}

export default MoviesState;


import {
    CLEAR_ERRORS,
    PLAYING_LOADING,
    TOP_RATED_LOADING,
    PLAYING_ERROR,
    TOP_RATED_ERROR,
    GET_PLAYING,
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
    RESULTS_LOADING,
    GET_RESULTS
} from '../types';


export default (state, action) => {
    switch (action.type) {
        case PLAYING_LOADING:
            return {
                ...state,
                playing_loading: true
            }
        case RESULTS_LOADING:
            return {
                ...state,
                results_loading: true
            }
        case VIDEOS_LOADING:
            return {
                ...state,
                videos_loading: true
            }
        case CAST_LOADING:
            return {
                ...state,
                cast_loading: true
            }
        case TOP_RATED_LOADING:
            return {
                ...state,
                top_rated_loading: true
            }
        case POPULAR_LOADING:
            return {
                ...state,
                popular_loading: true
            }

        case MOVIE_LOADING:
            return {
                ...state,
                movie_loading: true
            }
        case REVIEWS_LOADING:
            return {
                ...state,
                reviews_loading: true
            }

        case GET_PLAYING:
            return {
                ...state,
                playing: action.payload,
                playing_loading: false
            }
        case GET_RESULTS:
            return {
                ...state,
                results: action.payload,
                results_loading: false
            }
        case GET_VIDEOS:
            return {
                ...state,
                videos: action.payload,
                videos_loading: false
            }
        case GET_CREDITS:
            return {
                ...state,
                credits: action.payload,
                cast_loading: false
            }
        case GET_MOVIE:
            return {
                ...state,
                movie: action.payload,
                movie_loading: false
            }
        case GET_POPULAR:
            return {
                ...state,
                popular: action.payload,
                popular_loading: false
            }
        case GET_TOP_RATED:
            return {
                ...state,
                top_rated: action.payload,
                top_rated_loading: false
            }
        case GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload,
                reviews_loading: false
            }

        case PLAYING_ERROR:
            return {
                ...state,
                error: action.payload,
                playing_loading: false
            }
        case VIDEOS_ERROR:
            return {
                ...state,
                error: action.payload,
                videos_loading: false
            }
        case MOVIE_ERROR:
            return {
                ...state,
                error: action.payload,
                movie_loading: false
            }
        case CAST_ERROR:
            return {
                ...state,
                error: action.payload,
                cast_loading: false
            }
        case REVIEWS_ERROR:
            return {
                ...state,
                error: action.payload,
                results_loading: false
            }
        case POPULAR_ERROR:
            return {
                ...state,
                error: action.payload,
                popular_loading: false
            }
        case TOP_RATED_ERROR:
            return {
                ...state,
                error: action.payload,
                top_rated_loading: false
            }
        case REVIEWS_ERROR:
            return {
                ...state,
                error: action.payload,
                reviews_loading: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            }

        default:
            return state;
    }
}
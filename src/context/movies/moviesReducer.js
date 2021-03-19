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
    GET_CAST,
    CAST_ERROR,
    CAST_LOADING
} from '../types';


export default (state, action) => {
    switch (action.type) {
        case PLAYING_LOADING:
            return {
                ...state,
                playing_loading: true
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

        case GET_PLAYING:
            return {
                ...state,
                playing: action.payload,
                playing_loading: false
            }
        case GET_CAST:
            return {
                ...state,
                cast: action.payload,
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

        case PLAYING_ERROR:
            return {
                ...state,
                error: action.payload,
                playing_loading: false
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
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            }

        default:
            return state;
    }
}
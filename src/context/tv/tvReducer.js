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
} from '../types';


export default (state, action) => {
    switch (action.type) {
        case ON_AIR_LOADING:
            return {
                ...state,
                onAir_loading: true
            }

        case ON_AIR_ERROR:
            return {
                ...state,
                error: action.payload,
                onAir_loading: false
            }
        case GET_ON_AIR:
            return {
                ...state,
                onAir: action.payload,
                onAir_loading: false
            }
        case TOP_RATED_LOADING:
            return {
                ...state,
                top_rated_loading: true
            }
        case GET_TOP_RATED:
            return {
                ...state,
                top_rated: action.payload,
                top_rated_loading: false
            }
        case TOP_RATED_ERROR:
            return {
                ...state,
                error: action.payload,
                top_rated_loading: false
            }

        case POPULAR_LOADING:
            return {
                ...state,
                popular_loading: true
            }
        case GET_POPULAR:
            return {
                ...state,
                popular: action.payload,
                popular_loading: false
            }
        case POPULAR_ERROR:
            return {
                ...state,
                error: action.payload,
                popular_loading: false

            }
        case TV_LOADING:
            return {
                ...state,
                tv_loading: true
            }
        case GET_TV:
            return {
                ...state,
                tv: action.payload,
                tv_loading: false
            }
        case TV_ERROR:
            return {
                ...state,
                error: action.payload,
                tv_loading: false
            }
        case CAST_LOADING:
            return {
                ...state,
                cast_loading: true
            }
        case GET_CREDITS:
            return {
                ...state,
                credits: action.payload,
                cast_loading: false
            }
        case CAST_ERROR:
            return {
                ...state,
                error: action.payload,
                cast_loading: false
            }
        case VIDEOS_LOADING:
            return {
                ...state,
                videos_loading: true
            }
        case REVIEWS_LOADING:
            return {
                ...state,
                reviews_loading: true
            }
        case GET_VIDEOS:
            return {
                ...state,
                videos: action.payload,
                videos_loading: false
            }
        case GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload,
                reviews_loading: false
            }
        case VIDEOS_ERROR:
            return {
                ...state,
                error: action.payload,
                videos_loading: false
            }
        case REVIEWS_ERROR:
            return {
                ...state,
                error: action.payload,
                results_loading: false
            }
        case REVIEWS_ERROR:
            return {
                ...state,
                error: action.payload,
                reviews_loading: false
            }

        case CLEAR_TV_ERRORS:
            return {
                ...state,
                error: null,
            }

        default:
            return state;
    }
}
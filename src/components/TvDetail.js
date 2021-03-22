import React, { useContext, useEffect } from 'react'
import TvContext from '../context/tv/tvContext';
import { useParams } from "react-router-dom";
import moment from "moment";
import Cast from './Cast';
import Video from './Video';
import Review from './Review';
import { Helmet } from 'react-helmet';

const TvDetail = () => {

    let { id } = useParams();

    const tvContext = useContext(TvContext);
    const {
        getTv,
        tv_loading,
        tv,
        getCast,
        cast_loading,
        cast,
        getReviews,
        reviews_loading,
        reviews,
        getVideos,
        videos_loading,
        videos
    } = tvContext;

    useEffect(() => {
        getTv(id);
        getCast(id);
        getReviews(id);
        getVideos(id);
        // eslint-disable-next-line
    }, [id]);

    if (tv_loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}><div className="spinner"></div></div>
    }

    let { seasons } = tv;
    return (
        <div className="container">
            <Helmet>
                <meta name="title" content={`${tv.name}`} />
                <meta name="description" content={`${tv.overview}`} />
            </Helmet>
            <div className="hero" style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original/${tv.backdrop_path}')` }}>
                <div className="layer">
                    <div className="row">
                        <div className="col-md-4">
                            <img src={`https://image.tmdb.org/t/p/original/${tv.poster_path}`} alt={tv.name} loading="lazy" />
                        </div>
                        <div className="d-flex align-items-center col-md-8">
                            <div className="mt-5 descr">
                                <h1>{tv.name} ({tv.original_language})</h1>
                                <p>
                                    {moment(tv.first_air_date).format("DD MMMM YYYY") + ' (first aired)'}
                                        &nbsp;&nbsp;<span>&bull;</span>&nbsp;&nbsp; {tv.tagline} </p>

                                <h3>Overview</h3>
                                <p>{tv.overview}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>






            <section className="mt-4">

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button style={{ paddingLeft: 0, }} className="nav-link active md" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Cast</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link md" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Reviews ({reviews_loading ? '0' : reviews.length})</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link md" id="seasons-tab" data-bs-toggle="tab" data-bs-target="#seasons" type="button" role="tab" aria-controls="seasons" aria-selected="true">Seasons ({tv.number_of_seasons})</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link md" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Videos ({videos_loading ? '0' : videos.length})</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane  show active mt-2" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div className="row g-0">

                            {
                                cast_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                                    cast.map((item, index) => {
                                        if (index < 6)
                                            return (
                                                <Cast key={index} cast={item} />
                                            )
                                    })
                            }


                        </div>
                    </div>
                    <div className="tab-pane  mt-5" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div className="row g-0">

                            {
                                reviews_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                                    reviews.map((item, index) => (
                                        <Review key={index} item={item} />
                                    ))
                            }

                        </div>
                    </div>
                    <div className="tab-pane  mt-5" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="row g-0">
                            {
                                videos_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> : (
                                    videos.map((item, index) => (
                                        <Video key={index} video={item} />
                                    ))
                                )
                            }


                        </div>
                    </div>
                    <div className="tab-pane  mt-5" id="seasons" role="tabpanel" aria-labelledby="seasons-tab">
                        <div className="row g-0">
                            {seasons &&

                                seasons.map((item, index) => (
                                    <div className="d-flex review seasons">
                                        <div className="">

                                            <img src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                                                alt={item.name}
                                                width="90"
                                                loading="lazy" />
                                        </div>
                                        <div className="pl-3 detail">
                                            <h1>{item.name} </h1>
                                            <p>{moment(item.air_date).format("YYYY")} | {item.episode_count} Episodes</p>
                                            <p>premiered on {moment(item.air_date).format("DD MMMM YYYY")}</p>

                                        </div>
                                    </div>
                                ))


                            }

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TvDetail


import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom";
import MoviesContext from '../context/movies/moviesContext';
import { Movie } from './Movie';
import moment from "moment";
import { Helmet } from "react-helmet";
import SliderItem from './SliderItem';

const Landing = () => {

    const moviesContext = useContext(MoviesContext);
    const {
        getPlaying,
        playing_loading,
        playing,
        getTopRated,
        top_rated_loading,
        top_rated,
        getPopular,
        popular_loading,
        popular
    } = moviesContext;


    useEffect(() => {
        getPlaying();
        getTopRated();
        getPopular();

        // eslint-disable-next-line
    }, [])

    return (
        <div className="container">

            <Helmet>
                <meta name="title" content="Movies" />
                <meta name="description" content="Get Movies and tv show information from TMDB's API" />
            </Helmet>

            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">


                    {playing_loading ? <div className="carousel-item active d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :

                        playing.slice(0, 5).map((item, index) =>
                        (
                            <SliderItem key={index} item={item} index={index} />

                        )

                        )}

                </div>
            </div>
            <div className="controls">
                <a href="#" style={{ marginRight: 18 }} type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev"><ion-icon name="chevron-back-outline"></ion-icon></a>
                <a href="#" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next"><ion-icon name="chevron-forward-outline"></ion-icon></a>
            </div>




            <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button style={{ paddingLeft: 0 }} className="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">MOST POPULAR</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">TOP RATED</button>
                </li>
                {/* <li className="nav-item" role="presentation">
                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">TV</button>
                </li> */}
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane mt-5" id="home" role="tabpanel" aria-labelledby="home-tab">
                    {/* <p className="label">Movies</p> */}
                    <div className="row g-0">
                        {
                            top_rated_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                                top_rated.map((movie, index) => (
                                    <Movie key={index} movie={movie} />
                                ))
                        }
                    </div>
                </div>
                <div className="tab-pane  show active mt-5" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    {/* <p className="label">Movies</p> */}
                    <div className="row g-0">

                        {
                            popular_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                                popular.map((movie, index) => (
                                    <Movie key={index} movie={movie} />
                                ))
                        }

                    </div>
                </div>
                <div className="tab-pane  mt-5" id="contact" role="tabpanel" aria-labelledby="contact-tab"> <p className="label">Movies</p>
                    <div className="row g-0">
                        <div className="col-md-3">
                            <div className="movie">
                                Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="movie">
                                Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="movie">
                                Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="movie">
                                Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="movie">
                                Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="movie">
                                Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                            </div>
                        </div>

                    </div></div>
            </div>







        </div>
    )
}

export default Landing

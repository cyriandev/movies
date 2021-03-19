
import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom";
import MoviesContext from '../context/movies/moviesContext';
import { Movie } from './Movie';
import moment from "moment";




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



            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">


                    {playing_loading ? <div className="carousel-item active d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :

                        playing.map((item, index) =>
                        (
                            <div key={index} className={`carousel-item ${index === 0 && "active"}`}>
                                <div className="slide-item" style={{
                                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), url('https://image.tmdb.org/t/p/original/${item.backdrop_path}')`
                                }}>
                                    <div className="slider">
                                        <div className="info">
                                            {/* <p className="d-flex align-items-center" style={{ fontSize: 20 }}><ion-icon name="play-outline"></ion-icon> playing</p> */}
                                            <h1>
                                                {item.title}
                                            </h1>
                                            <h5>
                                                {moment(item.release_date).format("DD MMMM YYYY")}
                                                &nbsp;
                                                &nbsp;
                                                <span>&bull;</span>
                                                &nbsp;
                                                &nbsp;

                                                {item.vote_average}/10
                                            </h5>
                                            <p>
                                                {item.overview}
                                            </p>
                                            <Link to={`/movie/${item.id}`} className="cta mt-2">Learn More</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )

                        )}

                </div>
            </div>




            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button style={{ paddingLeft: 0 }} className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">TOP RATED</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">MOST POPULAR</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">TV</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane  show active mt-5" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <p className="label">Movies</p>
                    <div className="row g-0">
                        {
                            top_rated_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                                top_rated.map((movie, index) => (
                                    <Movie key={index} movie={movie} />
                                ))
                        }
                    </div>
                </div>
                <div className="tab-pane  mt-5" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <p className="label">Movies</p>
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

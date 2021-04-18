import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import MoviesContext from '../context/movies/moviesContext';
import Cast from './Cast';
import Review from "./Review";
import Video from "./Video";
import { Helmet } from "react-helmet";
import Crew from "./Crew";

export const Detail = () => {
  let { id } = useParams();
  const moviesContext = useContext(MoviesContext);
  const {
    getMovie,
    movie_loading,
    movie,
    getCast,
    cast_loading,
    credits,
    getReviews,
    reviews_loading,
    reviews,
    getVideos,
    videos_loading,
    videos
  } = moviesContext;


  useEffect(() => {
    getMovie(id);
    getCast(id);
    getReviews(id);
    getVideos(id);

    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id]);

  if (movie_loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}><div className="spinner"></div></div>
  }

  return (
    <div className="container">
      <Helmet>
        <title>{movie.title}</title>
        <meta name="description" content={`${movie.overview}`} />
      </Helmet>
      <div className="hero" style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')` }}>
        <div className="layer">
          <div className="row">
            <div className="col-md-4">
              <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} loading="lazy" />
            </div>
            <div className="d-flex align-items-center col-md-8">
              <div className="mt-5 descr">
                <h1>{movie.title} ({moment(movie.release_date).format("YYYY")})</h1>
                <p>{Math.floor(movie.runtime / 60)} h {movie.runtime % 60} m &nbsp;&nbsp;<span>&bull;</span>&nbsp;&nbsp;

               {moment(movie.release_date).format("DD MMMM YYYY")}
                 &nbsp;&nbsp;<span>&bull;</span>&nbsp;&nbsp; {movie.tagline} </p>

                <h3>Overview</h3>
                <p>{movie.overview}</p>
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
            <button className="nav-link md" id="crew-tab" data-bs-toggle="tab" data-bs-target="#crew" type="button" role="tab" aria-controls="crew" aria-selected="true">Crew</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link md" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Reviews ({reviews_loading ? '0' : reviews.length})</button>
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
                  credits.cast &&
                  credits.cast.map((item, index) => {
                    if (index < 6)
                      return (
                        <Cast key={index} cast={item} />
                      )
                  })
              }


            </div>
          </div>
          <div className="tab-pane mt-2" id="crew" role="tabpanel" aria-labelledby="crew-tab">
            <div className="row g-0">

              {
                cast_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                  credits.crew &&
                  credits.crew.map((item, index) => {
                    if (index < 10)
                      return (
                        <Crew key={index} crew={item} />
                      )
                  })
              }


            </div>
          </div>
          <div className="tab-pane  mt-5" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <div className="row g-0">

              {
                reviews_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                  reviews &&
                  reviews.map((item, index) => (
                    <Review key={index} item={item} />
                  ))
              }

            </div>
          </div>
          <div className="tab-pane  mt-5" id="contact" role="tabpanel" aria-labelledby="contact-tab">
            <div className="row g-0">
              {
                videos_loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}><div className="spinner"></div></div> :
                  videos &&
                  videos.map((item, index) => (
                    <Video key={index} video={item} />
                  ))

              }


            </div></div>
        </div>
      </section>













    </div>
  );
};

import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import MoviesContext from '../context/movies/moviesContext';
import Cast from './Cast';

export const Detail = () => {
  let { id } = useParams();
  const moviesContext = useContext(MoviesContext);
  const {
    getMovie,
    movie_loading,
    movie,
    getCast,
    cast_loading,
    cast
  } = moviesContext;


  useEffect(() => {
    getMovie(id);
    getCast(id);
  }, [id]);

  if (movie_loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}><div className="spinner"></div></div>
  }

  return (
    <div className="container">
      <div className="hero" style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')` }}>
        <div className="layer">
          <div className="row">
            <div className="col-md-4">
              <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} loading="lazy" />
            </div>
            <div className="d-flex align-items-center col-md-8">
              <div className="mt-5 descr">
                <h1>{movie.title} ({moment(movie.release_date).format("YYYY")})</h1>
                <p>   {movie.tagline} &nbsp;&nbsp;<span>&bull;</span>&nbsp;&nbsp;

               {moment(movie.release_date).format("DD MMMM YYYY")}
                 &nbsp;&nbsp;<span>&bull;</span>&nbsp;&nbsp;{Math.floor(movie.runtime / 60)} h {movie.runtime % 60} m</p>

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
            <button className="nav-link md" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Reviews</button>
          </li>
          {/* <li className="nav-item" role="presentation">
            <button className="nav-link md" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">TV</button>
          </li> */}
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
      </section>













    </div>
  );
};

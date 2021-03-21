import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export const Movie = ({ movie }) => {
  return (
    <div className="col-sm-4 col-md-3">
      <Link to={`/movie/${movie.id}`}>

        <div className="movie">
          <div className="poster">
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              width="100%"
              loading="lazy"
            />
          </div>
          <div className="details">
            <h4><span className="badge bg-light text-dark">{movie.original_language}</span> {movie.title}</h4>
            <div className="rate">
              <ion-icon name="star"></ion-icon>
              <p>{movie.vote_average * 10}% </p>
            </div>
            <div className="date">
              <p>{moment(movie.release_date).format("DD MMMM YYYY")}</p>
            </div>
          </div>
        </div>
      </Link>


    </div>
  );
};

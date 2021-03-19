import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export const Show = ({ show }) => {
  return (
    <div className="col-lg-2 col-md-3 col-sm-3 movie">
      <Link to={`/show/${show.id}`}>
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
            alt={show.name}
            width="100%"
          />
        </div>
        <div className="details">
          <h4>{show.name}</h4>
          <div className="rate">
            <ion-icon name="star"></ion-icon>
            <p>{show.vote_average * 10}% </p>
          </div>
          <div className="date">
            <p>
              First aired: {moment(show.first_air_date).format("DD MMMM YYYY")}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

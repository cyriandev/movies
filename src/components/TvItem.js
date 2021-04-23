import React from 'react'
import { Link } from "react-router-dom";
import moment from "moment";

const TvItem = ({ tv }) => {
    return (
        <div className="col-sm-4 col-md-3">
            <Link to={`/tv/${tv.id}/${tv.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`}>

                <div className="tv">
                    <div className="poster">
                        <img
                            src={`https://image.tmdb.org/t/p/original/${tv.poster_path}`}
                            alt={""}
                            width="100%"
                            loading="lazy"
                        />
                    </div>
                    <div className="details">
                        <h4><span className="badge bg-light text-dark">{tv.original_language}</span> {tv.name}</h4>

                        <div className="rate">
                            <ion-icon name="star"></ion-icon>
                            <p>{tv.vote_average * 10}% </p>
                        </div>
                        <div className="date">
                            <p>First aired: {moment(tv.first_air_date).format("DD MMMM YYYY")}</p>


                        </div>
                    </div>
                </div>
            </Link>


        </div>
    )
}

export default TvItem

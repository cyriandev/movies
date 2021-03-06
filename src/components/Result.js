import React from 'react'
import { Link } from 'react-router-dom'
import moment from "moment";

const Result = ({ item }) => {
    return (
        <div className="col-sm-4 col-md-3">
            <Link to={item.media_type === "movie" ? `/movie/${item.id}/${item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}` : `/tv/${item.id}/${item.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`}>

                <div className="movie">
                    <div className="poster">
                        {item.poster_path ?
                            <img
                                src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                                alt={""}
                                width="100%"
                                loading="lazy"
                            />
                            :
                            <div className="no_img">

                                <img src={`http://via.placeholder.com/318x476`} alt="no-image" loading="lazy" width="100%" />
                                <div className="image_icon d-flex align-items-center justify-content-center">
                                    <ion-icon name="image-outline"></ion-icon>
                                </div>
                            </div>
                        }

                    </div>
                    <div className="details">
                        {item.media_type === "tv" ? <h4><span className="badge bg-light text-dark">TV</span> {item.name}</h4> : <h4><span className="badge bg-light text-dark ">Movie</span> {item.title}</h4>}

                        <div className="rate">
                            <ion-icon name="star"></ion-icon>
                            <p>{item.vote_average * 10}% </p>
                        </div>
                        <div className="date">
                            {item.media_type === "tv" ? <p>First aired: {moment(item.first_air_date).format("DD MMMM YYYY")}</p> : <h4>    <p>{moment(item.release_date).format("DD MMMM YYYY")}</p></h4>}


                        </div>
                    </div>
                </div>
            </Link>


        </div>
    )
}

export default Result

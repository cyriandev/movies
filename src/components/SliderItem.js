import React from 'react'
import { Link } from "react-router-dom";
import moment from "moment";

const SliderItem = ({ item, index }) => {
    return (
        <div className={`carousel-item ${index === 0 && "active"}`}>
            <div className="slide-item" style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), url('https://image.tmdb.org/t/p/original/${item.backdrop_path}')`
            }}>
                <div className="slider">

                    <div className="info">
                        <span className="badge bg-light text-dark">Now Playing</span>
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
                        <div>

                            <Link to={`/movie/${item.id}/${item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`} className="cta mt-2"> <span style={{ marginRight: 3 }}>Learn More</span></Link>
                        </div>

                        <div className="controls mt-3 ">
                            <a href="#" className="mr-5" style={{ marginRight: 18 }} type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev"><ion-icon name="chevron-back-outline"></ion-icon></a>
                            <a href="#" className="" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next"><ion-icon name="chevron-forward-outline"></ion-icon></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SliderItem

import React from 'react'

const Cast = ({ cast }) => {
    return (
        <div className="col-md-2">
            <div className="cast">
                <div>
                    {cast.profile_path ?

                        <img src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt={cast.name} loading="lazy" width="100%" />
                        :
                        <div className="no_img">

                            <img src={`http://via.placeholder.com/318x476`} alt={cast.name} loading="lazy" width="100%" />
                            <div className="image_icon d-flex align-items-center justify-content-center">
                                <ion-icon name="image-outline"></ion-icon>
                            </div>
                        </div>
                    }
                </div>
                <div className="details">
                    <h4 style={{ marginBottom: 5 }}>{cast.name}</h4>
                    <div className="character">
                        <p>{cast.character}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cast

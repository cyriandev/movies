import React from 'react'

const Cast = ({ cast }) => {
    return (
        <div className="col-md-2">
            <div className="cast">
                <div>
                    <img src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt={cast.name} loading="lazy" width="100%" />

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

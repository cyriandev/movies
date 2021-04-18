import React from 'react'

const Crew = ({ crew }) => {
    return (
        <div className="col-md-2">
            <div className="cast ">
                <div className="details d-flex align-items-center" style={{ backgroundColor: 'rgb(36, 37, 38)' }}>
                    <div>

                        <ion-icon style={{ fontSize: 30, color: '#bdbdbd' }} name="person"></ion-icon>
                    </div>
                    <div style={{ marginLeft: 10 }}>
                        <h4 style={{ marginBottom: 5 }}>{crew.name}</h4>
                        <div className="character">
                            <p className="m-0">{crew.job}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Crew

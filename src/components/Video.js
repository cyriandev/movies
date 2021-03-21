import React from 'react'

const Video = ({ video }) => {
    return (
        <div className="col-md-3 vid">
            <a href='#' data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + video.id}>

                <div className="d-flex align-items-center">
                    <div>

                        <ion-icon name="play-circle-outline"></ion-icon>
                    </div>
                    <p>{video.name}</p>
                </div>
            </a>




            {/* <!-- Modal --> */}
            <div className="modal fade" id={"staticBackdrop" + video.id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{video.name}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <iframe title={video.name} width="100%" height="360" allowFullscreen="" src={`https://www.youtube.com/embed/${video.key}`}></iframe>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video

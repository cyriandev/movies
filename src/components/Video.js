import React, { useState } from 'react'
import Player from 'react-player/youtube'

const Video = ({ video }) => {

    const [playing, setPlaying] = useState(false)


    return (
        <div className="col-md-3 vid">
            <a onClick={() => setPlaying(true)} href='#' data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + video.id}>
                <div style={{ position: 'relative' }}>
                    <img src={`http://i3.ytimg.com/vi/${video.key}/maxresdefault.jpg`} alt="" width="100%" style={{ borderRadius: 3 }} />
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }}
                    >
                        <ion-icon name="play-circle-outline"></ion-icon>

                    </div>
                </div>
                {/* <div className="d-flex align-items-center">
                    <div>

                    </div>
                    <p>{video.name}</p>

                
                </div> */}
            </a>


            {/* <!-- Modal --> */}
            <div className="modal fade" id={"staticBackdrop" + video.id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{video.name}</h5>
                            <button onClick={() => setPlaying(false)} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Player url={`https://www.youtube.com/watch?v=${video.key}`} playing={playing} controls width="100%" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video

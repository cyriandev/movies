import React from 'react'
import Truncate from 'react-truncate';

import moment from "moment";
const Review = ({ item }) => {

    return (
        <div>
            <div className="review">
                <div className="d-flex align-items-center">
                    <div>
                        {item.author_details.avatar_path ?
                            <img src={item.author_details.avatar_path.includes("http") ? `${item.author_details.avatar_path.substring(1)}` : `https://image.tmdb.org/t/p/original/${item.author_details.avatar_path}`} alt="Avatar" className="avatar"></img>
                            :
                            <img src="http://via.placeholder.com/200x200" alt="Avatar" className="avatar"></img>
                        }
                    </div>
                    <h1 className="author">{item.author}</h1>
                </div>
                <p className="mt-2 review-date">{moment(item.created_at).format("DD MMMM YYYY")}</p>

                <p className="mt-3 review-content">

                    <Truncate lines={3} ellipsis={<span>... <a href='#' data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + item.id}>Read more</a></span>}>
                        {item.content}
                    </Truncate>

                </p>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" id={"staticBackdrop" + item.id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{item.author}'s Review</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {item.content}
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default Review

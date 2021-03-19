import React, { useContext, useEffect } from 'react'

import MoviesContext from '../context/movies/moviesContext';
import SwiperCore, { Virtual } from 'swiper';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

// install Virtual module
SwiperCore.use([Virtual]);

const Slide = () => {

    const moviesContext = useContext(MoviesContext);
    const { getPlaying, playing_loading, playing } = moviesContext;


    useEffect(() => {
        getPlaying();
    }, [])

    const slides = Array.from({ length: 1000 }).map(
        (el, index) => `Slide ${index + 1}`
    );

    if (playing_loading) {
        return <p>Loading</p>
    }

    return (
        <Swiper
            spaceBetween={2}
            slidesPerView={1}
        // virtual
        >
            {
                playing.map((item, index) => (<SwiperSlide>

                    <div className="slide-item" style={{ backgroundImage: "url('https://source.unsplash.com/random'), linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8),rgba(0,0,0,0.8))" }}>

                        <h1>
                            Raya and the Last Dragon
                                 </h1>
                        <h5>
                            1 h 47 m•03 March 2021•Animation, Adventure, Fantasy, Family, Action
                                 </h5>
                        <p>
                            Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
                                 </p>
                    </div>
                </SwiperSlide>))
            }
        </Swiper >
    )
}

export default Slide
// {
//     playing_loading ? "" :
//         playing.map((item, index) => {
//             <SwiperSlide key={item} virtualIndex={index}>
//                 <div className="slide-item" style={{ backgroundImage: "url('https://source.unsplash.com/random'), linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8),rgba(0,0,0,0.8))" }}>

//                     <h1>
//                         Raya and the Last Dragon
//                                 </h1>
//                     <h5>
//                         1 h 47 m•03 March 2021•Animation, Adventure, Fantasy, Family, Action
//                                 </h5>
//                     <p>
//                         Long ago, in the fantasy world of Kumandra, humans and dragons lived together in harmony. But when an evil force threatened the land, the dragons sacrificed themselves to save humanity. Now, 500 years later, that same evil has returned and it’s up to a lone warrior, Raya, to track down the legendary last dragon to restore the fractured land and its divided people.
//                                 </p>
//                 </div>
//             </SwiperSlide>
//         })
// }
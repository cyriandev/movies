import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

export const Detail = () => {
  const [movie, setMovie] = useState([]);
  const [trailar, setTrailar] = useState([]);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tloading, setTloading] = useState(true);
  const [cloading, setCloading] = useState(true);
  let { id } = useParams();
  useEffect(() => {
    try {
      const getMovie = async (id) => {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=1594420be7b6feaa53bb4b0ec89cbc07`
        );
        setMovie(res.data);
        setLoading(false);
        const res2 = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=1594420be7b6feaa53bb4b0ec89cbc07`
        );
        setTrailar(res2.data);
        setTloading(false);

        const res3 = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=1594420be7b6feaa53bb4b0ec89cbc07`
        );
        setCredits(res3.data);
        setCloading(false);
      };

      getMovie(id);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="splash-container splash">
        <div className="overlay"></div>
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          width="100%"
        />
        <div className="info">
          <h1>{movie.title}</h1>
          {/* <p className="tagline">{movie.tagline}</p> */}
          <p>{movie.overview}</p>
          {/* {t console.log(trailar.results)} */}
          {!tloading ? (
            <a
              href={`https://www.youtube.com/watch?v=${trailar.results[0].key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Watch Trailar
            </a>
          ) : (
            ""
          )}

          {/* <span>Available</span> */}

          <div className="foot-notes">
            <span>
              {Math.floor(movie.runtime / 60)} h {movie.runtime % 60} m
            </span>
            <span>&bull;</span>
            <span>{moment(movie.release_date).format("DD MMMM YYYY")}</span>
            <span>&bull;</span>
            {movie.genres.map((genre, index) => (
              <span key={genre.id}>{(index ? ", " : "") + genre.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container " style={{ marginTop: 50 }}>
        <h1 className="heading" style={{ marginTop: 10, marginBottom: 20 }}>
          Cast
        </h1>
        <div className="movie-container grid-cols-6 gap-2">
          {!cloading
            ? credits.cast.map((cast, index) => {
                if (index < 6)
                  return (
                    <div className="movie">
                      <div className="poster">
                        <img
                          src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`}
                          alt={cast.name}
                          width="100%"
                        />
                      </div>
                      <div className="details">
                        <h4 style={{ marginBottom: 5 }}>{cast.name}</h4>
                        <div className="character">
                          <p>{cast.character}</p>
                        </div>
                      </div>
                    </div>
                  );
              })
            : null}
        </div>
      </div>
    </>
  );
};

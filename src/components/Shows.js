import React, { useState, useEffect } from "react";
import axios from "axios";
import { Show } from "./Show";

export const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const getPopular = async () => {
        const res = await axios.get(
          "https://api.themoviedb.org/3/tv/popular?api_key=1594420be7b6feaa53bb4b0ec89cbc07"
        );
        setShows(res.data);
        setLoading(false);
      };

      getPopular();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ marginTop: 60 }}>
        <h1 className="heading" style={{ marginBottom: 30 }}>
          Tv Shows
        </h1>
        <div className="movie-container grid-cols-4 gap-2">
          <div className="movie" style={{ height: 500 }}></div>
          <div className="movie" style={{ height: 500 }}></div>
          <div className="movie" style={{ height: 500 }}></div>
          <div className="movie" style={{ height: 500 }}></div>
        </div>
      </div>
    );
  }
  return (
    <div className="container" style={{ marginTop: 60 }}>
      <h1 className="heading" style={{ marginBottom: 30 }}>
        Tv Shows
      </h1>
      <div className="movie-container grid-cols-4 gap-2">
        {shows.results.map(show => (
          <Show key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

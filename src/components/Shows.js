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
        <div className="row gap-2">
          <div className="col movie" style={{ height: 500 }}></div>
          <div className="col movie" style={{ height: 500 }}></div>
          <div className="col movie" style={{ height: 500 }}></div>
        </div>
      </div>
    );
  }
  return (
    <div className="container" style={{ marginTop: 60 }}>
      <h1 className="heading" style={{ marginBottom: 30 }}>
        Tv Shows
      </h1>
      <div className="row gap-2 justify-content-center">
        {shows.results.map(show => (
          <Show key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

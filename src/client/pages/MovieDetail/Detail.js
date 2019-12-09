import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router";
import {POSTER_BASE_URL} from "../../../lib/tmdb";
import './MovieDetail.css';
import axios from "axios";

function Detail(props) {
  const {
    isLoading,
    data,
    match
  } = props;

  const [movie, setMovie] = useState(parseInt(match.params.movieId) === data.id ? data : undefined);

  useEffect(() => {
    if (!movie) {
      axios.get(`/tmdb/movie/${match.params.movieId}`)
        .then(({data}) => {
          setMovie(data);
        });
    }
  });

  if (isLoading || !movie) {
    return <p>Loading...</p>;
  }

  console.log('########', movie);

  return (
    <div className="MovieDetail-main">
      <div className="MovieDetail-bg" style={{ display: 'flex', backgroundImage: `url(${POSTER_BASE_URL}/w92/${movie.poster_path})` }} />
      <div className="MovieDetail-content">
        <div style={{ display: 'flex' }}>
          <img style={{ width: '40%', height: 'calc(40% * 1.5)', maxWidth: 400, paddingRight: '5%' }} src={`${POSTER_BASE_URL}/w780/${movie.poster_path}`}/>
          <div>
            <h1 style={{ marginTop: 10 }}>{movie.original_title}</h1>
            <p>Release Date: {movie.release_date}</p>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Detail);
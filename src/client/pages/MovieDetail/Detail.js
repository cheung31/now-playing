import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';
import {POSTER_BASE_URL} from "../../../lib/tmdb";
import './MovieDetail.css';
import axios from "axios";

function Detail(props) {
  const {
    isLoading,
    data,
    match
  } = props;

  const [movie, setMovie] = useState(data && parseInt(match.params.movieId) === data.id ? data : undefined);

  useEffect(() => {
    if (!movie) {
      axios.get(`/tmdb/movie/${match.params.movieId}`)
        .then(({data}) => {
          setMovie(data);
        });
    }
  });

  if (isLoading || !movie) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  // console.log('########', movie);

  return (
    <div className="MovieDetail-main">
      <Helmet>
        <title>moviez - {movie.original_title}</title>
      </Helmet>
      <div className="MovieDetail-bg" style={{ display: 'flex', backgroundImage: `url(${POSTER_BASE_URL}/w92/${movie.poster_path})` }} />
      <div className="MovieDetail-content">
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%',  maxWidth: 400, paddingRight: '5%' }}>
            <img style={{ width: '100%' }} src={`${POSTER_BASE_URL}/w780/${movie.poster_path}`}/>
          </div>
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
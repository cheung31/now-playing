import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NowPlayingList() {
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    axios.get('/tmdb/movie/now_playing')
      .then(({ data }) => {
        setMoviesList([...moviesList, ...data.results]);
      });
  }, []);

  if (!moviesList.length) {
    return <p>Loading...</p>;
  }

  console.log(moviesList);
  return (
    <div>
      {
        moviesList.map(movie => {
          return <p key={movie.id}>{movie.original_title}</p>
        })
      }
    </div>
  );
}

function Blah() {
  if (true) {
    return <h3>wtf</h3>
  }
  return <h3>Blah blah</h3>
}

export default NowPlayingList;
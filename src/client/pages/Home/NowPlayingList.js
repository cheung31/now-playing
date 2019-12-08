import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NowPlayingList() {
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    axios.get('/tmdb/movie/now_playing')
      .then(moviesList => setMoviesList(moviesList));
  }, []);

  if (!moviesList.length) {
    return <p>Loading...</p>;
  }

  return (
    <div>
    </div>
  );
}

export default NowPlayingList;
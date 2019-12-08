import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';

const Row = ({ data, index, style }) => {
  let movie = data[index];
  return <div style={style}>{movie.original_title}</div>;
};

function NowPlayingList() {
  const [listHeight, setListHeight] = useState(0);
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    axios.get('/tmdb/movie/now_playing')
      .then(({ data }) => {
        setMoviesList([...moviesList, ...data.results]);
      });
  }, []);

  useEffect(() => {
    function handleWindowResize() {
      setListHeight(window.innerHeight - 120);
    }

    setListHeight(window.innerHeight - 120);
    window.addEventListener('resize', handleWindowResize);

    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  if (!moviesList.length) {
    return <p>Loading...</p>;
  }

  return (
    <List
      height={listHeight}
      itemCount={moviesList.length}
      itemData={moviesList}
      itemSize={35}
      width='100%'
    >
      {Row}
    </List>
  );
}

export default NowPlayingList;
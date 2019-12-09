import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { POSTER_BASE_URL } from '../../../lib/tmdb';

const Row = ({ data, index, style }) => {
  let movie = data[index];
  return <div style={{...style, display: 'flex', padding: '0 30px', alignItems: 'center', borderBottom: '1px solid #EEE' }}>
    <img src={`${POSTER_BASE_URL}${movie.poster_path}`} />
    <div style={{ marginLeft: 20 }}>
      <h3>{movie.original_title}</h3>
      <p>Release Date: {movie.release_date}</p>
    </div>
  </div>;
};

function NowPlayingList(props) {
  const {
    isLoading,
    data
  } = props;

  console.log('###', isLoading, data);

  const [listPage, setListPage] = useState(1);
  const [listHeight, setListHeight] = useState(0);
  const [moviesList, setMoviesList] = useState((data && data.results) || []);
  useEffect(() => {
    axios.get(`/tmdb/movie/now_playing?page=${listPage}`)
      .then(({ data }) => {
        setMoviesList([...moviesList, ...data.results]);
        setListPage(data.page);
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

  if (isLoading || !moviesList.length) {
    return <p>Loading...</p>;
  }

  return (
    <List
      height={listHeight}
      itemCount={moviesList.length}
      itemData={moviesList}
      itemSize={150}
      width='100%'
    >
      {Row}
    </List>
  );
}

export default NowPlayingList;
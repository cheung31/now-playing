import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FixedSizeList as List, FixedSizeGrid as Grid } from 'react-window';
import { POSTER_BASE_URL } from '../../../lib/tmdb';

const Row = ({ data, index, style }) => {
  let movie = data[index];
  return <div style={{...style, display: 'flex', padding: '0 30px', alignItems: 'center', borderBottom: '1px solid #EEE' }}>
    <img src={`${POSTER_BASE_URL}/w92/${movie.poster_path}`} />
    <div style={{ marginLeft: 20 }}>
      <h3>{movie.original_title}</h3>
      <p>Release Date: {movie.release_date}</p>
    </div>
  </div>;
};

const Cell = ({ data, columnIndex, rowIndex, style, columnCount}) => {
  let movie = data[(rowIndex * columnCount) + columnIndex];
  return <div style={{...style, display: 'flex'}}>
    <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
      <img style={{ width: style.width, height: style.width * 1.5 }} src={`${POSTER_BASE_URL}/w780/${movie.poster_path}`}/>
      <div style={{ textAlign: 'center' }}>
        <h3>{movie.original_title}</h3>
        <p>Release Date: {movie.release_date}</p>
      </div>
    </div>
  </div>
};

function NowPlayingList(props) {
  const {
    isLoading,
    data
  } = props;

  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [listPage, setListPage] = useState(1);
  const [listHeight, setListHeight] = useState(0);
  const [gridWidth, setGridWidth] = useState(768);
  const [gridColumnCount, setGridColumnCount] = useState(3);
  const [moviesList, setMoviesList] = useState((data && data.results) || []);
  useEffect(() => {
    if (!data) {
      axios.get(`/tmdb/movie/now_playing?page=${listPage}`)
        .then(({data}) => {
          setMoviesList([...moviesList, ...data.results]);
          setListPage(data.page);
        });
    }
  }, []);
  useEffect(() => {
    function handleWindowResize() {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;
      setIsMobileViewport(innerWidth < 768);
      setListHeight(innerHeight - 120);
      setGridWidth(innerWidth);
      setGridColumnCount(innerWidth >= 1024 ? 4 : 3)
    }

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  if (isLoading || !moviesList.length) {
    return <p>Loading...</p>;
  }

  return isMobileViewport
    ? <List
      width='100%'
      height={listHeight}
      itemCount={moviesList.length}
      itemData={moviesList}
      itemSize={150}
      onItemsRendered={({visibleStartIndex}) => setVisibleStartIndex(visibleStartIndex)}
    >
      {Row}
    </List>
    : <Grid
      width={gridWidth}
      height={listHeight}
      columnCount={gridColumnCount}
      columnWidth={gridWidth / gridColumnCount}
      rowCount={Math.ceil(moviesList.length / gridColumnCount)}
      rowHeight={(gridWidth / gridColumnCount) * 1.8}
      itemData={moviesList}
    >
      {withColumnCount(Cell, gridColumnCount)}
    </Grid>;
}

function withColumnCount(Component, columnCount) {
  return (props) => {
    return <Component
      columnCount={columnCount}
      {...props}
    />
  };
}

export default NowPlayingList;
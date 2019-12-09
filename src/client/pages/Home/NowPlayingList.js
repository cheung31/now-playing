import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FixedSizeList as List, FixedSizeGrid as Grid } from 'react-window';
import { POSTER_BASE_URL } from '../../../lib/tmdb';

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;
const DESKTOP_WIDTH = 1200;

const listRef = React.createRef();
const gridRef = React.createRef();

const Row = ({ data, index, style }) => {
  let movie = data[index];
  return <div className="Movie-row" style={{...style, display: 'flex', alignItems: 'center' }}>
    <img src={`${POSTER_BASE_URL}/w92/${movie.poster_path}`} />
    <div className="Movie-description" style={{ marginLeft: 20 }}>
      <h3>{movie.original_title}</h3>
      <p>Release Date: {movie.release_date}</p>
    </div>
  </div>;
};

const Cell = ({ data, columnIndex, rowIndex, style, columnCount}) => {
  let movie = data[(rowIndex * columnCount) + columnIndex];
  let cellPadding = 10;
  let posterWidth = style.width - (2 * cellPadding);
  return <div style={{...style, display: 'flex', padding: cellPadding }}>
    {
      movie
        ? <div className="Movie-cell" style={{display: 'flex', flex: 1, flexDirection: 'column', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
          <img style={{ width: posterWidth, height: posterWidth * 1.5 }} src={`${POSTER_BASE_URL}/w780/${movie.poster_path}`}/>
          <div className="Movie-description" style={{ display: 'flex', flex: 1, flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
            <h3>{movie.original_title}</h3>
            <p>Release Date: {movie.release_date}</p>
          </div>
        </div>
        : null
    }
  </div>
};

function NowPlayingList(props) {
  const {
    isLoading,
    data
  } = props;

  const [didSwitchListType, setDidSwitchListType] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [listPage, setListPage] = useState(1);
  const [listHeight, setListHeight] = useState(0);
  const [gridWidth, setGridWidth] = useState(MOBILE_WIDTH);
  const [gridColumnCount, setGridColumnCount] = useState(3);
  const [moviesList, setMoviesList] = useState((data && data.results) || []);
  useEffect(() => {
    if (!moviesList || !moviesList.length) {
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
      setDidSwitchListType(isMobileViewport !== (innerWidth < MOBILE_WIDTH));
      setIsMobileViewport(innerWidth < MOBILE_WIDTH);
      setListHeight(innerHeight - 120);
      setGridWidth(innerWidth);

      let columnCount;
      if (innerWidth < TABLET_WIDTH) {
        columnCount = 3;
      } else if (innerWidth < DESKTOP_WIDTH) {
        columnCount = 4;
      } else {
        columnCount = 5;
      }
      setGridColumnCount(columnCount);
    }

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', handleWindowResize);
    };
  });
  useEffect(() => {
    if (didSwitchListType && isMobileViewport && listRef.current) {
      listRef.current.scrollToItem(visibleStartIndex, 'start');
    }
    if (didSwitchListType && !isMobileViewport && gridRef.current) {
      gridRef.current.scrollToItem({
        align: 'start',
        columnIndex: visibleStartIndex % 3,
        rowIndex: Math.floor(visibleStartIndex / gridColumnCount)
      });
    }
  });

  if (isLoading || !moviesList.length) {
    return <p>Loading...</p>;
  }

  return isMobileViewport
    ? <List
      ref={listRef}
      width='100%'
      height={listHeight}
      itemCount={moviesList.length}
      itemData={moviesList}
      itemSize={138}
      onItemsRendered={({visibleStartIndex}) => {
        if (!didSwitchListType && !isNaN(visibleStartIndex)) {
          setVisibleStartIndex(visibleStartIndex)
        }
      }}
    >
      {Row}
    </List>
    : <Grid
      ref={gridRef}
      width={gridWidth}
      height={listHeight}
      columnCount={gridColumnCount}
      columnWidth={gridWidth / gridColumnCount}
      rowCount={Math.ceil(moviesList.length / gridColumnCount)}
      rowHeight={(gridWidth / gridColumnCount) * 1.8}
      itemData={moviesList}
      onItemsRendered={({visibleColumnStartIndex, visibleRowStartIndex}) => {
        if (!didSwitchListType && !isNaN(visibleColumnStartIndex) && !isNaN(visibleRowStartIndex)) {
          let index = (visibleRowStartIndex * gridColumnCount) + visibleColumnStartIndex;
          setVisibleStartIndex(index);
        }
      }}
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
import axios from 'axios';

const POSTER_BASE_URL= 'http://image.tmdb.org/t/p';
const BASE_URL = 'https://api.themoviedb.org/3';

function getNowPlayingList({ page }) {
  return axios.get(`${BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&page=${page}`)
    .then(({ data }) => data);
}

function getMovieDetails(movieId) {
  return axios.get(`${BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`)
    .then(({ data }) => data);
}

export {
  POSTER_BASE_URL,
  BASE_URL,
  getNowPlayingList,
  getMovieDetails,
}
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

function getNowPlayingList() {
  return axios.get(`${BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`)
    .then(({ data }) => data);
}

function getMovieDetails() {
  return axios.get(`${BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`)
    .then(({ data }) => data);
}

export {
  getNowPlayingList,
  getMovieDetails,
}
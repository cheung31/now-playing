import axios from 'axios';

function getMoviesNowPlaying() {
  axios.get('/user?ID=12345')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

function getMovieDetails() {
}

export {
    getMoviesNowPlaying,
    getMovieDetails
}

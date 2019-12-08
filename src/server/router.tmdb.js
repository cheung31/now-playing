import { Router } from 'express';
import { getNowPlayingList, getMovieDetails } from '../lib/tmdb';

let tmdbRouter = Router();

tmdbRouter.get('/movie/now_playing', (req, res) => {
  getNowPlayingList({ page: req.query.page || 1 })
    .then(data => res.json(data));
});

tmdbRouter.get('/movie/:movieId', (req, res) => {
  getMovieDetails()
    .then(data => res.json(data));
});

export default tmdbRouter;
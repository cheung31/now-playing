import Home from './client/pages/Home';
import MovieDetail from './client/pages/MovieDetail';
import NoMatchPage from './client/pages/NoMatchPage';

const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home',
    exact: true,
  },
  {
    path: '/movies/:movieId',
    component: MovieDetail,
    name: 'MovieDetail',
    exact: true,
  },
  {
    component: NoMatchPage,
    name: 'NoMatchPage',
  }
];

export default routes;
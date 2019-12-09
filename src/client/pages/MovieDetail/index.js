import React from 'react';
import withSSR from '../../components/withSSR';
import {getMovieDetails} from '../../../lib/tmdb';
import Detail from './Detail';
import './MovieDetail.css';

class MovieDetail extends React.Component {
  static getInitialData({ match, req, res }) {
    return getMovieDetails(match.params.movieId)
      .then(data => ({ data }));
  }

  render() {
    const {
      data
    } = this.props;
    let movie = data;

    return (
      <div className="MovieDetail">
        <div className="Home-header">
          <h2>moviez</h2>
        </div>
        <div className="MovieDetail-main">
          <Detail
            data={movie}
          />
        </div>
      </div>
    );
  }
}

export default withSSR(MovieDetail);

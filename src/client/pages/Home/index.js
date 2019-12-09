import React from 'react';
import NowPlayingList from './NowPlayingList';
import withSSR from '../../components/withSSR';
import { getNowPlayingList } from '../../../lib/tmdb';
import './Home.css';

class Home extends React.Component {
  static getInitialData({ match, req, res }) {
    return getNowPlayingList({ page: 1 })
      .then(data => ({ data }));
  }

  render() {
    const {
      isLoading,
      data
    } = this.props;

    return (
      <div className="Home">
        <div className="Home-header">
          <h2>moviez</h2>
          <h3>Now Playing</h3>
        </div>
        <div className="Home-main">
          <NowPlayingList
            isLoading={isLoading}
            data={data}
          />
        </div>
      </div>
    );
  }
}

export default withSSR(Home);

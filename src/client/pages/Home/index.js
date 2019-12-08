import React from 'react';
import './Home.css';
import NowPlayingList from './NowPlayingList';

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <h2>moviez</h2>
          <h3>Now Playing</h3>
        </div>
        <div className="Home-main">
          <NowPlayingList />
        </div>
      </div>
    );
  }
}

export default Home;

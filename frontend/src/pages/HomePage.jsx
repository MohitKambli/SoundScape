import React, { useState } from 'react';
import TrendingSongs from '../components/TrendingSongs';
import SongSearch from '../components/SongSearch';

const HomePage = () => {
  const [activePage, setActivePage] = useState('trending');

  return (
    <div>
      <h1>SoundScape</h1>
      <div>
        <button onClick={() => setActivePage('trending')}>Trending Songs</button>
        <button onClick={() => setActivePage('search')}>Search A Song</button>
      </div>
      
      <div>
        {activePage === 'trending' && <TrendingSongs />}
        {activePage === 'search' && <SongSearch />}
      </div>
    </div>
  );
};

export default HomePage;

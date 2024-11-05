import React, { useState } from 'react';
import TrendingSongs from '../components/TrendingSongs';
import SongSearch from '../components/SongSearch';
import './HomePage.css';

const HomePage = () => {
  const [activePage, setActivePage] = useState('trending');

  return (
    <div className="homepage-container">
      <h1 className="app-title">SoundScape</h1>
      
      <div className="nav-links">
        <span 
          className={`nav-link ${activePage === 'trending' ? 'active' : ''}`} 
          onClick={() => setActivePage('trending')}
        >
          Trending Songs
        </span>
        <span 
          className={`nav-link ${activePage === 'search' ? 'active' : ''}`} 
          onClick={() => setActivePage('search')}
        >
          Search A Song
        </span>
      </div>

      <div className="content-container">
        {activePage === 'trending' && <TrendingSongs />}
        {activePage === 'search' && <SongSearch />}
      </div>
    </div>
  );
};

export default HomePage;

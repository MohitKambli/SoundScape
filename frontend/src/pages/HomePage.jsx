import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingSongs from '../components/TrendingSongs';
import SongSearch from '../components/SongSearch';
import LikedSongs from '../components/LikedSongs';
import './HomePage.css';

const HomePage = () => {
  const [activePage, setActivePage] = useState('trending');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/');
  };

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
        <span 
          className={`nav-link ${activePage === 'liked' ? 'active' : ''}`} 
          onClick={() => setActivePage('liked')}
        >
          Liked Songs
        </span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="content-container">
        {activePage === 'trending' && <TrendingSongs />}
        {activePage === 'search' && <SongSearch />}
        {activePage === 'liked' && <LikedSongs />}
      </div>
    </div>
  );
};

export default HomePage;

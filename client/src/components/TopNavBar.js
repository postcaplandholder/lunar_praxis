// src/components/TopNavBar.js
import React from 'react';
import '../styles/TopNavBar.css';

const TopNavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">Lunar Praxis</div>
      <div className="navbar-right">
        <a href="#account">Account</a>
      </div>
    </nav>
  );
};

export default TopNavBar;

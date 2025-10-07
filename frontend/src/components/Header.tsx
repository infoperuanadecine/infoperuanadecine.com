import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Info Peruana de Cine</h1>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/admin">Admin</a>
        </nav>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
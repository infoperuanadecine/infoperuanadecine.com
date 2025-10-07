import React from 'react';
import './Header.css';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, viewMode, onViewModeChange }) => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">INFO PERUANA DE CINE</h1>
        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => onViewModeChange('grid')}
            >
              🎬 Galería
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => onViewModeChange('list')}
            >
              📋 Lista
            </button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar películas..."
              onChange={(e) => onSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
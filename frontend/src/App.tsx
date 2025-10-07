import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import MovieGrid from './components/MovieGrid';
import MovieList from './components/MovieList';

interface Movie {
  _id: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  poster_url: string;
  google_drive_link: string;
  letterboxd_url?: string;
  runtime?: number;
  description: string;
  available?: boolean;
  status?: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      movie.available !== false  // Only show available movies (defaults to true)
    );
    setFilteredMovies(filtered);
  }, [movies, searchTerm]);

  const fetchMovies = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/movies`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Cargando películas...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        onSearch={handleSearch}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      <main>
        {viewMode === 'grid' ? (
          <MovieGrid movies={filteredMovies} />
        ) : (
          <MovieList movies={filteredMovies} />
        )}
      </main>
    </div>
  );
}

export default App;
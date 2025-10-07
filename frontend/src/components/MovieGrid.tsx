import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieGrid.css';

interface Movie {
  _id: string;
  title: string;
  year: number;
  poster_url: string;
  google_drive_link: string;
  genres: string[];
  description: string;
}

const MovieGrid: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Use environment variable for API URL or fallback to relative path
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/movies`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="movie-grid-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="movie-grid">
        {filteredMovies.map(movie => (
          <div key={movie._id} className="movie-card">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="movie-poster"
              loading="lazy"
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-year">{movie.year}</p>
              <div className="movie-genres">
                {movie.genres.map(genre => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>
              <a
                href={movie.google_drive_link}
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn"
              >
                Descargar Película
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
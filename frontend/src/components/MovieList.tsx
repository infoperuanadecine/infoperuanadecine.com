import React from 'react';
import './MovieList.css';

interface Movie {
  _id: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  google_drive_link: string;
  letterboxd_url?: string;
  runtime?: number;
  description: string;
  available?: boolean;
  status?: string;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <div className="movie-list">
      <div className="list-header">
        <div className="header-pelicula">Película</div>
        <div className="header-year">Año</div>
        <div className="header-length">Duración</div>
        <div className="header-director">Director</div>
        <div className="header-actions">Acciones</div>
      </div>
      {movies.map(movie => (
        <div key={movie._id} className="movie-row">
          <div className="movie-pelicula">{movie.title}</div>
          <div className="movie-year">{movie.year}</div>
          <div className="movie-length">{movie.runtime ? `${movie.runtime} min` : 'N/A'}</div>
          <div className="movie-director">{movie.director}</div>
          <div className="movie-actions">
            <a
              href={movie.google_drive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn download-btn"
            >
              📥 Descargar
            </a>
            <a
              href={movie.letterboxd_url || `https://letterboxd.com/search/${encodeURIComponent(movie.title)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn letterboxd-btn"
            >
              📽️ Letterboxd
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
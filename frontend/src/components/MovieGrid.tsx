import React from 'react';
import './MovieGrid.css';

interface Movie {
  _id: string;
  title: string;
  year: number;
  poster_url: string;
  google_drive_link: string;
  letterboxd_url?: string;
  runtime?: number;
  genres: string[];
  description: string;
  available?: boolean;
  status?: string;
}

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {

  return (
    <div className="movie-grid-container">
      <div className="movie-grid">
        {movies.map(movie => (
          <div key={movie._id} className="movie-card">
            {movie.poster_url && movie.poster_url !== "https://image.tmdb.org/t/p/w500/placeholder.jpg" ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="movie-poster"
                loading="lazy"
              />
            ) : (
              <div className="movie-poster">
                {movie.title}
              </div>
            )}
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-year-runtime">
                <span className="movie-year">{movie.year}</span>
                <span className="runtime-tag">⏱️ {movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
              </div>
              <div className="movie-buttons">
                <a
                  href={movie.google_drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  📥 Descargar
                </a>
                <a
                  href={movie.letterboxd_url || `https://letterboxd.com/search/${encodeURIComponent(movie.title)}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="letterboxd-btn"
                >
                  📽️ Letterboxd
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
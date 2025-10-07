import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MoviePlayer.css';

interface Movie {
  _id: string;
  title: string;
  year: number;
  poster_url: string;
  google_drive_link: string;
  genres: string[];
  description: string;
}

const MoviePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMovie(id);
    }
  }, [id]);

  const fetchMovie = async (movieId: string) => {
    try {
      const response = await axios.get(`/api/movies/${movieId}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando película...</div>;
  }

  if (!movie) {
    return <div className="error">Película no encontrada</div>;
  }

  const embedUrl = movie.google_drive_link.replace('/view?usp=sharing', '/preview');

  return (
    <div className="movie-player-container">
      <div className="movie-header">
        <h1>{movie.title} ({movie.year})</h1>
        <div className="movie-meta">
          <div className="genres">
            {movie.genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="video-container">
        <iframe
          src={embedUrl}
          width="100%"
          height="500"
          allow="autoplay"
          allowFullScreen
          title={movie.title}
        ></iframe>
      </div>
      
      <div className="movie-description">
        <h3>Sinopsis</h3>
        <p>{movie.description}</p>
      </div>
    </div>
  );
};

export default MoviePlayer;
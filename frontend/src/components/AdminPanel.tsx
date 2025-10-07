import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

interface Movie {
  _id?: string;
  title: string;
  year: number;
  poster_url: string;
  google_drive_link: string;
  genres: string[];
  description: string;
}

const AdminPanel: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    title: '',
    year: new Date().getFullYear(),
    poster_url: '',
    google_drive_link: '',
    genres: [],
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tmdbApiKey, setTmdbApiKey] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/movies`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchMovieData = async () => {
    if (!newMovie.title || !tmdbApiKey) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(newMovie.title)}&year=${newMovie.year}`
      );
      
      if (response.data.results.length > 0) {
        const movieData = response.data.results[0];
        setNewMovie(prev => ({
          ...prev,
          poster_url: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
          description: movieData.overview,
          genres: movieData.genre_ids.map((id: number) => getGenreName(id))
        }));
      }
    } catch (error) {
      console.error('Error fetching TMDb data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGenreName = (id: number): string => {
    const genres: { [key: number]: string } = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };
    return genres[id] || 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      await axios.post(`${apiUrl}/api/movies`, newMovie);
      setNewMovie({
        title: '',
        year: new Date().getFullYear(),
        poster_url: '',
        google_drive_link: '',
        genres: [],
        description: ''
      });
      fetchMovies();
      alert('Película agregada exitosamente!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error agregando película');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Add Movie</h2>
      
      <form onSubmit={handleSubmit} className="movie-form">
        <div className="form-group">
          <label>TMDb API Key:</label>
          <input
            type="text"
            value={tmdbApiKey}
            onChange={(e) => setTmdbApiKey(e.target.value)}
            placeholder="Enter your TMDb API key"
            required
          />
        </div>

        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Year:</label>
          <input
            type="number"
            value={newMovie.year}
            onChange={(e) => setNewMovie({ ...newMovie, year: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <button type="button" onClick={fetchMovieData} disabled={isLoading}>
            {isLoading ? 'Fetching...' : 'Fetch Movie Data from TMDb'}
          </button>
        </div>

        <div className="form-group">
          <label>Google Drive Link:</label>
          <input
            type="url"
            value={newMovie.google_drive_link}
            onChange={(e) => setNewMovie({ ...newMovie, google_drive_link: e.target.value })}
            placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
            required
          />
        </div>

        <div className="form-group">
          <label>Poster URL:</label>
          <input
            type="url"
            value={newMovie.poster_url}
            onChange={(e) => setNewMovie({ ...newMovie, poster_url: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={newMovie.description}
            onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
            rows={4}
          />
        </div>

        <button type="submit" className="submit-btn">Add Movie</button>
      </form>

      <div className="movies-list">
        <h3>Existing Movies ({movies.length})</h3>
        {movies.map(movie => (
          <div key={movie._id} className="movie-item">
            <img src={movie.poster_url} alt={movie.title} width="50" />
            <span>{movie.title} ({movie.year})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
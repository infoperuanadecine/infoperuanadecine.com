// TMDB Poster API Endpoint
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "dec9b4176986e6d1333c7b017cca6488";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db('moviedb');
  }
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client.db('moviedb');
}

async function searchMovieOnTMDB(title, year) {
  try {
    const cleanTitle = title.replace(/\([^)]*\)/g, '').trim();
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&year=${year}&language=es`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      let movie = data.results.find(m => 
        m.release_date && 
        new Date(m.release_date).getFullYear() === year
      );
      
      if (!movie) {
        movie = data.results[0];
      }
      
      if (movie.poster_path) {
        return {
          poster_url: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
          tmdb_id: movie.id,
          tmdb_title: movie.title,
          tmdb_overview: movie.overview
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching TMDB for "${title}":`, error.message);
    return null;
  }
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();
    
    if (req.method === 'POST') {
      // Update single movie poster
      const { movieId } = req.body;
      
      if (!movieId) {
        return res.status(400).json({ error: 'Movie ID required' });
      }
      
      const movie = await db.collection('movies').findOne({ _id: movieId });
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      
      const tmdbData = await searchMovieOnTMDB(movie.title, movie.year);
      
      if (tmdbData) {
        await db.collection('movies').updateOne(
          { _id: movieId },
          { 
            $set: { 
              poster_url: tmdbData.poster_url,
              tmdb_id: tmdbData.tmdb_id
            }
          }
        );
        
        return res.json({ 
          success: true, 
          poster_url: tmdbData.poster_url,
          message: `Poster updated for ${movie.title}`
        });
      } else {
        return res.json({ 
          success: false, 
          message: `No poster found for ${movie.title}`
        });
      }
    }
    
    if (req.method === 'GET') {
      // Get movies without posters
      const moviesWithoutPosters = await db.collection('movies')
        .find({
          $or: [
            { poster_url: { $exists: false } },
            { poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg" },
            { poster_url: { $regex: /placeholder/ } }
          ]
        })
        .toArray();
      
      return res.json({ 
        movies: moviesWithoutPosters,
        count: moviesWithoutPosters.length
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('TMDB API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
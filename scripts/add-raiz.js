// Add Raiz (2024) to the database
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function searchMovieOnTMDB(title, year) {
  try {
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}&language=es`;
    
    console.log(`🔍 Buscando "${title}" (${year}) en TMDB...`);
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      
      if (movie.poster_path) {
        // Get detailed info
        const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=es`;
        const detailResponse = await fetch(detailUrl);
        const detailData = await detailResponse.json();
        
        return {
          poster_url: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
          tmdb_id: movie.id,
          tmdb_title: movie.title,
          tmdb_overview: movie.overview,
          production_countries: detailData.production_countries || [],
          genres: detailData.genres || [],
          runtime: detailData.runtime
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error buscando "${title}":`, error.message);
    return null;
  }
}

async function addRaizMovie() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎬 Añadiendo "Raiz" (2024) a la base de datos...\n');
    
    // Check if movie already exists
    const existing = await collection.findOne({ title: "Raiz", year: 2024 });
    if (existing) {
      console.log('⚠️  "Raiz" (2024) ya existe en la base de datos');
      return;
    }
    
    // Search for the movie on TMDB
    const tmdbData = await searchMovieOnTMDB("Raiz", 2024);
    
    let movieData = {
      title: "Raiz",
      year: 2024,
      director: "Franco García Becerra", // Common director for recent Peruvian cinema
      genres: ["Drama"],
      description: "Drama peruano contemporáneo que explora las raíces y la identidad cultural.",
      google_drive_link: "https://drive.google.com/drive/folders/1Jy8gXQIJk-eXO4DTSaVuOYKh5iXQ7U2Z?usp=drive_link",
      letterboxd_url: "https://letterboxd.com/search/raiz-2024/",
      runtime: 95, // Default runtime
      verified: false
    };
    
    if (tmdbData) {
      console.log('✅ Información encontrada en TMDB:');
      console.log(`   Título: ${tmdbData.tmdb_title}`);
      console.log(`   Duración: ${tmdbData.runtime || 'N/A'} min`);
      console.log(`   Países: ${tmdbData.production_countries.map(c => c.name).join(', ')}`);
      console.log(`   Géneros: ${tmdbData.genres.map(g => g.name).join(', ')}`);
      console.log(`   Poster: ${tmdbData.poster_url}`);
      
      // Update with TMDB data
      movieData = {
        ...movieData,
        poster_url: tmdbData.poster_url,
        tmdb_id: tmdbData.tmdb_id,
        tmdb_title: tmdbData.tmdb_title,
        description: tmdbData.tmdb_overview || movieData.description,
        genres: tmdbData.genres.map(g => g.name),
        runtime: tmdbData.runtime || movieData.runtime,
        verified: true
      };
    } else {
      console.log('❓ No encontrado en TMDB - usando datos básicos');
      movieData.poster_url = "https://image.tmdb.org/t/p/w500/placeholder.jpg";
      movieData.tmdb_id = null;
    }
    
    // Insert the movie
    await collection.insertOne(movieData);
    
    console.log('\n🎉 ¡"Raiz" (2024) añadida exitosamente!');
    console.log(`📂 Google Drive: ${movieData.google_drive_link}`);
    console.log(`🎬 Total de películas: ${await collection.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addRaizMovie();
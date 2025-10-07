// TMDB Poster Fetching Script
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Function to search movie on TMDB
async function searchMovieOnTMDB(title, year) {
  try {
    // Clean title for better search results
    const cleanTitle = title.replace(/\([^)]*\)/g, '').trim();
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&year=${year}&language=es`;
    
    console.log(`🔍 Buscando: "${cleanTitle}" (${year})`);
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Try to find exact match first, then closest match
      let movie = data.results.find(m => 
        m.release_date && 
        new Date(m.release_date).getFullYear() === year
      );
      
      // If no exact year match, take the first result
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
    console.error(`❌ Error buscando "${title}":`, error.message);
    return null;
  }
}

// Main function to update all movie posters
async function updateMoviePosters() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎬 Iniciando búsqueda de posters en TMDB...\n');
    
    // Get all movies from database
    const movies = await collection.find({}).toArray();
    
    let foundCount = 0;
    let notFoundCount = 0;
    
    for (const movie of movies) {
      // Skip if already has a real poster (not placeholder)
      if (movie.poster_url && 
          movie.poster_url !== "https://image.tmdb.org/t/p/w500/placeholder.jpg" &&
          !movie.poster_url.includes('placeholder')) {
        console.log(`⏭️  ${movie.title} - Ya tiene poster`);
        continue;
      }
      
      // Search on TMDB
      const tmdbData = await searchMovieOnTMDB(movie.title, movie.year);
      
      if (tmdbData) {
        // Update movie with poster and TMDB data
        await collection.updateOne(
          { _id: movie._id },
          { 
            $set: { 
              poster_url: tmdbData.poster_url,
              tmdb_id: tmdbData.tmdb_id,
              tmdb_title: tmdbData.tmdb_title,
              tmdb_overview: tmdbData.tmdb_overview || movie.description
            }
          }
        );
        
        console.log(`✅ ${movie.title} - Poster encontrado!`);
        console.log(`   🔗 ${tmdbData.poster_url}\n`);
        foundCount++;
      } else {
        console.log(`❌ ${movie.title} - No encontrado en TMDB\n`);
        notFoundCount++;
      }
      
      // Add delay to respect TMDB rate limits (40 requests per 10 seconds)
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n🎉 ¡Búsqueda completada!');
    console.log(`✅ Posters encontrados: ${foundCount}`);
    console.log(`❌ No encontrados: ${notFoundCount}`);
    console.log(`📊 Tasa de éxito: ${((foundCount / (foundCount + notFoundCount)) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await client.close();
  }
}

// Run the script
updateMoviePosters();
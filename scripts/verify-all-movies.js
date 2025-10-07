// Script to verify all movies are real and update posters to English versions
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Known English titles for Peruvian movies
const englishTitleMappings = {
  "La Teta Asustada": "The Milk of Sorrow",
  "Undertow (Contracorriente)": "Undertow",
  "Wiñaypacha": "Winaypacha",
  "No se lo digas a nadie": "Don't Tell Anyone"
};

async function searchMovieOnTMDB(title, year, useEnglish = false) {
  try {
    let searchTitle = title;
    
    // Use English title if mapping exists and useEnglish is true
    if (useEnglish && englishTitleMappings[title]) {
      searchTitle = englishTitleMappings[title];
    }
    
    const cleanTitle = searchTitle.replace(/\([^)]*\)/g, '').trim();
    const language = useEnglish ? 'en' : 'es';
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&year=${year}&language=${language}`;
    
    console.log(`🔍 Buscando: "${cleanTitle}" (${year}) [${language.toUpperCase()}]`);
    
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
        // Get additional details
        const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en`;
        const detailResponse = await fetch(detailUrl);
        const detailData = await detailResponse.json();
        
        return {
          poster_url: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
          tmdb_id: movie.id,
          tmdb_title: movie.title,
          tmdb_overview: movie.overview,
          production_countries: detailData.production_countries || [],
          original_language: detailData.original_language,
          genres: detailData.genres || [],
          isVerified: true
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error buscando "${title}":`, error.message);
    return null;
  }
}

async function verifyAndUpdateMovies() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎬 Verificando autenticidad de películas peruanas y actualizando posters...\n');
    
    const movies = await collection.find({}).toArray();
    
    let verifiedCount = 0;
    let suspiciousCount = 0;
    let updatedPosters = 0;
    
    for (const movie of movies) {
      console.log(`\n📽️ Verificando: "${movie.title}" (${movie.year})`);
      
      // First try Spanish search
      let tmdbData = await searchMovieOnTMDB(movie.title, movie.year, false);
      
      // If not found, try English search
      if (!tmdbData) {
        tmdbData = await searchMovieOnTMDB(movie.title, movie.year, true);
      }
      
      if (tmdbData) {
        // Check if it's actually Peruvian
        const isPeru = tmdbData.production_countries.some(country => 
          country.iso_3166_1 === 'PE' || country.name === 'Peru'
        );
        
        const isSpanish = tmdbData.original_language === 'es' || tmdbData.original_language === 'qu';
        
        console.log(`   🏛️ Países de producción: ${tmdbData.production_countries.map(c => c.name).join(', ')}`);
        console.log(`   🗣️ Idioma original: ${tmdbData.original_language}`);
        console.log(`   🎭 Géneros: ${tmdbData.genres.map(g => g.name).join(', ')}`);
        
        if (isPeru) {
          console.log(`   ✅ VERIFICADO - Película peruana auténtica`);
          verifiedCount++;
          
          // Update with better data and English poster if available
          const updateData = {
            poster_url: tmdbData.poster_url,
            tmdb_id: tmdbData.tmdb_id,
            tmdb_title: tmdbData.tmdb_title,
            verified: true,
            production_countries: tmdbData.production_countries,
            original_language: tmdbData.original_language
          };
          
          // Update description if TMDB has a better one
          if (tmdbData.tmdb_overview && tmdbData.tmdb_overview.length > movie.description.length) {
            updateData.description = tmdbData.tmdb_overview;
          }
          
          await collection.updateOne(
            { _id: movie._id },
            { $set: updateData }
          );
          
          updatedPosters++;
          console.log(`   🔄 Poster actualizado`);
        } else if (isSpanish) {
          console.log(`   ⚠️  SOSPECHOSO - Película en español pero no confirmada como peruana`);
          console.log(`   📝 Descripción: ${tmdbData.tmdb_overview?.substring(0, 100)}...`);
          suspiciousCount++;
        } else {
          console.log(`   ❌ PROBLEMA - No parece ser película peruana`);
          suspiciousCount++;
        }
      } else {
        console.log(`   ❓ NO ENCONTRADO - Verificar manualmente`);
        console.log(`   📝 Director listado: ${movie.director}`);
        suspiciousCount++;
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n🎉 ¡Verificación completada!');
    console.log(`✅ Películas verificadas como peruanas: ${verifiedCount}`);
    console.log(`⚠️  Películas sospechosas/no confirmadas: ${suspiciousCount}`);
    console.log(`🔄 Posters actualizados: ${updatedPosters}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await client.close();
  }
}

verifyAndUpdateMovies();
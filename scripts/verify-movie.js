// Quick script to verify La Teta Asustada poster
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";

async function verifyMovie() {
  try {
    // Search for the movie
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=La%20Teta%20Asustada&year=2009&language=es`;
    
    console.log('🔍 Verificando "La Teta Asustada" en TMDB...\n');
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      
      console.log('📽️ Información de la película:');
      console.log(`   Título: ${movie.title}`);
      console.log(`   Título original: ${movie.original_title}`);
      console.log(`   Año: ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}`);
      console.log(`   Director: ${movie.overview ? 'Ver descripción abajo' : 'No disponible'}`);
      console.log(`   ID TMDB: ${movie.id}`);
      console.log(`   Poster: https://image.tmdb.org/t/p/w500${movie.poster_path}`);
      
      if (movie.overview) {
        console.log(`\n📝 Descripción: ${movie.overview}`);
      }
      
      // Also check the English version
      const englishUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=The%20Milk%20of%20Sorrow&year=2009&language=en`;
      const englishResponse = await fetch(englishUrl);
      const englishData = await englishResponse.json();
      
      if (englishData.results && englishData.results.length > 0) {
        const englishMovie = englishData.results[0];
        console.log(`\n🇺🇸 Título en inglés: ${englishMovie.title}`);
        console.log(`   Poster inglés: https://image.tmdb.org/t/p/w500${englishMovie.poster_path}`);
        
        if (movie.poster_path !== englishMovie.poster_path) {
          console.log('\n⚠️  NOTA: Los posters en español e inglés son diferentes!');
        } else {
          console.log('\n✅ Confirmado: Mismo poster en ambos idiomas');
        }
      }
      
    } else {
      console.log('❌ No se encontró la película');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyMovie();
// Search for correct Raiz (2024) poster using IMDB ID
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function searchCorrectRaizPoster() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🔍 Buscando el poster correcto para "Raíz" (2024) - IMDB: tt30970632...\n');
    
    // Try different search variations
    const searchQueries = [
      "Raíz Franco García Becerra 2024",
      "Raiz 2024 Peru Chile",
      "Raíz alpaca mining Peru",
      "Franco García Becerra Raíz",
      "Feliciano alpaca Peru movie"
    ];
    
    for (const query of searchQueries) {
      console.log(`🎯 Buscando: "${query}"`);
      
      try {
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&year=2024&language=en`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          for (const movie of data.results.slice(0, 3)) { // Check first 3 results
            console.log(`   - ${movie.title} (${movie.release_date?.split('-')[0]}) ID: ${movie.id}`);
            
            if (movie.poster_path) {
              // Get detailed info to verify it's the correct movie
              const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en`;
              const detailResponse = await fetch(detailUrl);
              const detailData = await detailResponse.json();
              
              // Check if this matches our movie (look for Peru/Chile production countries)
              const isPeru = detailData.production_countries?.some(c => c.iso_3166_1 === 'PE' || c.name === 'Peru');
              const isChile = detailData.production_countries?.some(c => c.iso_3166_1 === 'CL' || c.name === 'Chile');
              
              if (isPeru || isChile) {
                console.log(`   ✅ ENCONTRADO: Países de producción incluyen Perú/Chile`);
                console.log(`   📊 Países: ${detailData.production_countries?.map(c => c.name).join(', ')}`);
                console.log(`   🎭 Géneros: ${detailData.genres?.map(g => g.name).join(', ')}`);
                console.log(`   ⏱️ Duración: ${detailData.runtime} min`);
                console.log(`   🖼️ Poster: ${TMDB_IMAGE_BASE_URL}${movie.poster_path}`);
                
                // Update the movie with correct poster
                const updateResult = await collection.updateOne(
                  { title: "Raíz", year: 2024 },
                  { 
                    $set: { 
                      poster_url: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
                      tmdb_id: movie.id,
                      tmdb_title: movie.title,
                      verified_tmdb: true
                    }
                  }
                );
                
                if (updateResult.matchedCount > 0) {
                  console.log('\n🎉 ¡Poster actualizado correctamente!');
                  return;
                }
              }
            }
          }
        } else {
          console.log(`   No hay resultados para "${query}"`);
        }
      } catch (error) {
        console.error(`   ❌ Error buscando "${query}":`, error.message);
      }
      
      // Small delay between searches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n❓ No se encontró el poster específico en TMDB');
    console.log('🖼️ La película mantendrá el poster actual como placeholder');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

searchCorrectRaizPoster();
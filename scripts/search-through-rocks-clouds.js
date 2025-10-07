// Search for "Through Rocks and Clouds" (Raíz) on TMDB
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function searchThroughRocksAndClouds() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🔍 Buscando "Through Rocks and Clouds" (Raíz) en TMDB...\n');
    
    // Try different search variations with English title
    const searchQueries = [
      "Through Rocks and Clouds 2024",
      "Through Rocks and Clouds Franco García Becerra",
      "Through Rocks and Clouds Peru",
      "Raiz Through Rocks Clouds"
    ];
    
    for (const query of searchQueries) {
      console.log(`🎯 Buscando: "${query}"`);
      
      try {
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&year=2024&language=en`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          for (const movie of data.results) {
            console.log(`   📽️ ${movie.title} (${movie.release_date?.split('-')[0]}) ID: ${movie.id}`);
            console.log(`      Original: ${movie.original_title}`);
            
            if (movie.poster_path) {
              // Get detailed info
              const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en`;
              const detailResponse = await fetch(detailUrl);
              const detailData = await detailResponse.json();
              
              console.log(`      📊 Países: ${detailData.production_countries?.map(c => c.name).join(', ')}`);
              console.log(`      🎭 Géneros: ${detailData.genres?.map(g => g.name).join(', ')}`);
              console.log(`      ⏱️ Duración: ${detailData.runtime} min`);
              console.log(`      🖼️ Poster: ${TMDB_IMAGE_BASE_URL}${movie.poster_path}`);
              
              // Check if this could be our movie
              const isPeru = detailData.production_countries?.some(c => 
                c.iso_3166_1 === 'PE' || c.name.includes('Peru')
              );
              const hasCorrectRuntime = detailData.runtime >= 80 && detailData.runtime <= 90;
              const isRightYear = movie.release_date?.includes('2024') || movie.release_date?.includes('2025');
              
              if (isPeru || hasCorrectRuntime || movie.title.includes('Rock') || movie.title.includes('Cloud')) {
                console.log(`   ✅ POSIBLE COINCIDENCIA ENCONTRADA!`);
                
                // Update the movie
                const updateResult = await collection.updateOne(
                  { title: "Raíz", year: 2024 },
                  { 
                    $set: { 
                      poster_url: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
                      tmdb_id: movie.id,
                      tmdb_title: movie.title,
                      english_title: movie.title,
                      original_title: movie.original_title,
                      letterboxd_url: "https://letterboxd.com/film/through-rocks-and-clouds/",
                      verified_tmdb: true,
                      poster_type: "tmdb_official"
                    }
                  }
                );
                
                if (updateResult.matchedCount > 0) {
                  console.log('\n🎉 ¡Película actualizada con poster oficial!');
                  console.log(`🎬 Título en inglés: ${movie.title}`);
                  console.log(`📋 Letterboxd: https://letterboxd.com/film/through-rocks-and-clouds/`);
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
    
    // If no TMDB results, at least update the Letterboxd URL
    console.log('\n📝 Actualizando solo la URL de Letterboxd...');
    const updateLetterboxd = await collection.updateOne(
      { title: "Raíz", year: 2024 },
      { 
        $set: { 
          letterboxd_url: "https://letterboxd.com/film/through-rocks-and-clouds/",
          english_title: "Through Rocks and Clouds"
        }
      }
    );
    
    if (updateLetterboxd.matchedCount > 0) {
      console.log('✅ URL de Letterboxd actualizada correctamente');
      console.log('🎬 Título en inglés añadido: "Through Rocks and Clouds"');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

searchThroughRocksAndClouds();
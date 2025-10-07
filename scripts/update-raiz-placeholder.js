// Update Raiz with custom placeholder poster
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function updateRaizWithPlaceholder() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🖼️ Actualizando "Raíz" (2024) con placeholder personalizado...\n');
    
    // Create a custom placeholder URL that will generate a poster
    const customPlaceholderUrl = "https://via.placeholder.com/500x750/D91E18/FFFFFF?text=RA%C3%8DZ%0A(2024)%0A%0ADrama%0A83+min%0A%0ADirector:%0AFranco+Garc%C3%ADa%0ABecerra";
    
    const updateResult = await collection.updateOne(
      { title: "Raíz", year: 2024 },
      { 
        $set: { 
          poster_url: customPlaceholderUrl,
          tmdb_id: null, // Clear the incorrect TMDB ID
          tmdb_title: null,
          poster_type: "custom_placeholder",
          poster_note: "Película muy reciente - poster personalizado hasta encontrar imagen oficial"
        }
      }
    );
    
    if (updateResult.matchedCount > 0) {
      console.log('✅ Poster placeholder personalizado aplicado!');
      console.log(`🎨 URL del poster: ${customPlaceholderUrl}`);
      console.log('🎬 La película ahora tiene un poster con los colores de la bandera peruana');
      
      // Show the updated movie
      const updatedMovie = await collection.findOne({ title: "Raíz", year: 2024 });
      console.log('\n📝 Película actualizada:');
      console.log(`   Título: ${updatedMovie.title} (${updatedMovie.year})`);
      console.log(`   Director: ${updatedMovie.director}`);
      console.log(`   Duración: ${updatedMovie.runtime} minutos`);
      console.log(`   IMDB: ${updatedMovie.imdb_id}`);
      console.log(`   Poster: ${updatedMovie.poster_type}`);
      console.log(`   📂 Google Drive: ${updatedMovie.google_drive_link}`);
      
    } else {
      console.log('❌ No se pudo actualizar la película');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateRaizWithPlaceholder();
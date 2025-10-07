// Update Raiz (2024) with correct IMDB information
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function updateRaizMovie() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎬 Actualizando "Raíz" (2024) con información correcta de IMDB...\n');
    
    // Find the current movie
    const currentMovie = await collection.findOne({ title: "Raiz", year: 2024 });
    if (!currentMovie) {
      console.log('❌ "Raíz" (2024) no encontrada en la base de datos');
      return;
    }
    
    console.log('📋 Información actual:');
    console.log(`   Duración: ${currentMovie.runtime} min`);
    console.log(`   Géneros: ${currentMovie.genres.join(', ')}`);
    console.log(`   Director: ${currentMovie.director}`);
    
    // Update with correct IMDB information
    const updatedData = {
      title: "Raíz", // With accent
      runtime: 83, // 1h 23min = 83 minutes
      genres: ["Drama"],
      director: "Franco García Becerra",
      description: "Feliciano, criador de alpacas de ocho años, está extasiado: Perú tiene la oportunidad de clasificarse para la Copa del Mundo. Sin embargo, las intrigas de una empresa minera ponen en peligro su comunidad y sus tradiciones.",
      letterboxd_url: "https://letterboxd.com/film/raiz-2024/",
      imdb_id: "tt30970632",
      imdb_url: "https://www.imdb.com/title/tt30970632/",
      countries: ["Perú", "Chile"],
      languages: ["Quechua", "Español"],
      release_date: "2025-10-16", // Release date from IMDB
      verified: true,
      // Keep existing data
      google_drive_link: currentMovie.google_drive_link,
      poster_url: currentMovie.poster_url,
      tmdb_id: currentMovie.tmdb_id,
      tmdb_title: currentMovie.tmdb_title
    };
    
    // Update the movie
    const result = await collection.updateOne(
      { title: "Raiz", year: 2024 },
      { $set: updatedData }
    );
    
    if (result.matchedCount > 0) {
      console.log('\n✅ "Raíz" (2024) actualizada exitosamente!');
      console.log('📝 Nuevos datos:');
      console.log(`   Título: ${updatedData.title} (con acento)`);
      console.log(`   Duración: ${updatedData.runtime} minutos (1h 23min)`);
      console.log(`   Director: ${updatedData.director}`);
      console.log(`   Géneros: ${updatedData.genres.join(', ')}`);
      console.log(`   Países: ${updatedData.countries.join(', ')}`);
      console.log(`   Idiomas: ${updatedData.languages.join(', ')}`);
      console.log(`   IMDB ID: ${updatedData.imdb_id}`);
      console.log(`   Estreno: ${updatedData.release_date}`);
      console.log(`   📂 Google Drive: ${updatedData.google_drive_link}`);
      
      // Show final movie data
      const finalMovie = await collection.findOne({ title: "Raíz", year: 2024 });
      console.log('\n🎬 Película actualizada en base de datos:');
      console.log(JSON.stringify(finalMovie, null, 2));
      
    } else {
      console.log('❌ No se pudo actualizar la película');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateRaizMovie();
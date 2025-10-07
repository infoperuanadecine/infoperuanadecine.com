// Check which movies don't have Google Drive links
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function checkMoviesWithoutLinks() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🔍 Verificando películas sin enlaces de Google Drive...\n');
    
    // Find movies without Google Drive links
    const moviesWithoutLinks = await collection.find({
      $or: [
        { google_drive_link: { $exists: false } },
        { google_drive_link: null },
        { google_drive_link: "" },
        { google_drive_link: { $regex: /^(?!https:\/\/drive\.google\.com)/ } } // Not a Google Drive link
      ]
    }).toArray();
    
    const allMovies = await collection.find({}).toArray();
    const moviesWithLinks = await collection.find({
      google_drive_link: { $regex: /^https:\/\/drive\.google\.com/ }
    }).toArray();
    
    console.log(`📊 Resumen de enlaces:`);
    console.log(`   Total de películas: ${allMovies.length}`);
    console.log(`   Con enlaces de Google Drive: ${moviesWithLinks.length}`);
    console.log(`   Sin enlaces válidos: ${moviesWithoutLinks.length}\n`);
    
    if (moviesWithoutLinks.length > 0) {
      console.log('❌ Películas SIN enlaces válidos de Google Drive:');
      moviesWithoutLinks.forEach((movie, index) => {
        console.log(`   ${index + 1}. ${movie.title} (${movie.year})`);
        console.log(`      Link actual: ${movie.google_drive_link || 'NO DEFINIDO'}`);
        console.log(`      ID: ${movie._id}\n`);
      });
    }
    
    if (moviesWithLinks.length > 0) {
      console.log('✅ Películas CON enlaces válidos de Google Drive:');
      moviesWithLinks.forEach((movie, index) => {
        console.log(`   ${index + 1}. ${movie.title} (${movie.year})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkMoviesWithoutLinks();
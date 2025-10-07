// Quick test to see if we can fetch movies from database
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function testMovies() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const movies = await db.collection('movies').find({}).limit(5).toArray();
    
    console.log(`✅ Conectado! Encontré ${movies.length} películas:`);
    movies.forEach(movie => {
      console.log(`- ${movie.title} (${movie.year})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

testMovies();
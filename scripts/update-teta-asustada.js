// Update La Teta Asustada to English poster
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function updateTetaAsustada() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    
    // Update La Teta Asustada to use English poster
    const result = await db.collection('movies').updateOne(
      { title: "La Teta Asustada" },
      { 
        $set: { 
          poster_url: "https://image.tmdb.org/t/p/w500/bdg1wZ76HSVEtEKh7FUXYGqW9nW.jpg",
          english_title: "The Milk of Sorrow"
        }
      }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ "La Teta Asustada" actualizada con poster en inglés');
      console.log('🔗 Nuevo poster: https://image.tmdb.org/t/p/w500/bdg1wZ76HSVEtEKh7FUXYGqW9nW.jpg');
    } else {
      console.log('❌ No se encontró "La Teta Asustada"');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateTetaAsustada();
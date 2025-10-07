// Mark specific movies as unavailable (hidden from users)
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function hideSpecificMovies() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🚫 Ocultando películas específicas...\n');
    
    // Example: Hide movies you don't want users to see yet
    // Change these titles to the movies you want to hide
    const moviesToHide = [
      'Asu Mare 2',           // Example - maybe link is broken
      'Dragones: Destino de Fuego'  // Example - maybe poor quality
    ];
    
    console.log(`📝 Películas a ocultar: ${moviesToHide.join(', ')}\n`);
    
    // Mark these movies as unavailable
    const hideResult = await collection.updateMany(
      { title: { $in: moviesToHide } },
      { 
        $set: { 
          available: false,
          status: 'coming_soon',
          hidden_reason: 'Link needs updating' // Optional: add reason
        }
      }
    );
    
    console.log(`✅ ${hideResult.modifiedCount} películas marcadas como NO disponibles\n`);
    
    // Show current status
    const availableCount = await collection.countDocuments({ available: { $ne: false } });
    const hiddenCount = await collection.countDocuments({ available: false });
    const totalCount = await collection.countDocuments({});
    
    console.log('📊 Estado actualizado:');
    console.log(`   🟢 Disponibles (visibles): ${availableCount}`);
    console.log(`   🔴 Ocultas: ${hiddenCount}`);
    console.log(`   📊 Total: ${totalCount}\n`);
    
    // Show hidden movies
    if (hiddenCount > 0) {
      const hiddenMovies = await collection.find({ available: false }).toArray();
      console.log('🚫 Películas actualmente OCULTAS:');
      hiddenMovies.forEach((movie, index) => {
        console.log(`   ${index + 1}. ${movie.title} (${movie.year}) - ${movie.status || 'No disponible'}`);
      });
      console.log('\n💡 Para hacerlas visibles de nuevo:');
      console.log('   node -e "..collections.updateMany({available: false}, {$set: {available: true}})"');
    }
    
    console.log('\n🎬 Los usuarios ahora solo verán las películas disponibles en la web!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// To unhide all movies, uncomment this function and run it
async function showAllMovies() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🟢 Haciendo todas las películas visibles...\n');
    
    const showResult = await collection.updateMany(
      {},
      { 
        $set: { 
          available: true,
          status: 'available'
        }
      }
    );
    
    console.log(`✅ ${showResult.modifiedCount} películas marcadas como disponibles\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the hide function
hideSpecificMovies();

// Uncomment this line to show all movies instead:
// showAllMovies();
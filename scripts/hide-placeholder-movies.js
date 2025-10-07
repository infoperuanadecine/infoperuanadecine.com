// Hide movies with placeholder links, show only movies with real Google Drive links
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function hideMoviesWithPlaceholderLinks() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎯 Ocultando películas con enlaces placeholder...\n');
    
    // Hide movies with PLACEHOLDER_ID in their Google Drive links
    const hideResult = await collection.updateMany(
      { 
        google_drive_link: { $regex: /PLACEHOLDER_ID/ }
      },
      { 
        $set: { 
          available: false,
          status: 'coming_soon',
          hidden_reason: 'Esperando enlace de descarga real'
        }
      }
    );
    
    console.log(`🚫 ${hideResult.modifiedCount} películas con placeholders ocultadas`);
    
    // Make sure movies with real links are visible
    const showResult = await collection.updateMany(
      { 
        google_drive_link: { $not: { $regex: /PLACEHOLDER_ID/ } },
        google_drive_link: { $regex: /drive\.google\.com/ }
      },
      { 
        $set: { 
          available: true,
          status: 'available'
        },
        $unset: { hidden_reason: "" }
      }
    );
    
    console.log(`🟢 ${showResult.modifiedCount} películas con enlaces reales visibles`);
    
    // Show which movies are now visible
    const visibleMovies = await collection.find({ available: { $ne: false } }).toArray();
    const hiddenMovies = await collection.find({ available: false }).toArray();
    
    console.log('\n📊 ESTADO ACTUALIZADO:');
    console.log(`🟢 VISIBLE para usuarios (${visibleMovies.length} películas):`);
    visibleMovies.forEach((movie, i) => {
      console.log(`   ${i + 1}. ${movie.title} (${movie.year})`);
      console.log(`      📂 ${movie.google_drive_link}`);
    });
    
    console.log(`\n🚫 OCULTAS (${hiddenMovies.length} películas con placeholders):`);
    console.log(`   ${hiddenMovies.map(m => m.title).join(', ')}`);
    
    console.log('\n✨ PERFECTO! Solo las películas con enlaces reales son visibles');
    console.log('   Los usuarios solo verán películas que realmente pueden descargar');
    console.log('\n💡 Para añadir más películas visibles:');
    console.log('   1. Sube el archivo a Google Drive');
    console.log('   2. Obtén el enlace de compartir');
    console.log('   3. Actualiza el google_drive_link en la base de datos');
    console.log('   4. La película aparecerá automáticamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

hideMoviesWithPlaceholderLinks();
// Fix the hiding - only show Raíz which has the real Google Drive link
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function showOnlyMoviesWithRealLinks() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎯 Configurando visibilidad: Solo películas con enlaces REALES...\n');
    
    // First, hide ALL movies
    await collection.updateMany(
      {},
      { 
        $set: { 
          available: false,
          status: 'coming_soon',
          hidden_reason: 'Esperando enlace de descarga real'
        }
      }
    );
    
    console.log('🚫 Todas las películas ocultadas temporalmente');
    
    // Now, show only movies that have real Google Drive links (not PLACEHOLDER_ID)
    // Look for specific patterns of real Google Drive links
    const showResult = await collection.updateMany(
      { 
        $and: [
          { google_drive_link: { $regex: /drive\.google\.com/ } },
          { google_drive_link: { $not: { $regex: /PLACEHOLDER_ID/ } } },
          { 
            $or: [
              { google_drive_link: { $regex: /\/folders\/[a-zA-Z0-9_-]{25,}/ } },  // Real folder IDs
              { google_drive_link: { $regex: /\/file\/d\/[a-zA-Z0-9_-]{25,}/ } }   // Real file IDs
            ]
          }
        ]
      },
      { 
        $set: { 
          available: true,
          status: 'available'
        },
        $unset: { hidden_reason: "" }
      }
    );
    
    console.log(`🟢 ${showResult.modifiedCount} películas con enlaces REALES ahora visibles`);
    
    // Show current status
    const visibleMovies = await collection.find({ available: { $ne: false } }).toArray();
    const hiddenMovies = await collection.find({ available: false }).toArray();
    
    console.log('\n📊 ESTADO FINAL:');
    
    if (visibleMovies.length > 0) {
      console.log(`🟢 VISIBLE para usuarios (${visibleMovies.length} películas):`);
      visibleMovies.forEach((movie, i) => {
        console.log(`   ${i + 1}. ${movie.title} (${movie.year})`);
        console.log(`      📂 ${movie.google_drive_link.substring(0, 60)}...`);
      });
    } else {
      console.log(`🟢 VISIBLE para usuarios: 0 películas`);
      console.log('   (Solo aparecerán cuando tengas enlaces reales)');
    }
    
    console.log(`\n🚫 OCULTAS: ${hiddenMovies.length} películas con placeholders`);
    console.log('   (No aparecen en la web hasta tener enlaces reales)');
    
    console.log('\n✨ ¡PERFECTO! Tu sitio web ahora solo muestra películas descargables');
    console.log('\n💡 Para hacer más películas visibles:');
    console.log('   1. Sube archivo a Google Drive');
    console.log('   2. Obtén enlace de compartir real');
    console.log('   3. Reemplaza "PLACEHOLDER_ID" con el ID real');
    console.log('   4. La película aparecerá automáticamente en la web');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

showOnlyMoviesWithRealLinks();
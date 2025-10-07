// Check which movies have real vs placeholder Google Drive links
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function checkRealVsPlaceholderLinks() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🔍 Verificando enlaces reales vs placeholders...\n');
    
    const allMovies = await collection.find({}).sort({ title: 1 }).toArray();
    
    const realLinks = [];
    const placeholderLinks = [];
    
    allMovies.forEach(movie => {
      const link = movie.google_drive_link || '';
      
      // Check if it's a real Google Drive link (contains file/folder ID)
      if (link.includes('drive.google.com') && 
          (link.includes('/folders/') || link.includes('/file/d/')) &&
          link.length > 50) {  // Real Google Drive links are long
        realLinks.push(movie);
      } else {
        placeholderLinks.push(movie);
      }
    });
    
    console.log(`📊 RESUMEN DE ENLACES:`);
    console.log(`   Total películas: ${allMovies.length}`);
    console.log(`   🟢 Con enlaces REALES: ${realLinks.length}`);
    console.log(`   🔴 Con placeholders: ${placeholderLinks.length}\n`);
    
    if (realLinks.length > 0) {
      console.log('✅ PELÍCULAS CON ENLACES REALES:');
      realLinks.forEach((movie, i) => {
        console.log(`   ${i + 1}. ${movie.title} (${movie.year})`);
        console.log(`      📂 ${movie.google_drive_link}`);
        console.log('');
      });
    }
    
    if (placeholderLinks.length > 0) {
      console.log('❌ PELÍCULAS CON PLACEHOLDERS:');
      placeholderLinks.forEach((movie, i) => {
        console.log(`   ${i + 1}. ${movie.title} (${movie.year})`);
        console.log(`      🔗 ${movie.google_drive_link || 'NO LINK'}`);
      });
      
      console.log('\n🚫 RECOMENDACIÓN: Ocultar películas con placeholders');
      console.log('   Solo mostrar películas con enlaces reales de descarga\n');
      
      // Auto-hide movies with placeholder links
      console.log('🔄 Ocultando automáticamente películas sin enlaces reales...');
      
      const hideResult = await collection.updateMany(
        { 
          $or: [
            { google_drive_link: { $exists: false } },
            { google_drive_link: null },
            { google_drive_link: "" },
            { google_drive_link: { $not: { $regex: /drive\.google\.com\/(?:folders\/|file\/d\/).{25,}/ } } }
          ]
        },
        { 
          $set: { 
            available: false,
            status: 'coming_soon',
            hidden_reason: 'Esperando enlace de descarga real'
          }
        }
      );
      
      console.log(`✅ ${hideResult.modifiedCount} películas con placeholders ocultadas`);
      
      // Keep only movies with real links visible
      const showResult = await collection.updateMany(
        { 
          google_drive_link: { $regex: /drive\.google\.com\/(?:folders\/|file\/d\/).{25,}/ }
        },
        { 
          $set: { 
            available: true,
            status: 'available',
            hidden_reason: null
          }
        }
      );
      
      console.log(`🟢 ${showResult.modifiedCount} películas con enlaces reales visibles`);
    }
    
    // Final status
    const finalAvailable = await collection.countDocuments({ available: { $ne: false } });
    const finalHidden = await collection.countDocuments({ available: false });
    
    console.log('\n📈 ESTADO FINAL:');
    console.log(`   🟢 Visibles para usuarios: ${finalAvailable}`);
    console.log(`   🚫 Ocultas: ${finalHidden}`);
    console.log('   💡 Solo las películas con enlaces reales son visibles');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkRealVsPlaceholderLinks();
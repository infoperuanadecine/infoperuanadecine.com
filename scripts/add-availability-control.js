// Add availability status to all movies and create controls
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function addAvailabilityStatus() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎛️ Añadiendo control de disponibilidad a las películas...\n');
    
    // Get all movies
    const allMovies = await collection.find({}).toArray();
    console.log(`📊 Total de películas: ${allMovies.length}\n`);
    
    // Set all current movies as available by default (since they all have Google Drive links)
    const updateResult = await collection.updateMany(
      {}, // All movies
      { 
        $set: { 
          available: true,
          status: 'available' // 'available', 'coming_soon', 'unavailable'
        }
      }
    );
    
    console.log(`✅ ${updateResult.modifiedCount} películas marcadas como disponibles\n`);
    
    // Show some examples of how you can mark movies as unavailable
    console.log('💡 Para marcar películas como NO disponibles (no se mostrarán):\n');
    console.log('   Ejemplo - Marcar "Asu Mare" como "Próximamente":');
    console.log(`   db.movies.updateOne({title: "Asu Mare"}, {$set: {available: false, status: "coming_soon"}})\n`);
    
    console.log('   Ejemplo - Marcar múltiples películas como no disponibles:');
    console.log(`   db.movies.updateMany({title: {$in: ["Movie1", "Movie2"]}}, {$set: {available: false}})\n`);
    
    // Show current available count
    const availableCount = await collection.countDocuments({ available: true });
    const unavailableCount = await collection.countDocuments({ available: false });
    
    console.log('📈 Estado actual:');
    console.log(`   Disponibles: ${availableCount}`);
    console.log(`   No disponibles: ${unavailableCount}`);
    console.log(`   Total: ${allMovies.length}\n`);
    
    // Show how to make specific movies unavailable (example)
    console.log('🚀 ¿Quieres ocultar algunas películas específicas?');
    console.log('   Ejecuta estos comandos para marcar como "no disponibles":\n');
    
    // Example: Mark some movies as coming soon
    const exampleMovies = ['Asu Mare 2', 'Dragones: Destino de Fuego'];
    console.log(`   Ejemplo - Ocultar "${exampleMovies.join('" y "')}"`);
    console.log('   node -e "const { MongoClient } = require(\'mongodb\'); (async () => { const client = new MongoClient(\'mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster\'); await client.connect(); const db = client.db(\'moviedb\'); await db.collection(\'movies\').updateMany({title: {$in: [\\"Asu Mare 2\\", \\"Dragones: Destino de Fuego\\"]}}, {$set: {available: false, status: \\"coming_soon\\"}}); console.log(\'Movies marked as unavailable\'); await client.close(); })()"');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addAvailabilityStatus();
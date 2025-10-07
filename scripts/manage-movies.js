// Movie availability manager - Easy commands to hide/show movies
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

// Easy functions to manage movie visibility

async function hideMovies(movieTitles, reason = 'Link needs updating') {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    const result = await collection.updateMany(
      { title: { $in: movieTitles } },
      { 
        $set: { 
          available: false,
          status: 'coming_soon',
          hidden_reason: reason
        }
      }
    );
    
    console.log(`🚫 ${result.modifiedCount} películas ocultas: ${movieTitles.join(', ')}`);
    return result.modifiedCount;
    
  } finally {
    await client.close();
  }
}

async function showMovies(movieTitles = null) {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    const filter = movieTitles ? { title: { $in: movieTitles } } : {};
    
    const result = await collection.updateMany(
      filter,
      { 
        $set: { 
          available: true,
          status: 'available'
        },
        $unset: { hidden_reason: "" }
      }
    );
    
    const action = movieTitles ? `${movieTitles.join(', ')}` : 'todas las películas';
    console.log(`🟢 ${result.modifiedCount} películas visibles: ${action}`);
    return result.modifiedCount;
    
  } finally {
    await client.close();
  }
}

async function listMovieStatus() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    const available = await collection.find({ available: { $ne: false } }).toArray();
    const hidden = await collection.find({ available: false }).toArray();
    
    console.log('\n📊 ESTADO DE PELÍCULAS:');
    console.log(`🟢 Disponibles (${available.length}):`);
    available.forEach((movie, i) => {
      console.log(`   ${i + 1}. ${movie.title} (${movie.year})`);
    });
    
    if (hidden.length > 0) {
      console.log(`\n🔴 Ocultas (${hidden.length}):`);
      hidden.forEach((movie, i) => {
        console.log(`   ${i + 1}. ${movie.title} (${movie.year}) - ${movie.hidden_reason || 'No disponible'}`);
      });
    }
    
  } finally {
    await client.close();
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'hide':
      if (args.length < 2) {
        console.log('❌ Uso: node manage-movies.js hide "Movie Title" ["Movie 2"] [reason]');
        console.log('   Ejemplo: node manage-movies.js hide "Asu Mare" "Link broken"');
        return;
      }
      const moviesToHide = args.slice(1, -1);
      const reason = args[args.length - 1];
      await hideMovies(moviesToHide, reason);
      break;
      
    case 'show':
      if (args.length < 2) {
        console.log('🟢 Mostrando todas las películas...');
        await showMovies();
      } else {
        const moviesToShow = args.slice(1);
        await showMovies(moviesToShow);
      }
      break;
      
    case 'list':
    case 'status':
      await listMovieStatus();
      break;
      
    default:
      console.log('\n🎬 GESTOR DE DISPONIBILIDAD DE PELÍCULAS\n');
      console.log('Comandos disponibles:');
      console.log('  list                    - Ver estado de todas las películas');
      console.log('  hide "Movie"            - Ocultar película específica');
      console.log('  show "Movie"            - Mostrar película específica');  
      console.log('  show                    - Mostrar todas las películas');
      console.log('\nEjemplos:');
      console.log('  node manage-movies.js list');
      console.log('  node manage-movies.js hide "Asu Mare"');
      console.log('  node manage-movies.js show "Asu Mare"');
      console.log('  node manage-movies.js show');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { hideMovies, showMovies, listMovieStatus };
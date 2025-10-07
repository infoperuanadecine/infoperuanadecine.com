// Update movies with runtime and letterboxd URLs
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

const movieUpdates = [
  { title: "Días de Santiago", runtime: 83, letterboxd_url: "https://letterboxd.com/film/days-of-santiago/" },
  { title: "No se lo digas a nadie", runtime: 109, letterboxd_url: "https://letterboxd.com/film/dont-tell-anyone/" },
  { title: "La Teta Asustada", runtime: 94, letterboxd_url: "https://letterboxd.com/film/the-milk-of-sorrow/" },
  { title: "Magallanes", runtime: 109, letterboxd_url: "https://letterboxd.com/film/magallanes/" },
  { title: "Wiñaypacha", runtime: 87, letterboxd_url: "https://letterboxd.com/film/winaypacha/" },
  { title: "Claudia Llosa", runtime: 95, letterboxd_url: "https://letterboxd.com/search/claudia-llosa/" },
  { title: "El Evangelio de la Carne", runtime: 78, letterboxd_url: "https://letterboxd.com/search/evangelio-carne/" },
  { title: "Samichay", runtime: 90, letterboxd_url: "https://letterboxd.com/film/samichay/" },
  { title: "Av. Larco, La Película", runtime: 86, letterboxd_url: "https://letterboxd.com/search/av-larco/" },
  { title: "Mañana te cuento", runtime: 111, letterboxd_url: "https://letterboxd.com/film/tomorrow-ill-tell-you/" },
  { title: "El Acuarelista", runtime: 105, letterboxd_url: "https://letterboxd.com/search/acuarelista/" },
  { title: "Pirañas", runtime: 95, letterboxd_url: "https://letterboxd.com/search/piranas-2019/" },
  { title: "Undertow (Contracorriente)", runtime: 100, letterboxd_url: "https://letterboxd.com/film/undertow-2009/" },
  { title: "Loxoro", runtime: 83, letterboxd_url: "https://letterboxd.com/search/loxoro/" },
  { title: "Wiñaypacha (Eternidad)", runtime: 87, letterboxd_url: "https://letterboxd.com/film/winaypacha/" },
  { title: "Tal para cual", runtime: 92, letterboxd_url: "https://letterboxd.com/search/tal-para-cual/" },
  { title: "El Mudo", runtime: 88, letterboxd_url: "https://letterboxd.com/search/el-mudo-2013/" },
  { title: "Corazón de León", runtime: 94, letterboxd_url: "https://letterboxd.com/film/lion-heart-2013/" },
  { title: "Madeinusa", runtime: 103, letterboxd_url: "https://letterboxd.com/film/madeinusa/" },
  { title: "Rosario", runtime: 82, letterboxd_url: "https://letterboxd.com/search/rosario-2010/" },
  { title: "Sexo, pudor y lágrimas 2", runtime: 98, letterboxd_url: "https://letterboxd.com/search/sexo-pudor-lagrimas/" },
  { title: "El Limpiador", runtime: 85, letterboxd_url: "https://letterboxd.com/search/limpiador-2012/" },
  { title: "Jardin Secreto", runtime: 92, letterboxd_url: "https://letterboxd.com/search/jardin-secreto/" },
  { title: "Camino a La Paz", runtime: 97, letterboxd_url: "https://letterboxd.com/search/camino-la-paz/" },
  { title: "La Casa Rosada", runtime: 89, letterboxd_url: "https://letterboxd.com/search/casa-rosada/" },
  { title: "El Soñador", runtime: 80, letterboxd_url: "https://letterboxd.com/search/sonador-2016/" },
  { title: "Dragones: Destino de Fuego", runtime: 76, letterboxd_url: "https://letterboxd.com/search/dragones-destino/" },
  { title: "Tarata", runtime: 103, letterboxd_url: "https://letterboxd.com/film/tarata/" },
  { title: "Asu Mare", runtime: 100, letterboxd_url: "https://letterboxd.com/film/asu-mare/" },
  { title: "Asu Mare 2", runtime: 104, letterboxd_url: "https://letterboxd.com/film/asu-mare-2/" }
];

async function updateMoviesData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🎬 Actualizando películas con duración y enlaces de Letterboxd...');
    
    for (const update of movieUpdates) {
      const result = await collection.updateOne(
        { title: update.title },
        { 
          $set: { 
            runtime: update.runtime,
            letterboxd_url: update.letterboxd_url
          }
        }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title} - ${update.runtime} min`);
      } else {
        console.log(`❌ No encontrado: ${update.title}`);
      }
    }
    
    console.log('\n🎉 ¡Actualización completada!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateMoviesData();
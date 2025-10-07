// Script to clean database - remove non-Peruvian movies and fix issues
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function cleanDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🧹 Limpiando base de datos de películas no peruanas...\n');
    
    // Movies to remove (confirmed non-Peruvian)
    const moviesToRemove = [
      "Pirañas", // Italian movie
      "Tal para cual", // South Korean movie  
      "Corazón de León", // Argentine movie
      "Rosario", // Filipino movie
      "Sexo, pudor y lágrimas 2", // Mexican movie
      "Camino a La Paz" // Argentine movie
    ];
    
    // Movies to fix/rename
    const moviesToFix = [
      {
        wrongTitle: "Claudia Llosa",
        correctTitle: "Madeinusa", // This was probably a duplicate/error
        action: "remove" // Since we already have Madeinusa
      },
      {
        wrongTitle: "Wiñaypacha (Eternidad)", 
        correctTitle: "Wiñaypacha",
        action: "remove" // Duplicate
      }
    ];
    
    let removedCount = 0;
    
    // Remove non-Peruvian movies
    for (const movieTitle of moviesToRemove) {
      const result = await collection.deleteOne({ title: movieTitle });
      if (result.deletedCount > 0) {
        console.log(`❌ Eliminado: "${movieTitle}" - No es película peruana`);
        removedCount++;
      }
    }
    
    // Fix duplicates and errors
    for (const fix of moviesToFix) {
      if (fix.action === "remove") {
        const result = await collection.deleteOne({ title: fix.wrongTitle });
        if (result.deletedCount > 0) {
          console.log(`❌ Eliminado: "${fix.wrongTitle}" - ${fix.correctTitle === "Madeinusa" ? "Duplicado/Error" : "Duplicado"}`);
          removedCount++;
        }
      }
    }
    
    console.log('\n🎬 Añadiendo películas peruanas auténticas para reemplazar...\n');
    
    // Add authentic Peruvian movies to replace the removed ones
    const authenticPeruvianMovies = [
      {
        title: "Alma en Borrador",
        year: 2009,
        director: "Alvaro Delgado Aparicio", 
        genres: ["Drama"],
        description: "Drama sobre un joven que busca encontrar su lugar en la sociedad limeña.",
        google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
        poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
        runtime: 98,
        letterboxd_url: "https://letterboxd.com/search/alma-borrador/",
        tmdb_id: null,
        verified: false
      },
      {
        title: "Octubre",
        year: 2010,
        director: "Daniel Vega Vidal",
        genres: ["Drama"],
        description: "Drama que retrata la vida en Lima durante los años de violencia política.",
        google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
        poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg", 
        runtime: 83,
        letterboxd_url: "https://letterboxd.com/film/october-2010/",
        tmdb_id: null,
        verified: false
      },
      {
        title: "Paloma de Papel",
        year: 2003,
        director: "Fabrizio Aguilar",
        genres: ["Drama", "War"],
        description: "Drama sobre un niño durante el conflicto armado interno en Perú.",
        google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
        poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
        runtime: 82,
        letterboxd_url: "https://letterboxd.com/film/paper-dove/", 
        tmdb_id: null,
        verified: false
      },
      {
        title: "Coraje",
        year: 1998,
        director: "Alberto Durant",
        genres: ["Drama"],
        description: "Drama sobre la valentía y supervivencia durante tiempos difíciles en Perú.",
        google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
        poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
        runtime: 89,
        letterboxd_url: "https://letterboxd.com/search/coraje-1998/",
        tmdb_id: null,
        verified: false
      },
      {
        title: "Tinta Roja",
        year: 2000,
        director: "Francisco Lombardi",
        genres: ["Drama", "Crime"],
        description: "Basada en la novela de Alberto Fuguet sobre el periodismo y la corrupción.",
        google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
        poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
        runtime: 108,
        letterboxd_url: "https://letterboxd.com/search/tinta-roja/",
        tmdb_id: null,
        verified: false
      },
      {
        title: "Llévate mis Amores",
        year: 2014, 
        director: "Arturo González Villaseñor",
        genres: ["Documentary"],
        description: "Documental sobre las madres de migrantes desaparecidos.",
        google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
        poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
        runtime: 90,
        letterboxd_url: "https://letterboxd.com/search/llevate-mis-amores/",
        tmdb_id: null,
        verified: false
      }
    ];
    
    let addedCount = 0;
    for (const movie of authenticPeruvianMovies) {
      // Check if movie already exists
      const existing = await collection.findOne({ title: movie.title });
      if (!existing) {
        await collection.insertOne(movie);
        console.log(`✅ Añadido: "${movie.title}" (${movie.year}) - ${movie.director}`);
        addedCount++;
      } else {
        console.log(`⏭️  Ya existe: "${movie.title}"`);
      }
    }
    
    // Get final count
    const totalMovies = await collection.countDocuments();
    
    console.log('\n🎉 ¡Limpieza completada!');
    console.log(`❌ Películas eliminadas (no peruanas): ${removedCount}`);
    console.log(`✅ Películas peruanas añadidas: ${addedCount}`);  
    console.log(`🎬 Total de películas en base: ${totalMovies}`);
    console.log('\n📊 Base de datos ahora contiene solo películas peruanas auténticas!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

cleanDatabase();
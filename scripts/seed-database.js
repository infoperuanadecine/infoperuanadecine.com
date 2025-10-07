// Script to populate MongoDB with authentic Peruvian movies
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

const peruvianMovies = [
  {
    title: "Días de Santiago",
    year: 2004,
    director: "Josué Méndez",
    genres: ["Drama"],
    description: "Un ex-soldado lucha por adaptarse a la vida civil en Lima después de su servicio militar.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "No se lo digas a nadie",
    year: 1998,
    director: "Francisco Lombardi",
    genres: ["Drama", "Romance"],
    description: "Historia sobre la identidad sexual y social en el Perú de los años 80.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "La Teta Asustada",
    year: 2009,
    director: "Claudia Llosa",
    genres: ["Drama"],
    description: "Una joven sufre una enfermedad transmitida por la leche materna de su madre traumatizada por la violencia.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: 35060
  },
  {
    title: "Magallanes",
    year: 2015,
    director: "Salvador del Solar",
    genres: ["Drama"],
    description: "Un ex-militar retirado trabaja como taxista y se encuentra con una mujer de su pasado.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Wiñaypacha",
    year: 2017,
    director: "Óscar Catacora",
    genres: ["Drama"],
    description: "Una pareja de ancianos quechuas vive aislada en los Andes peruanos.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Claudia Llosa",
    year: 2005,
    director: "Claudia Llosa",
    genres: ["Drama"],
    description: "Debut cinematográfico que explora temas de identidad y memoria.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "El Evangelio de la Carne",
    year: 2013,
    director: "Eduardo Mendoza de Echave",
    genres: ["Drama", "Thriller"],
    description: "Thriller psicológico ambientado en Lima contemporánea.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Samichay",
    year: 2020,
    director: "Mauricio Franco Tosso",
    genres: ["Drama", "Musical"],
    description: "Una joven andina busca cumplir su sueño de ser cantante.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Av. Larco, La Película",
    year: 2017,
    director: "Jorge Carmona",
    genres: ["Comedia", "Romance"],
    description: "Comedia romántica ambientada en Miraflores, Lima.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Mañana te cuento",
    year: 2005,
    director: "Eduardo Mendoza de Echave",
    genres: ["Drama", "Romance"],
    description: "Historia de amor entre jóvenes limeños de clase alta.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "El Acuarelista",
    year: 2020,
    director: "Francesc Morales",
    genres: ["Drama", "Biográfico"],
    description: "Biografía del pintor peruano Pancho Fierro.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Pirañas",
    year: 2019,
    director: "Alejandro Hidalgo",
    genres: ["Acción", "Crimen"],
    description: "Thriller de acción ambientado en las calles de Lima.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Undertow (Contracorriente)",
    year: 2009,
    director: "Javier Fuentes-León",
    genres: ["Drama", "Romance"],
    description: "Un pescador casado mantiene una relación secreta con un artista de Lima.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Loxoro",
    year: 2012,
    director: "Claudia Llosa",
    genres: ["Drama", "Terror"],
    description: "Segundo largometraje de Claudia Llosa sobre supersticiones andinas.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Wiñaypacha (Eternidad)",
    year: 2017,
    director: "Óscar Catacora",
    genres: ["Drama"],
    description: "Primera película completamente en quechua y aymara.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Tal para cual",
    year: 2006,
    director: "Sandro Ventura",
    genres: ["Comedia"],
    description: "Comedia peruana sobre relaciones amorosas.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "El Mudo",
    year: 2013,
    director: "Diego Vega Vidal",
    genres: ["Drama"],
    description: "Historia de un niño sordomudo en el Perú rural.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Corazón de León",
    year: 2013,
    director: "Marcos Carnevale",
    genres: ["Drama", "Comedia"],
    description: "Drama sobre un hombre con síndrome de Down que busca independizarse.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Madeinusa",
    year: 2006,
    director: "Claudia Llosa",
    genres: ["Drama"],
    description: "Ópera prima de Claudia Llosa sobre tradiciones andinas.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Rosario",
    year: 2010,
    director: "Albert Ventura",
    genres: ["Drama"],
    description: "Historia ambientada en el mundo de las pandillas de Lima.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Sexo, pudor y lágrimas 2",
    year: 2022,
    director: "Alonso Iñiguez",
    genres: ["Comedia", "Romance"],
    description: "Secuela de la popular comedia mexicana con participación peruana.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "El Limpiador",
    year: 2012,
    director: "Adrián Saba",
    genres: ["Drama", "Crimen"],
    description: "Thriller sobre un hombre que limpia escenas de crimen.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Jardin Secreto",
    year: 2019,
    director: "Franco García Becerra",
    genres: ["Drama", "Romance"],
    description: "Romance LGBTI+ ambientado en Lima contemporánea.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Camino a La Paz",
    year: 2015,
    director: "Francisco Lombardi",
    genres: ["Drama"],
    description: "Última película del reconocido director Francisco Lombardi.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "La Casa Rosada",
    year: 2017,
    director: "Palito Ortega Matute",
    genres: ["Drama"],
    description: "Drama social sobre la realidad de las trabajadoras sexuales.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "El Soñador",
    year: 2016,
    director: "Federico Veiroj",
    genres: ["Drama", "Comedia"],
    description: "Coproducción uruguayo-peruana sobre un hombre que persigue sus sueños.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Dragones: Destino de Fuego",
    year: 2006,
    director: "Óscar Gonzáles Iñiguez",
    genres: ["Animación", "Fantasía"],
    description: "Primera película de animación 3D producida íntegramente en Perú.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Tarata",
    year: 2009,
    director: "Fabrizio Aguilar",
    genres: ["Drama", "Histórico"],
    description: "Drama sobre el atentado terrorista en la calle Tarata en 1992.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Asu Mare",
    year: 2013,
    director: "Ricardo Maldonado",
    genres: ["Comedia"],
    description: "Comedia peruana que se convirtió en un fenómeno de taquilla.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  },
  {
    title: "Asu Mare 2",
    year: 2015,
    director: "Ricardo Maldonado",
    genres: ["Comedia"],
    description: "Secuela de la exitosa comedia peruana.",
    google_drive_link: "https://drive.google.com/file/d/PLACEHOLDER_ID/view",
    poster_url: "https://image.tmdb.org/t/p/w500/placeholder.jpg",
    tmdb_id: null
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB Atlas');
    
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    // Clear existing movies
    await collection.deleteMany({});
    console.log('Base de datos limpiada');
    
    // Insert Peruvian movies
    const result = await collection.insertMany(peruvianMovies);
    console.log(`${result.insertedCount} películas peruanas insertadas exitosamente`);
    
    console.log('✅ Base de datos poblada con películas peruanas clásicas');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
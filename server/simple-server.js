// Simple local server for testing
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

let client = null;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db('moviedb');
}

app.get('/api/movies', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const movies = await db.collection('movies').find({}).toArray();
    
    console.log(`✅ Encontré ${movies.length} películas peruanas`);
    res.json(movies);
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
});

app.listen(port, () => {
  console.log(`🎬 Servidor de películas peruanas corriendo en http://localhost:${port}`);
});
// Main movies API endpoint for Vercel serverless functions
const { MongoClient } = require('mongodb');

// MongoDB connection with connection pooling for serverless
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db('moviedb');
  }

  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  cachedClient = client;
  return client.db('moviedb');
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const movies = db.collection('movies');

    switch (req.method) {
      case 'GET':
        // Get all available movies (only movies with available: true or undefined)
        const allMovies = await movies.find({ 
          available: { $ne: false } 
        }).sort({ created_at: -1 }).toArray();
        res.status(200).json(allMovies);
        break;

      case 'POST':
        // Add new movie (for admin use)
        const newMovie = {
          ...req.body,
          created_at: new Date(),
          available: req.body.available !== false // Default to true unless explicitly false
        };
        
        const result = await movies.insertOne(newMovie);
        const insertedMovie = await movies.findOne({ _id: result.insertedId });
        res.status(201).json(insertedMovie);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
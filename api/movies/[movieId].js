// Individual movie API endpoint for Vercel serverless functions
const { MongoClient, ObjectId } = require('mongodb');

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
    
    // Get movie ID from query parameter
    const { movieId } = req.query;

    switch (req.method) {
      case 'GET':
        if (movieId) {
          // Get single movie by ID
          const movie = await movies.findOne({ _id: new ObjectId(movieId) });
          if (!movie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
          }
          res.status(200).json(movie);
        } else {
          res.status(400).json({ message: 'Movie ID required' });
        }
        break;

      case 'PUT':
        if (movieId) {
          // Update movie
          const updateData = { ...req.body };
          delete updateData._id; // Remove _id from update data
          
          const updateResult = await movies.findOneAndUpdate(
            { _id: new ObjectId(movieId) },
            { $set: updateData },
            { returnDocument: 'after' }
          );
          
          if (!updateResult.value) {
            res.status(404).json({ message: 'Movie not found' });
            return;
          }
          res.status(200).json(updateResult.value);
        } else {
          res.status(400).json({ message: 'Movie ID required' });
        }
        break;

      case 'DELETE':
        if (movieId) {
          // Delete movie
          const deleteResult = await movies.deleteOne({ _id: new ObjectId(movieId) });
          if (deleteResult.deletedCount === 0) {
            res.status(404).json({ message: 'Movie not found' });
            return;
          }
          res.status(200).json({ message: 'Movie deleted successfully' });
        } else {
          res.status(400).json({ message: 'Movie ID required' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

// MongoDB connection with connection pooling for serverless
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db('moviedb');
  }

  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  cachedClient = client;
  return client.db('moviedb');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const db = await connectToDatabase();
    const movies = db.collection('movies');
    
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Search query required' });
      return;
    }

    // Search movies by title or genres
    const searchResults = await movies.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genres: { $in: [new RegExp(query, 'i')] } }
      ]
    }).toArray();

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
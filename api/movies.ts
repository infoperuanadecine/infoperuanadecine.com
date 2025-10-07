import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';

// MongoDB connection with connection pooling for serverless
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  const db = client.db('moviedb');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Movie schema interface
interface Movie {
  _id?: string;
  title: string;
  year: number;
  poster_url: string;
  google_drive_link: string;
  genres: string[];
  description: string;
  tmdb_id?: number;
  created_at?: Date;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { db } = await connectToDatabase();
    const movies = db.collection<Movie>('movies');

    switch (req.method) {
      case 'GET':
        // Get all movies
        const allMovies = await movies.find({}).sort({ created_at: -1 }).toArray();
        res.status(200).json(allMovies);
        break;

      case 'POST':
        // Add new movie
        const newMovie: Movie = {
          ...req.body,
          created_at: new Date()
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
}
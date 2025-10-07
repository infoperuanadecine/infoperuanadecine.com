// Easy script to add new movies to your LIVE website
// Run this locally to add movies to your deployed site
const { MongoClient } = require('mongodb');

// Your MongoDB connection string (same as in Vercel environment)
const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";
const TMDB_API_KEY = "dec9b4176986e6d1333c7b017cca6488";

// Function to add a movie to your live website
async function addMovieToLiveSite(movieData) {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log(`🎬 Adding "${movieData.title}" to LIVE website...\n`);
    
    // Check if movie already exists
    const existing = await collection.findOne({ 
      title: movieData.title, 
      year: movieData.year 
    });
    
    if (existing) {
      console.log('⚠️  Movie already exists on live site');
      return;
    }
    
    // Prepare movie data with automatic availability detection
    const newMovie = {
      ...movieData,
      available: isRealGoogleDriveLink(movieData.google_drive_link),
      status: isRealGoogleDriveLink(movieData.google_drive_link) ? 'available' : 'coming_soon',
      created_at: new Date()
    };
    
    // Add to database
    const result = await collection.insertOne(newMovie);
    
    console.log(`✅ "${movieData.title}" successfully added to live site!`);
    console.log(`🔗 Movie ID: ${result.insertedId}`);
    console.log(`👀 Visible to users: ${newMovie.available ? 'YES' : 'NO (placeholder link)'}`);
    console.log(`🌐 Check your live site to see the update!`);
    
    return result.insertedId;
    
  } catch (error) {
    console.error('❌ Error adding movie:', error);
  } finally {
    await client.close();
  }
}

// Function to update an existing movie's Google Drive link
async function updateMovieLink(movieTitle, newGoogleDriveLink) {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    const updateResult = await collection.updateOne(
      { title: movieTitle },
      { 
        $set: { 
          google_drive_link: newGoogleDriveLink,
          available: isRealGoogleDriveLink(newGoogleDriveLink),
          status: isRealGoogleDriveLink(newGoogleDriveLink) ? 'available' : 'coming_soon'
        }
      }
    );
    
    if (updateResult.matchedCount > 0) {
      console.log(`✅ "${movieTitle}" Google Drive link updated on live site!`);
      console.log(`👀 Now visible: ${isRealGoogleDriveLink(newGoogleDriveLink) ? 'YES' : 'NO'}`);
    } else {
      console.log(`❌ Movie "${movieTitle}" not found`);
    }
    
  } catch (error) {
    console.error('❌ Error updating movie:', error);
  } finally {
    await client.close();
  }
}

// Helper function to detect real Google Drive links
function isRealGoogleDriveLink(link) {
  if (!link || typeof link !== 'string') return false;
  
  return link.includes('drive.google.com') && 
         !link.includes('PLACEHOLDER_ID') &&
         (link.includes('/folders/') || link.includes('/file/d/')) &&
         link.length > 50;
}

// ============= EXAMPLES - UNCOMMENT TO USE =============

// Example 1: Add a new movie with real Google Drive link
/*
addMovieToLiveSite({
  title: "Your Movie Title",
  year: 2024,
  director: "Director Name",
  genres: ["Drama", "Romance"],
  description: "Your movie description here",
  google_drive_link: "https://drive.google.com/file/d/YOUR_REAL_FILE_ID/view?usp=sharing",
  poster_url: "https://image.tmdb.org/t/p/w500/poster.jpg", // Optional
  runtime: 120,
  letterboxd_url: "https://letterboxd.com/film/movie-name/" // Optional
});
*/

// Example 2: Update existing movie with real link
/*
updateMovieLink(
  "Magallanes", 
  "https://drive.google.com/file/d/YOUR_REAL_FILE_ID/view?usp=sharing"
);
*/

// Example 3: Add multiple movies
/*
const moviesToAdd = [
  {
    title: "Movie 1",
    year: 2023,
    director: "Director 1",
    genres: ["Drama"],
    description: "Description 1",
    google_drive_link: "https://drive.google.com/file/d/FILE_ID_1/view"
  },
  {
    title: "Movie 2", 
    year: 2024,
    director: "Director 2",
    genres: ["Comedy"],
    description: "Description 2",
    google_drive_link: "https://drive.google.com/file/d/FILE_ID_2/view"
  }
];

moviesToAdd.forEach(movie => addMovieToLiveSite(movie));
*/

console.log('🎬 Live Movie Management Script Ready!');
console.log('\nTo add movies:');
console.log('1. Uncomment the examples above');
console.log('2. Replace with your real movie data');
console.log('3. Run: node add-movie-to-live.js');
console.log('\n🌐 Changes appear on your live site immediately!');
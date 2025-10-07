# Production Deployment Guide 🇵🇪

## 🚀 Deploy to Vercel with Custom Domain

### 1. Deploy to Vercel

```bash
vercel login  # Use: inforealdecine@proton.me
vercel --prod
```

### 2. Configure Environment Variables

In Vercel dashboard, add:

```
MONGODB_URI=mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster
TMDB_API_KEY=dec9b4176986e6d1333c7b017cca6488
NODE_ENV=production
```

### 3. Add Custom Domain

# Deploy to Vercel

vercel

````

When prompted:
- **Set up and deploy?** → `Y`
- **Which scope?** → Choose your account
- **Link to existing project?** → `N`
- **Project name?** → `info-peruana-de-cine` (or any name you prefer)
- **Directory?** → `.` (current directory)
- **Want to override settings?** → `N`

### Step 4: Add Environment Variables
After deployment, you need to add your secret keys:

```bash
# Add MongoDB connection string
vercel env add MONGODB_URI

# When prompted, paste your MongoDB Atlas connection string:
# mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster

# Add TMDB API key
vercel env add TMDB_API_KEY

# When prompted, paste: dec9b4176986e6d1333c7b017cca6488
````

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

## 🎬 Managing Movies After Deployment

### Option 1: Simple Database Script (Recommended)

Create `add-movie-live.js` and run locally:

```javascript
// This will add movies to your live database
const { MongoClient } = require("mongodb");

const MONGODB_URI = "your_mongodb_uri_here";

async function addMovieToLive(movieData) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("moviedb");
    const collection = db.collection("movies");

    // Add the movie with availability check
    const newMovie = {
      ...movieData,
      available:
        movieData.google_drive_link &&
        !movieData.google_drive_link.includes("PLACEHOLDER_ID"),
      created_at: new Date(),
    };

    await collection.insertOne(newMovie);
    console.log(`✅ "${movieData.title}" added to live site!`);
  } finally {
    await client.close();
  }
}

// Example usage:
addMovieToLive({
  title: "New Movie Title",
  year: 2024,
  director: "Director Name",
  genres: ["Drama"],
  description: "Movie description",
  google_drive_link: "https://drive.google.com/file/d/REAL_FILE_ID/view",
  poster_url: "https://image.tmdb.org/t/p/w500/poster.jpg",
  runtime: 120,
  letterboxd_url: "https://letterboxd.com/film/movie-name/",
});
```

### Option 2: Admin Panel (Future Enhancement)

- Create an admin route at `/admin`
- Password protect it
- Allow adding movies through web interface

### Option 3: Direct Database Access

Use MongoDB Atlas web interface:

1. Go to MongoDB Atlas dashboard
2. Browse Collections → moviedb → movies
3. Insert Document manually

## 📱 Your Live Website

After deployment, Vercel will give you URLs like:

- **Production:** `https://info-peruana-de-cine.vercel.app`
- **Preview:** `https://info-peruana-de-cine-git-main-username.vercel.app`

## 🔄 Making Changes

### Update Code:

```bash
# Make your changes, then:
git add .
git commit -m "Update movies"
git push

# Redeploy
vercel --prod
```

### Add New Movies:

1. Upload movie to Google Drive
2. Get sharing link
3. Run your add-movie script locally
4. Movie appears on live site immediately!

## 🛡️ Security Notes

- MongoDB credentials are safely stored in Vercel environment variables
- Only available movies (with real Google Drive links) are visible
- Anonymous GitHub repository keeps your identity private

## 📞 Support

If deployment fails:

- Check MongoDB Atlas whitelist (allow all IPs: `0.0.0.0/0`)
- Verify environment variables are set correctly
- Check Vercel function logs for errors

Your site will be live and accessible worldwide! 🌍

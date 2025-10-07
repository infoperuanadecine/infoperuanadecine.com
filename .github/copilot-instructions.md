<!-- Movie Hosting Website Project Instructions -->

# Info Peruana de Cine - Movie Download Website

This project is "Info Peruana de Cine", a movie download website similar to inforealdecine.com but focused on Peruvian cinema. Users browse and get Google Drive download links for Peruvian movies.

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: MongoDB Atlas (free tier)
- **Movie Data**: TMDb API for posters and metadata
- **Downloads**: Google Drive links for movie files
- **Hosting**: Vercel (frontend + serverless functions)

## Features

- 🇵🇪 Peruvian flag color scheme (red #D91E18, white #FFFFFF)
- 📱 Responsive movie grid with Peruvian movie posters
- ⬇️ Download buttons (not streaming) - "Descargar Película"
- 🔍 Search and filter functionality
- 🎭 TMDb API integration for automatic poster fetching
- 👨‍💼 Admin panel for adding movies
- 🚀 Serverless architecture (no sleep delays)

## Architecture

**Serverless Functions**: `/api/movies.ts`, `/api/movies/[movieId].ts`, `/api/search.ts`
**Frontend**: React TypeScript SPA deployed to Vercel
**Database**: MongoDB Atlas with connection pooling for serverless

## Development Guidelines

- Use modern React hooks and functional components
- Serverless functions with proper error handling
- Peruvian flag colors throughout the UI
- Spanish language for user-facing text
- Environment variables for API keys and database URLs
- Focus on download functionality, not streaming

# Info Peruana de Cine 🇵🇪

Un sitio web de descarga de películas peruanas similar a inforealdecine.com que permite a los usuarios navegar y obtener enlaces de descarga de Google Drive para películas peruanas.

## Features

- �🇪 **Diseño con colores de la bandera peruana** (rojo #D91E18, blanco #FFFFFF)
- ⬇️ **Botones de descarga** (no streaming) - "Descargar Película"
- 🎬 Cuadrícula de películas con posters automáticos de TMDb
- 🔍 Búsqueda y filtros por título y género
- 🎭 Integración con TMDb API para posters y metadata
- 👨‍� Panel de administración para agregar películas
- 📱 Diseño responsivo para todos los dispositivos
- 🚀 Arquitectura serverless (sin demoras por inactividad)

## Tech Stack

### Frontend

- **React.js con TypeScript** - Interfaz de usuario moderna
- **React Router** - Navegación SPA
- **Axios** - Llamadas a API
- **CSS3** - Efectos glass morphism y gradientes

### Backend

- **Vercel Serverless Functions** - API sin servidor
- **MongoDB Atlas** - Base de datos en la nube (tier gratuito)
- **TypeScript** - Tipado estático para funciones
- **CORS** habilitado para solicitudes cross-origin

### APIs Externas

- **TMDb API** - Posters y metadata de películas
- **Google Drive** - Hosting y enlaces de descarga

## Project Structure

```
infoperuanadecine/
├── api/                   # Vercel Serverless Functions
│   ├── movies.ts         # GET/POST movies endpoint
│   ├── search.ts         # Search movies endpoint
│   └── movies/
│       └── [movieId].ts  # GET/PUT/DELETE single movie
├── frontend/             # React frontend application
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Header.tsx
│   │   │   ├── MovieGrid.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── App.tsx      # Main App component
│   │   └── index.tsx    # Entry point
│   └── package.json
├── vercel.json          # Vercel deployment configuration
├── .github/
│   └── copilot-instructions.md
├── .github/
│   └── copilot-instructions.md
├── package.json          # Root package.json for scripts
└── README.md
```

## Desarrollo Local

### Prerrequisitos

- **Node.js** (v18 or higher) - [Descargar aquí](https://nodejs.org/)
- **MongoDB Atlas** (tier gratuito) - [Crear cuenta](https://www.mongodb.com/cloud/atlas)
- **TMDb API Key** (gratuita) - [Obtener aquí](https://www.themoviedb.org/settings/api)
- **Git** para control de versiones

### Configuración Rápida

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/[ANONYMOUS-USERNAME]/infoperuanadecine.git
   cd infoperuanadecine
   ```

2. **Instalar dependencias**

   ```bash
   # Instalar dependencias del root (Vercel functions)
   npm install

   # Instalar dependencias del frontend
   cd frontend
   npm install
   cd ..
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env.local` en la raíz del proyecto:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/infoperuanadecine
   TMDB_API_KEY=tu_api_key_de_tmdb
   ```

4. **Desarrollo con Live Reload**

   ```bash
   # Terminal 1: Servidor de desarrollo frontend (Puerto 3000)
   cd frontend
   npm start

   # Terminal 2: Funciones serverless locales (Puerto 3001)
   npx vercel dev
   ```

## Usage

### For Users

1. Visit the homepage to browse movies
2. Use the search bar to find specific movies
3. Click "Watch Movie" to open the Google Drive video player
4. Movies are organized in a responsive grid layout

### For Admins

1. Navigate to `/admin` to access the admin panel
2. Enter your TMDb API key
3. Add movie details:
   - Title and year
   - Google Drive sharing link
   - Fetch movie data from TMDb automatically
4. The system will automatically get the poster and description

## API Endpoints

### Movies

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get single movie
- `POST /api/movies` - Add new movie (admin)
- `PUT /api/movies/:id` - Update movie (admin)
- `DELETE /api/movies/:id` - Delete movie (admin)
- `GET /api/movies/search/:query` - Search movies

### Health Check

- `GET /api/health` - Server health status

## Google Drive Setup

1. Upload your movie files to Google Drive
2. Right-click the file → "Get link"
3. Set sharing to "Anyone with the link can view"
4. Copy the sharing URL (format: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)
5. Use this URL in the admin panel

**Note**: Google Drive has bandwidth limits. For high-traffic sites, consider multiple backup links or a proper video CDN.

## Free Deployment Options

### Frontend (Static)

- **Netlify** (100GB/month) - Recommended
- **Vercel** (100GB/month)
- **GitHub Pages** (for smaller sites)

### Backend & Database

- **Render** (Free tier with limitations)
- **Railway** (Free tier available)
- **MongoDB Atlas** (Free 512MB cluster)
- **Supabase** (Free PostgreSQL alternative)

## Development Scripts

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/moviedb
TMDB_API_KEY=your_tmdb_api_key_here
JWT_SECRET=your_jwt_secret_for_auth
```

## Legal Considerations

⚠️ **Important**: Only host and share movies you have the legal rights to distribute. This project is for educational purposes. Sharing copyrighted content without permission is illegal and violates platform terms of service.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **"Cannot find module 'react'"** - Run `npm install` in the frontend directory
2. **MongoDB connection failed** - Ensure MongoDB is running and connection string is correct
3. **TMDb API errors** - Check your API key and rate limits
4. **Google Drive videos not loading** - Ensure sharing permissions are set to "Anyone with the link"

### Getting Help

- Check the [Issues](../../issues) page for common problems
- Create a new issue with detailed information about your problem
- Make sure to include error messages and steps to reproduce

---

Built with ❤️ for movie enthusiasts

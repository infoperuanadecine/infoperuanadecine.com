# Guía de Inicio Rápido - Info Peruana de Cine 🇵🇪

## ⚡ Configuración Ultra Rápida

### 1. Verificar Node.js

```bash
node --version  # Debe ser v18 o superior
npm --version   # Verificar que npm esté instalado
```

**Si Node.js no está instalado:**

1. Ve a https://nodejs.org/
2. Descarga la versión LTS para Windows
3. Instala y reinicia VS Code

### 2. Instalar Todo de una Vez

```bash
npm run setup
```

### 3. Configurar Variables de Entorno

Crea `.env.local` en la raíz del proyecto:

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/infoperuanadecine
TMDB_API_KEY=tu_api_key_aqui
```

### 4. Iniciar Desarrollo con Live Reload

```bash
npm run dev:full
```

Esto iniciará:

- ✅ **Frontend**: http://localhost:3000 (con live reload)
- ✅ **API Serverless**: http://localhost:3001 (funciones Vercel)
- ✅ **Auto-refresh**: Cambios se ven instantáneamente

## 🔑 Obtener Claves API (5 minutos)

### MongoDB Atlas (Base de Datos)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Crear cluster gratuito (512MB)
4. Obtener string de conexión
5. Agregar a `.env.local`

### TMDb API (Posters de Películas)

1. Ve a https://www.themoviedb.org/
2. Crear cuenta gratuita
3. Ir a Settings → API
4. Solicitar API key
5. Agregar a `.env.local`

## 🎬 Probar el Sistema

1. **Ver sitio**: http://localhost:3000
2. **Panel admin**: http://localhost:3000/admin
3. **Agregar película de prueba**
4. **Verificar descarga de Google Drive**

## 🚀 Live Development Features

- **Hot Reload**: Cambios de código se ven instantáneamente
- **Error Overlay**: Errores se muestran en pantalla
- **API Local**: Funciones serverless corriendo localmente
- **CORS Configurado**: Frontend y API se comunican sin problemas

## 🔧 Comandos Útiles

```bash
npm run dev:full        # Desarrollo completo (frontend + API)
npm run dev:frontend    # Solo frontend
npm run dev            # Solo API serverless
npm run build          # Build para producción
npm run deploy         # Deploy a Vercel
```

## ❓ Solución de Problemas

**Error de CORS**: Asegúrate que el proxy en `frontend/package.json` apunte a `http://localhost:3001`

**Error de MongoDB**: Verifica que el string de conexión en `.env.local` sea correcto

**Error de TMDb**: Verifica que la API key sea válida y esté en `.env.local`

¡Listo! Tu sitio de películas peruanas está corriendo con live reload completo. 🇵🇪

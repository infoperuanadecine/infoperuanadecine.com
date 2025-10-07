# 🚀 Live Development Setup

## Método 1: Con Node.js (Recomendado - Funcionalidad Completa)

### Instalar Node.js

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (v20.x.x)
3. Instala y reinicia VS Code

### Después de instalar Node.js:

```bash
npm run setup     # Instala todo
npm run check     # Verifica configuración
npm run dev:full  # ¡Desarrollo con live reload!
```

**Resultado**: Frontend en http://localhost:3000 + API en http://localhost:3001

---

## Método 2: Solo Frontend (Temporal - Sin API)

Si quieres ver solo el frontend mientras instalas Node.js:

### Usar Live Server Extension

1. En VS Code, instalar extensión "Live Server"
2. Abrir `frontend/public/index.html`
3. Click derecho → "Open with Live Server"
4. Se abrirá en http://127.0.0.1:5500

**Limitaciones**:

- ❌ No funciona admin panel (necesita API)
- ❌ No carga películas (necesita MongoDB)
- ✅ Ves el diseño y colores peruanos
- ✅ Navegación básica funciona

---

## 🎯 Recomendación

**Instala Node.js** para la experiencia completa con:

- ✅ Live reload en frontend y backend
- ✅ Panel de administración funcional
- ✅ Integración completa con MongoDB y TMDb
- ✅ Pruebas de descarga de Google Drive
- ✅ Desarrollo profesional

**¡5 minutos de instalación = desarrollo completo!** 🇵🇪

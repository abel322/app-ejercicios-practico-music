# 🎵 Music Practice PWA

Aplicación web progresiva (PWA) para gestionar y optimizar la práctica de instrumentos musicales.

## 🚀 Características

- 📚 **Gestión de Libros**: Sube y organiza tus libros de ejercicios en PDF
- 🎯 **Ejercicios Personalizados**: Crea ejercicios con páginas específicas, dificultad y tempo objetivo
- ⏱️ **Registro de Sesiones**: Lleva un control detallado de tu tiempo de práctica
- 📊 **Dashboard Profesional**: Visualiza tu progreso con gráficos y estadísticas
- 🎯 **Sistema de Metas**: Establece objetivos diarios y semanales
- 📈 **Progresión de Nivel**: Sistema automático de evaluación de nivel (Básico, Intermedio, Avanzado)
- 🌐 **Traducción de PDFs**: Traduce tus libros a múltiples idiomas
- 📱 **PWA**: Instala la app en tu dispositivo y úsala offline
- 🎹 **Multi-instrumento**: Soporta Piano, Batería, Bajo y Guitarra

## 🛠️ Tecnologías

### Frontend
- React 19 + TypeScript
- Material-UI (MUI)
- Vite
- React Router
- Recharts (gráficos)
- PDF.js (visualización de PDFs)
- PWA con Service Workers

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (subida de archivos)
- Google Cloud Translation API

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/abel322/app-ejercicios-practico-music.git
cd app-ejercicios-practico-music
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales
```

Variables de entorno necesarias en `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/music_practice_db"
JWT_SECRET="tu-secreto-jwt-muy-seguro-minimo-32-caracteres"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
GOOGLE_TRANSLATE_API_KEY="tu-api-key-opcional"
```

### 3. Configurar Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# Generar Prisma Client
npx prisma generate
```

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Variables de entorno en `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Ejecutar en Desarrollo

### Backend

```bash
cd backend
npm run dev
```

El servidor estará en `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará en `http://localhost:5173`

## 📦 Build para Producción

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Los archivos estáticos estarán en `frontend/dist/`

## 🗄️ Base de Datos

### Crear Base de Datos PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE music_practice_db;

# Crear usuario (opcional)
CREATE USER music_user WITH ENCRYPTED PASSWORD 'tu-contraseña';
GRANT ALL PRIVILEGES ON DATABASE music_practice_db TO music_user;
```

### Migraciones

```bash
cd backend

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Ver base de datos en interfaz gráfica
npx prisma studio
```

## 👤 Credenciales de Prueba

```
Email: utreraabel91@gmail.com
Contraseña: Password123!
```

Para resetear contraseñas:

```bash
cd backend
node reset_password.js
```

## 📱 Funcionalidades PWA

- ✅ Instalable en dispositivos móviles y desktop
- ✅ Funciona offline (caché de datos)
- ✅ Iconos adaptativos para todas las plataformas
- ✅ Service Worker para actualizaciones automáticas
- ✅ Manifest.json configurado

## 🌐 Traducción de PDFs

Para habilitar la traducción de libros:

1. Obtén una API Key de Google Cloud Translation
2. Agrégala a `backend/.env`:
   ```env
   GOOGLE_TRANSLATE_API_KEY=tu-api-key
   ```
3. Instala dependencias adicionales:
   ```bash
   cd backend
   npm install @google-cloud/translate pdf-parse
   ```

Ver `TRANSLATION_SETUP.md` para más detalles.

## 📚 Documentación Adicional

- [Guía de Despliegue](DEPLOYMENT_GUIDE.md)
- [Configuración de Traducción](TRANSLATION_SETUP.md)
- [Variables de Entorno](ENV_VARIABLES.md)
- [API Endpoints](backend/API_ENDPOINTS.md)
- [Checklist Backend](backend/BACKEND_CHECKLIST.md)
- [Checklist Frontend](frontend/FRONTEND_CHECKLIST.md)

## 🔒 Seguridad

- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Rate limiting en endpoints
- Sanitización de inputs
- CORS configurado
- Validación con Zod

## 🧪 Testing

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## 📊 Estructura del Proyecto

```
app-ejercicios-practico-music/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validation/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🚀 Despliegue

### Opción 1: Vercel (Frontend) + Railway (Backend)

**Frontend en Vercel:**
```bash
cd frontend
vercel
```

**Backend en Railway:**
1. Conecta tu repositorio en railway.app
2. Configura variables de entorno
3. Railway despliega automáticamente

### Opción 2: Todo en Railway/Render

Ver [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) para instrucciones detalladas.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Abel Utrera - [GitHub](https://github.com/abel322)

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un [issue](https://github.com/abel322/app-ejercicios-practico-music/issues).

## ⭐ Soporte

Si este proyecto te fue útil, considera darle una estrella ⭐

## 📞 Contacto

Para preguntas o soporte, contacta a través de GitHub Issues.

---

Hecho con ❤️ para músicos que quieren mejorar su práctica

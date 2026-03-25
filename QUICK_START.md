# 🚀 Guía Rápida de Inicio

Esta guía te ayudará a ejecutar la aplicación Music Practice PWA en tu máquina local en menos de 10 minutos.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- ✅ **PostgreSQL 14+** - [Descargar aquí](https://www.postgresql.org/download/)
- ✅ **Git** - [Descargar aquí](https://git-scm.com/)

Verifica las instalaciones:

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
psql --version    # Debe mostrar 14.x o superior
```

## Paso 1: Configurar la Base de Datos

### Opción A: PostgreSQL Local (Recomendado para desarrollo)

1. **Iniciar PostgreSQL**

```bash
# Windows (si instalaste como servicio, ya está corriendo)
# Verifica en Servicios de Windows

# Linux/Mac
sudo service postgresql start
# o
brew services start postgresql
```

2. **Crear la base de datos**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE music_practice_db;
CREATE USER music_user WITH ENCRYPTED PASSWORD 'music_password';
GRANT ALL PRIVILEGES ON DATABASE music_practice_db TO music_user;
\q
```

### Opción B: PostgreSQL en Docker (Alternativa rápida)

```bash
docker run --name music-practice-db \
  -e POSTGRES_DB=music_practice_db \
  -e POSTGRES_USER=music_user \
  -e POSTGRES_PASSWORD=music_password \
  -p 5432:5432 \
  -d postgres:14
```

### Opción C: Servicio Cloud Gratuito (Sin instalación local)

Usa **Supabase** (500MB gratis):
1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta y nuevo proyecto
3. Copiar la "Connection String" desde Settings → Database
4. Usar esa URL en el paso 3

## Paso 2: Configurar el Backend

1. **Navegar a la carpeta del backend**

```bash
cd backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tu editor favorito
# Windows: notepad .env
# Mac/Linux: nano .env
```

Contenido mínimo del archivo `.env`:

```env
DATABASE_URL="postgresql://music_user:music_password@localhost:5432/music_practice_db"
JWT_SECRET="mi-secreto-super-seguro-para-desarrollo-32-caracteres"
NODE_ENV="development"
PORT=3000
```

4. **Ejecutar migraciones de base de datos**

```bash
npx prisma migrate dev
```

Esto creará todas las tablas necesarias en la base de datos.

5. **Generar Prisma Client**

```bash
npx prisma generate
```

## Paso 3: Configurar el Frontend

1. **Abrir una nueva terminal y navegar al frontend**

```bash
cd frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Contenido del archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Paso 4: Ejecutar la Aplicación

Necesitarás **dos terminales abiertas**:

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Server running on http://localhost:3000
✅ Database connected
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Paso 5: Abrir la Aplicación

1. Abre tu navegador en: **http://localhost:5173**
2. Deberías ver la página de login
3. Haz clic en "Registrarse" para crear tu primera cuenta

## 🎉 ¡Listo!

La aplicación está corriendo. Ahora puedes:

1. **Registrarte** con un email y contraseña
2. **Subir un libro PDF** de partituras
3. **Crear ejercicios** vinculados al libro
4. **Registrar sesiones** de práctica
5. **Ver estadísticas** en el dashboard

## Comandos Útiles

### Backend

```bash
# Desarrollo con hot-reload
npm run dev

# Ver base de datos en navegador
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Resetear base de datos (¡cuidado! borra todos los datos)
npx prisma migrate reset
```

### Frontend

```bash
# Desarrollo con hot-reload
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

## Solución de Problemas Comunes

### ❌ Error: "Cannot connect to database"

**Solución:**
- Verifica que PostgreSQL esté corriendo
- Verifica que la `DATABASE_URL` en `.env` sea correcta
- Prueba la conexión: `psql -U music_user -d music_practice_db`

### ❌ Error: "Port 3000 already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

O cambia el puerto en `backend/.env`:
```env
PORT=3001
```

Y actualiza `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### ❌ Error: "Module not found"

**Solución:**
```bash
# Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "Prisma Client not generated"

**Solución:**
```bash
cd backend
npx prisma generate
```

### ❌ Frontend no carga / pantalla en blanco

**Solución:**
1. Abre las DevTools del navegador (F12)
2. Revisa la consola para errores
3. Verifica que el backend esté corriendo
4. Verifica que `VITE_API_URL` apunte al backend correcto

### ❌ Error: "CORS policy blocked"

**Solución:**
Verifica que en `backend/src/index.ts` el CORS esté configurado correctamente:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Datos de Prueba

Para probar rápidamente, puedes:

1. **Registrar un usuario:**
   - Email: `test@example.com`
   - Contraseña: `Test1234!`
   - Instrumentos: Piano, Guitarra

2. **Usar PDFs de ejemplo:**
   - Busca partituras gratuitas en [IMSLP](https://imslp.org/)
   - O usa cualquier PDF que tengas

## Próximos Pasos

Una vez que la app esté corriendo:

1. 📖 Lee el [README.md](./README.md) para entender todas las características
2. 🚀 Consulta [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para desplegar en producción
3. 🔧 Revisa [ENV_VARIABLES.md](./ENV_VARIABLES.md) para configuración avanzada

## Atajos de Desarrollo

### Reiniciar todo desde cero

```bash
# Backend
cd backend
npx prisma migrate reset  # Borra y recrea la BD
npm run dev

# Frontend (en otra terminal)
cd frontend
npm run dev
```

### Ver la base de datos visualmente

```bash
cd backend
npx prisma studio
```

Esto abre una interfaz web en `http://localhost:5555` donde puedes ver y editar los datos.

### Hot Reload

Ambos (backend y frontend) tienen hot-reload activado:
- **Backend**: Guarda un archivo `.ts` y el servidor se reinicia automáticamente
- **Frontend**: Guarda un archivo `.tsx` y el navegador se actualiza automáticamente

## Estructura de Carpetas Importante

```
music-practice-pwa/
├── backend/
│   ├── src/              # Código fuente
│   ├── prisma/           # Schema y migraciones
│   ├── uploads/          # PDFs subidos (desarrollo)
│   └── .env             # Variables de entorno (crear este)
│
└── frontend/
    ├── src/              # Código fuente React
    ├── public/           # Assets estáticos
    └── .env             # Variables de entorno (crear este)
```

## Recursos Adicionales

- 📚 [Documentación de Prisma](https://www.prisma.io/docs)
- ⚛️ [Documentación de React](https://react.dev)
- 🎨 [Material-UI Components](https://mui.com/material-ui/getting-started/)
- 🔐 [JWT Authentication](https://jwt.io/introduction)

## ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa los logs en las terminales del backend y frontend
2. Busca el error en Google
3. Revisa los issues del proyecto en GitHub
4. Abre un nuevo issue con detalles del error

---

**¡Feliz desarrollo! 🎵**

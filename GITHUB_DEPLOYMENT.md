# 🚀 Despliegue desde GitHub

Tu aplicación ya está en GitHub: https://github.com/abel322/app-ejercicios-practico-music

## ✅ Lo que se subió

- ✅ Todo el código fuente (frontend y backend)
- ✅ Configuración de Prisma y migraciones
- ✅ Funcionalidad de traducción de PDFs
- ✅ Componentes PWA
- ✅ Documentación completa
- ✅ Archivos `.env.example` para configuración

## 🚫 Lo que NO se subió (por seguridad)

- ❌ Archivos `.env` con credenciales
- ❌ `node_modules/`
- ❌ Archivos de usuario en `uploads/`
- ❌ Base de datos local

## 📦 Opciones de Despliegue

### Opción 1: Vercel (Frontend) + Railway (Backend) - RECOMENDADO

#### Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio: `abel322/app-ejercicios-practico-music`
4. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app
   ```
6. Deploy!

#### Backend en Railway

1. Ve a [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona: `abel322/app-ejercicios-practico-music`
4. Configuración:
   - **Root Directory**: `backend`
   - **Start Command**: `npm run build && npm start`
5. Agrega PostgreSQL:
   - "New" → "Database" → "Add PostgreSQL"
   - Railway automáticamente configura `DATABASE_URL`
6. Variables de entorno:
   ```
   JWT_SECRET=tu-secreto-jwt-muy-seguro-minimo-32-caracteres
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://tu-app.vercel.app
   ```
7. Deploy!

### Opción 2: Todo en Railway

1. Ve a [railway.app](https://railway.app)
2. Crea dos servicios del mismo repo:

**Servicio 1: Backend**
- Root Directory: `backend`
- Variables de entorno (ver arriba)
- Agrega PostgreSQL

**Servicio 2: Frontend**
- Root Directory: `frontend`
- Variables de entorno:
  ```
  VITE_API_URL=https://tu-backend.railway.app
  ```

### Opción 3: Render

1. Ve a [render.com](https://render.com)
2. Conecta GitHub

**Backend (Web Service):**
- Repository: `abel322/app-ejercicios-practico-music`
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start`
- Agrega PostgreSQL desde el dashboard

**Frontend (Static Site):**
- Repository: `abel322/app-ejercicios-practico-music`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

## 🔧 Configuración Post-Despliegue

### 1. Ejecutar Migraciones de Base de Datos

Una vez que tengas la base de datos PostgreSQL:

```bash
# Conectarte a tu servidor o usar Railway CLI
railway run npx prisma migrate deploy
```

O desde tu máquina local:

```bash
cd backend
DATABASE_URL="tu-url-de-produccion" npx prisma migrate deploy
```

### 2. Crear Usuario Inicial

Puedes usar el script de reset de contraseña:

```bash
# Modificar backend/reset_password.js con el email deseado
railway run node reset_password.js
```

### 3. Verificar Funcionamiento

- ✅ Frontend carga correctamente
- ✅ Puedes registrarte
- ✅ Puedes iniciar sesión
- ✅ Puedes subir un PDF
- ✅ Puedes crear ejercicios
- ✅ Dashboard muestra datos

## 🌐 URLs de Ejemplo

Después del despliegue tendrás:

- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend.railway.app`
- **API Health**: `https://tu-backend.railway.app/health`

## 🔐 Variables de Entorno Importantes

### Backend

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=secreto-muy-largo-y-seguro-minimo-32-caracteres
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://tu-frontend.vercel.app
GOOGLE_TRANSLATE_API_KEY=opcional-para-traduccion
```

### Frontend

```env
VITE_API_URL=https://tu-backend.railway.app
```

## 💰 Costos Estimados

### Plan Gratuito (Suficiente para empezar)

- **Vercel**: Gratis (100GB bandwidth/mes)
- **Railway**: $5 de crédito gratis/mes
- **Render**: 750 horas gratis/mes

### Plan Básico (~$10-15/mes)

- **Railway Pro**: $5/mes + uso
- **Vercel Pro**: $20/mes (opcional)
- **Base de datos**: Incluida en Railway

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

- Verifica que `DATABASE_URL` esté configurada
- Verifica que las migraciones se ejecutaron
- Revisa los logs del servicio

### Error: "CORS policy"

- Verifica que `CORS_ORIGIN` en backend coincida con tu URL de frontend
- Debe incluir el protocolo: `https://`

### Error: "Module not found"

- Asegúrate de que `npm install` se ejecute en el build
- Verifica que todas las dependencias estén en `package.json`

### Frontend no se conecta al backend

- Verifica que `VITE_API_URL` esté configurada correctamente
- Debe apuntar a tu backend desplegado
- No debe tener `/` al final

## 📝 Comandos Útiles

### Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs

# Ejecutar comandos
railway run npm run prisma:migrate
```

### Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel y Railway desplegarán automáticamente los cambios.

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## ✅ Checklist de Despliegue

- [ ] Repositorio en GitHub configurado
- [ ] Frontend desplegado en Vercel/Railway/Render
- [ ] Backend desplegado en Railway/Render
- [ ] Base de datos PostgreSQL creada
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Usuario de prueba creado
- [ ] Funcionalidad básica verificada
- [ ] HTTPS funcionando
- [ ] PWA instalable

## 🎉 ¡Listo!

Tu aplicación está ahora en la nube y accesible desde cualquier lugar.

Comparte tu URL: `https://tu-app.vercel.app`

# Variables de Entorno - Music Practice PWA

## Backend Variables

### Archivo: `backend/.env`

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/db` | ✅ Sí |
| `JWT_SECRET` | Secreto para firmar tokens JWT (mínimo 32 caracteres) | `tu-secreto-muy-seguro-y-largo-32-chars` | ✅ Sí |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token JWT | `7d` (7 días) | ❌ No (default: 7d) |
| `PORT` | Puerto donde corre el servidor | `3000` | ❌ No (default: 3000) |
| `NODE_ENV` | Entorno de ejecución | `development` o `production` | ✅ Sí |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:5173` | ❌ No (default: *) |
| `AWS_REGION` | Región de AWS para S3 | `us-east-1` | ⚠️ Solo si NODE_ENV=production |
| `AWS_ACCESS_KEY_ID` | Access Key de AWS | `AKIAIOSFODNN7EXAMPLE` | ⚠️ Solo si NODE_ENV=production |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de AWS | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | ⚠️ Solo si NODE_ENV=production |
| `AWS_S3_BUCKET` | Nombre del bucket S3 | `music-practice-pdfs` | ⚠️ Solo si NODE_ENV=production |
| `RATE_LIMIT_WINDOW_MS` | Ventana de tiempo para rate limiting (ms) | `900000` (15 min) | ❌ No (default: 15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de peticiones por ventana | `100` | ❌ No (default: 100) |

### Ejemplo Completo - Desarrollo

```env
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/music_practice_dev"

# JWT
JWT_SECRET="desarrollo-secreto-no-usar-en-produccion-32-caracteres-minimo"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Ejemplo Completo - Producción

```env
# Base de datos
DATABASE_URL="postgresql://music_user:contraseña-segura@db.example.com:5432/music_practice_prod"

# JWT
JWT_SECRET="produccion-secreto-muy-seguro-y-largo-minimo-32-caracteres-aleatorios"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="production"

# CORS
CORS_ORIGIN="https://music-practice.com"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_S3_BUCKET="music-practice-pdfs-prod"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Variables

### Archivo: `frontend/.env` (Desarrollo)

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `VITE_API_URL` | URL base del backend API | `http://localhost:3000` | ✅ Sí |

```env
VITE_API_URL=http://localhost:3000
```

### Archivo: `frontend/.env.production` (Producción)

```env
VITE_API_URL=https://api.music-practice.com
```

## Generación de Secretos Seguros

### JWT_SECRET

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online (usar con precaución)
# https://www.random.org/strings/
```

### Contraseñas de Base de Datos

```bash
# Generar contraseña segura
openssl rand -base64 24
```

## Configuración por Entorno

### Desarrollo Local

1. Copiar `.env.example` a `.env`
2. Configurar `DATABASE_URL` con PostgreSQL local
3. Generar `JWT_SECRET` aleatorio
4. Usar `NODE_ENV=development` (almacenamiento local de PDFs)

### Staging/Testing

1. Usar base de datos separada de producción
2. Usar credenciales AWS de staging
3. Configurar `CORS_ORIGIN` con URL de staging
4. `NODE_ENV=production`

### Producción

1. Usar base de datos de producción con backups
2. Usar credenciales AWS de producción
3. Configurar `CORS_ORIGIN` con dominio real
4. `NODE_ENV=production`
5. Rotar secretos regularmente

## Seguridad

### ⚠️ NUNCA hacer:

- ❌ Commitear archivos `.env` al repositorio
- ❌ Compartir secretos en chat/email sin encriptar
- ❌ Usar secretos de desarrollo en producción
- ❌ Usar secretos débiles o predecibles
- ❌ Exponer variables de entorno en logs

### ✅ Buenas Prácticas:

- ✅ Usar `.env.example` con valores de ejemplo (sin secretos reales)
- ✅ Agregar `.env` a `.gitignore`
- ✅ Usar gestores de secretos (AWS Secrets Manager, HashiCorp Vault)
- ✅ Rotar secretos regularmente
- ✅ Usar diferentes secretos por entorno
- ✅ Limitar acceso a variables de producción
- ✅ Auditar cambios en variables críticas

## Validación de Variables

El backend valida automáticamente las variables requeridas al iniciar. Si falta alguna variable crítica, el servidor no iniciará y mostrará un error descriptivo.

### Verificar Configuración

```bash
# Backend
cd backend
npm run check-env  # Si existe script

# O manualmente
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? '✓ DATABASE_URL configurado' : '✗ DATABASE_URL faltante')"
```

## Troubleshooting

### Error: "DATABASE_URL is not defined"

- Verificar que existe archivo `.env` en `backend/`
- Verificar que la variable está definida correctamente
- Verificar que no hay espacios extra alrededor del `=`

### Error: "JWT_SECRET must be at least 32 characters"

- Generar nuevo secreto con al menos 32 caracteres
- Usar comando de generación de secretos arriba

### Error: "AWS credentials not found"

- Verificar que `NODE_ENV=production`
- Verificar que todas las variables AWS están definidas
- Verificar que las credenciales son válidas

### Error: "CORS policy blocked"

- Verificar que `CORS_ORIGIN` coincide con URL del frontend
- Incluir protocolo (http:// o https://)
- No incluir trailing slash

## Migración de Entornos

### De Desarrollo a Producción

1. Crear nueva base de datos de producción
2. Ejecutar migraciones: `npx prisma migrate deploy`
3. Configurar nuevas variables de entorno
4. Generar nuevos secretos (no reusar de desarrollo)
5. Configurar AWS S3 de producción
6. Actualizar `CORS_ORIGIN` con dominio real
7. Probar conexiones antes de desplegar

### Backup de Variables

```bash
# Exportar variables (sin valores sensibles)
env | grep -E "DATABASE_URL|JWT_SECRET|AWS" | sed 's/=.*/=***/' > env_backup.txt

# O usar herramienta de gestión de secretos
```

## Servicios Cloud - Variables de Entorno

### Railway

1. Dashboard → Project → Variables
2. Agregar cada variable manualmente
3. Railway reinicia automáticamente al cambiar variables

### Render

1. Dashboard → Service → Environment
2. Agregar variables en formato `KEY=VALUE`
3. Render reinicia automáticamente

### Heroku

```bash
# Configurar variables
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="..."

# Ver variables
heroku config

# Eliminar variable
heroku config:unset VARIABLE_NAME
```

### Vercel (Frontend)

1. Dashboard → Project → Settings → Environment Variables
2. Agregar variables con prefijo `VITE_`
3. Seleccionar entornos (Production, Preview, Development)

## Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js dotenv](https://github.com/motdotla/dotenv)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

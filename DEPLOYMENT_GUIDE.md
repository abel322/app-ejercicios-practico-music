# Guía de Deployment - Music Practice PWA

## Resumen

Esta guía proporciona instrucciones paso a paso para desplegar la aplicación Music Practice PWA en producción.

## Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado o acceso a servicio cloud
- Cuenta AWS (para S3) o almacenamiento alternativo
- Dominio con certificado SSL
- Servidor con Ubuntu/Debian o servicio cloud (Heroku, Railway, Render, etc.)

## Tarea 42: Deployment y Configuración de Producción

### 42.1 Configurar Variables de Entorno

#### Backend (.env.production)

Crear archivo `backend/.env` con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@host:5432/music_practice_db"

# JWT
JWT_SECRET="tu-secreto-jwt-muy-seguro-y-largo-minimo-32-caracteres"
JWT_EXPIRES_IN="7d"

# Puerto
PORT=3000

# Entorno
NODE_ENV="production"

# AWS S3 (para almacenamiento de PDFs)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_S3_BUCKET="music-practice-pdfs"

# CORS
CORS_ORIGIN="https://tu-dominio.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env.production)

Crear archivo `frontend/.env.production`:

```env
VITE_API_URL=https://api.tu-dominio.com
```

### 42.2 Configurar HTTPS

#### Opción 1: Let's Encrypt (Recomendado para servidores propios)

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

#### Opción 2: Cloudflare (Recomendado para simplicidad)

1. Agregar dominio a Cloudflare
2. Configurar DNS
3. Habilitar SSL/TLS en modo "Full (strict)"
4. Cloudflare maneja automáticamente los certificados

### 42.3 Configurar CORS

El backend ya tiene CORS configurado. Actualizar en `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### 42.4 Configurar PostgreSQL en Producción

#### Opción 1: PostgreSQL en servidor propio

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE music_practice_db;
CREATE USER music_user WITH ENCRYPTED PASSWORD 'tu-contraseña-segura';
GRANT ALL PRIVILEGES ON DATABASE music_practice_db TO music_user;
\q
```

#### Opción 2: Servicios Cloud (Recomendado)

- **Supabase**: Base de datos PostgreSQL gratuita con 500MB
- **Railway**: PostgreSQL con plan gratuito
- **Neon**: PostgreSQL serverless gratuito
- **AWS RDS**: PostgreSQL gestionado (de pago)

Después de crear la base de datos, ejecutar migraciones:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 42.5 Configurar AWS S3 para Almacenamiento

#### Crear Bucket S3

1. Ir a AWS Console → S3
2. Crear nuevo bucket: `music-practice-pdfs`
3. Región: Elegir la más cercana a tus usuarios
4. Bloquear acceso público: Desactivar (configuraremos políticas)
5. Versionado: Opcional (recomendado)

#### Configurar Políticas de Acceso

Crear política IAM para el bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::music-practice-pdfs/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::music-practice-pdfs"
    }
  ]
}
```

#### Crear Usuario IAM

1. AWS Console → IAM → Users → Add User
2. Nombre: `music-practice-s3-user`
3. Access type: Programmatic access
4. Adjuntar política creada anteriormente
5. Guardar Access Key ID y Secret Access Key

#### Configurar CORS en S3

En la configuración del bucket, agregar regla CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://tu-dominio.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### Alternativa: Almacenamiento Local

Si no quieres usar S3, el backend ya soporta almacenamiento local:

```env
# En .env
NODE_ENV="development"  # Usa almacenamiento local
```

Los archivos se guardarán en `backend/uploads/`

### 42.6 Build de Producción

#### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Compilar TypeScript
npm run build

# El código compilado estará en backend/dist/
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Build de producción
npm run build

# Los archivos estáticos estarán en frontend/dist/
```

### 42.7 Configurar Servidor de Producción

#### Opción 1: Servidor Propio con Nginx + PM2

##### Instalar PM2

```bash
npm install -g pm2
```

##### Configurar PM2 para Backend

Crear `backend/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'music-practice-api',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Iniciar aplicación:

```bash
cd backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

##### Configurar Nginx

Crear `/etc/nginx/sites-available/music-practice`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Aumentar timeout para subida de archivos grandes
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}

# Frontend
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    root /var/www/music-practice/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker - no cache
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    # Manifest - no cache
    location /manifest.json {
        add_header Cache-Control "no-cache";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Habilitar sitio:

```bash
sudo ln -s /etc/nginx/sites-available/music-practice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Opción 2: Servicios Cloud (Más Fácil)

##### Railway

1. Conectar repositorio GitHub
2. Crear dos servicios: Backend y Frontend
3. Configurar variables de entorno
4. Railway despliega automáticamente

##### Render

1. Crear Web Service para Backend
2. Crear Static Site para Frontend
3. Configurar variables de entorno
4. Render despliega automáticamente

##### Heroku

```bash
# Backend
cd backend
heroku create music-practice-api
heroku addons:create heroku-postgresql:mini
git push heroku main

# Frontend
cd frontend
# Usar Heroku Buildpack para sitios estáticos
```

## Verificación Post-Deployment

### Checklist de Verificación

- [ ] Backend responde en https://api.tu-dominio.com/health
- [ ] Frontend carga en https://tu-dominio.com
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Subida de PDF funciona
- [ ] Creación de ejercicios funciona
- [ ] Registro de sesiones funciona
- [ ] Dashboard muestra estadísticas
- [ ] PWA es instalable (ver botón en navegador)
- [ ] Funcionalidad offline funciona
- [ ] Service Worker está activo
- [ ] HTTPS funciona correctamente
- [ ] CORS permite peticiones desde frontend

### Comandos Útiles

```bash
# Ver logs del backend
pm2 logs music-practice-api

# Reiniciar backend
pm2 restart music-practice-api

# Ver estado de servicios
pm2 status

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Verificar certificado SSL
sudo certbot certificates

# Renovar certificado SSL
sudo certbot renew --dry-run
```

## Monitoreo y Mantenimiento

### Logs

- Backend: PM2 logs o logs del servicio cloud
- Nginx: `/var/log/nginx/`
- PostgreSQL: `/var/log/postgresql/`

### Backups

```bash
# Backup de base de datos
pg_dump -U music_user music_practice_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U music_user music_practice_db < backup_20240101.sql
```

### Actualizaciones

```bash
# Backend
cd backend
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart music-practice-api

# Frontend
cd frontend
git pull
npm install
npm run build
# Copiar dist/ a /var/www/music-practice/frontend/
```

## Seguridad

### Recomendaciones

1. **Firewall**: Configurar UFW para permitir solo puertos necesarios
2. **Fail2ban**: Proteger contra ataques de fuerza bruta
3. **Actualizaciones**: Mantener sistema operativo actualizado
4. **Secrets**: Nunca commitear archivos .env
5. **Rate Limiting**: Ya implementado en el backend
6. **SQL Injection**: Prisma protege automáticamente
7. **XSS**: React protege automáticamente
8. **CSRF**: Implementar tokens si es necesario

## Troubleshooting

### Backend no inicia

```bash
# Verificar logs
pm2 logs music-practice-api

# Verificar variables de entorno
pm2 env 0

# Verificar conexión a base de datos
psql $DATABASE_URL
```

### Frontend no carga

```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Verificar archivos
ls -la /var/www/music-practice/frontend/dist/
```

### PDFs no se suben

- Verificar credenciales AWS
- Verificar políticas S3
- Verificar CORS en S3
- Verificar límite de tamaño en Nginx (client_max_body_size)

## Costos Estimados

### Opción Económica (< $20/mes)

- **Base de datos**: Supabase Free (500MB)
- **Backend**: Railway Free o Render Free
- **Frontend**: Netlify/Vercel Free
- **Almacenamiento**: S3 (~$1-5/mes dependiendo uso)
- **Dominio**: ~$12/año

### Opción Profesional (~$50-100/mes)

- **Base de datos**: Railway Pro ($5/mes) o AWS RDS ($15-30/mes)
- **Backend**: Railway Pro ($5/mes) o servidor VPS ($5-10/mes)
- **Frontend**: Netlify Pro ($19/mes) o mismo servidor
- **Almacenamiento**: S3 (~$5-10/mes)
- **CDN**: Cloudflare Free
- **Dominio**: ~$12/año

## Soporte

Para problemas o preguntas:
1. Revisar logs del sistema
2. Verificar variables de entorno
3. Consultar documentación de servicios utilizados
4. Revisar issues en el repositorio del proyecto

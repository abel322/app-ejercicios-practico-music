# 🌐 Configuración de Traducción de PDFs

## Funcionalidad Implementada

Se ha agregado la capacidad de traducir libros PDF a múltiples idiomas usando Google Cloud Translation API.

## 📋 Archivos Creados

### Backend
- `backend/src/services/translation.service.ts` - Servicio de traducción con Google Translate
- `backend/src/services/pdf-translation.service.ts` - Servicio para traducir PDFs
- `backend/src/controllers/translation.controller.ts` - Controlador de endpoints
- `backend/src/routes/translation.routes.ts` - Rutas de API

### Base de Datos
- Modelo `BookTranslation` agregado a `schema.prisma`

### Frontend
- `frontend/src/components/books/BookTranslation.tsx` - Componente UI para traducción

## 🚀 Configuración

### 1. Instalar Dependencias

```bash
cd backend
npm install @google-cloud/translate pdf-parse
```

### 2. Obtener API Key de Google Translate

#### Opción A: Google Cloud Translation API (Recomendado)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Cloud Translation:
   - Ve a "APIs & Services" → "Library"
   - Busca "Cloud Translation API"
   - Haz clic en "Enable"
4. Crea credenciales:
   - Ve a "APIs & Services" → "Credentials"
   - Clic en "Create Credentials" → "API Key"
   - Copia la API Key generada

#### Opción B: DeepL API (Alternativa)

1. Ve a [DeepL API](https://www.deepl.com/pro-api)
2. Regístrate para obtener una API key gratuita (500,000 caracteres/mes)
3. Copia tu API key

### 3. Configurar Variables de Entorno

Agrega a `backend/.env`:

```env
# Google Translate
GOOGLE_TRANSLATE_API_KEY=tu-api-key-aqui

# O si usas DeepL
DEEPL_API_KEY=tu-deepl-api-key
```

### 4. Ejecutar Migración de Base de Datos

```bash
cd backend
npx prisma migrate dev --name add_book_translations
npx prisma generate
```

### 5. Registrar Rutas en el Backend

Agrega en `backend/src/index.ts`:

```typescript
import translationRoutes from './routes/translation.routes';

// Después de las otras rutas
app.use('/api/translations', translationRoutes);
```

### 6. Integrar Componente en el Frontend

En tu componente de lista de libros (ej: `BookList.tsx`):

```typescript
import BookTranslation from './BookTranslation';

// En tu componente
const [translationOpen, setTranslationOpen] = useState(false);
const [selectedBook, setSelectedBook] = useState<any>(null);

// Agregar botón de traducción
<IconButton
  onClick={() => {
    setSelectedBook(book);
    setTranslationOpen(true);
  }}
>
  <TranslateIcon />
</IconButton>

// Agregar el diálogo
<BookTranslation
  bookId={selectedBook?.id}
  bookName={selectedBook?.name}
  open={translationOpen}
  onClose={() => setTranslationOpen(false)}
/>
```

## 📖 Uso

### Desde la Interfaz

1. Ve a tu lista de libros
2. Haz clic en el botón de traducción (icono de idioma)
3. Selecciona el idioma de destino
4. Haz clic en "Traducir"
5. Espera a que se complete (puede tardar varios minutos)
6. Descarga la traducción en formato TXT

### Desde la API

#### Traducir un libro

```bash
POST /api/translations/translate-book
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "uuid-del-libro",
  "targetLanguage": "es"
}
```

#### Obtener traducciones de un libro

```bash
GET /api/translations/book/:bookId
Authorization: Bearer <token>
```

#### Descargar traducción específica

```bash
GET /api/translations/book/:bookId/:language
Authorization: Bearer <token>
```

#### Listar idiomas soportados

```bash
GET /api/translations/languages
Authorization: Bearer <token>
```

## 🌍 Idiomas Soportados

Google Translate soporta 100+ idiomas. Los más comunes:

- `es` - Español
- `en` - English
- `fr` - Français
- `de` - Deutsch
- `it` - Italiano
- `pt` - Português
- `ja` - 日本語
- `zh` - 中文
- `ko` - 한국어
- `ru` - Русский
- `ar` - العربية

## 💰 Costos

### Google Cloud Translation API

- **Gratis**: Primeros $300 en créditos (12 meses)
- **Después**: $20 por millón de caracteres
- **Estimado**: Un libro de 100 páginas ≈ 50,000 caracteres = $1

### DeepL API

- **Gratis**: 500,000 caracteres/mes
- **Pro**: $5.49/mes por 1 millón de caracteres

## ⚠️ Limitaciones Actuales

1. **Extracción de texto**: Necesitas implementar la extracción de texto del PDF
   - Instala: `npm install pdf-parse`
   - Implementa el método `extractTextFromPDF` en `pdf-translation.service.ts`

2. **Formato**: La traducción se guarda como texto plano, no mantiene el formato del PDF original

3. **Imágenes**: No traduce texto en imágenes (necesitaría OCR)

## 🔧 Mejoras Futuras

### Implementar Extracción de PDF

```typescript
import pdf from 'pdf-parse';
import * as fs from 'fs/promises';

private async extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}
```

### Traducción por Páginas

Para libros grandes, traducir página por página:

```typescript
async translateBookByPages(bookId: string, pages: number[]) {
  // Extraer solo páginas específicas
  // Traducir cada página
  // Guardar progreso
}
```

### Cache de Traducciones

Evitar traducir el mismo contenido dos veces:

```typescript
// Verificar si ya existe traducción
const existing = await this.getBookTranslation(bookId, targetLanguage);
if (existing) {
  return existing;
}
```

### Traducción en Background

Para libros grandes, usar jobs en background:

```bash
npm install bull redis
```

```typescript
import Queue from 'bull';

const translationQueue = new Queue('translations', {
  redis: { host: 'localhost', port: 6379 }
});

translationQueue.process(async (job) => {
  const { bookId, targetLanguage } = job.data;
  await pdfTranslationService.translateBook({ bookId, targetLanguage });
});
```

## 🧪 Testing

### Probar traducción simple

```bash
POST /api/translations/translate-text
Authorization: Bearer <token>

{
  "text": "Hello, how are you?",
  "targetLanguage": "es"
}

# Respuesta esperada:
{
  "success": true,
  "data": {
    "translatedText": "Hola, ¿cómo estás?"
  }
}
```

## 🐛 Troubleshooting

### Error: "Translation service not configured"

- Verifica que `GOOGLE_TRANSLATE_API_KEY` esté en `.env`
- Reinicia el servidor backend

### Error: "Failed to translate text"

- Verifica que la API key sea válida
- Verifica que la API esté habilitada en Google Cloud Console
- Revisa los logs del backend para más detalles

### Traducción muy lenta

- Los libros grandes pueden tardar varios minutos
- Considera implementar traducción en background
- Divide en chunks más pequeños

### Texto extraído del PDF está mal formateado

- Algunos PDFs tienen formato complejo
- Considera usar OCR para PDFs escaneados
- Prueba con diferentes librerías: `pdf-parse`, `pdfjs-dist`, `pdf2json`

## 📚 Recursos

- [Google Cloud Translation API Docs](https://cloud.google.com/translate/docs)
- [DeepL API Docs](https://www.deepl.com/docs-api)
- [pdf-parse NPM](https://www.npmjs.com/package/pdf-parse)
- [Prisma Docs](https://www.prisma.io/docs)

## 🔐 Seguridad

- Nunca expongas tu API key en el frontend
- Usa variables de entorno
- Implementa rate limiting para evitar abuso
- Considera agregar límites de uso por usuario

## ✅ Checklist de Implementación

- [ ] Instalar dependencias (`@google-cloud/translate`, `pdf-parse`)
- [ ] Obtener API key de Google Translate
- [ ] Configurar variable de entorno `GOOGLE_TRANSLATE_API_KEY`
- [ ] Ejecutar migración de base de datos
- [ ] Registrar rutas en `index.ts`
- [ ] Implementar extracción de texto PDF
- [ ] Integrar componente en el frontend
- [ ] Probar traducción simple
- [ ] Probar traducción de libro completo
- [ ] Configurar rate limiting
- [ ] Documentar para usuarios


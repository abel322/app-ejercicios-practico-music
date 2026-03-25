# Estructura del Frontend - Music Practice PWA

## Árbol de Directorios

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/          # Componentes reutilizables
│   │   ├── AppLayout.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GoalForm.tsx
│   │   ├── GoalHistory.tsx
│   │   ├── GoalProgress.tsx
│   │   ├── Header.tsx
│   │   ├── InstrumentDistribution.tsx
│   │   ├── LevelHistory.tsx
│   │   ├── LiveRegion.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── NotificationToast.tsx
│   │   ├── PDFViewer.tsx
│   │   ├── PracticeChart.tsx
│   │   ├── PredictionPreview.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RecommendationsPreview.tsx
│   │   ├── SessionForm.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   └── TopExercises.tsx
│   ├── contexts/            # Estado global
│   │   ├── AuthContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/               # Hooks personalizados
│   │   └── useDebounce.ts
│   ├── pages/               # Páginas de la aplicación
│   │   ├── BookList.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ExerciseList.tsx
│   │   ├── ExportData.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── GoalList.tsx
│   │   ├── LevelDisplay.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── PracticeCalendar.tsx
│   │   ├── PracticeTimer.tsx
│   │   ├── PredictionDisplay.tsx
│   │   ├── Profile.tsx
│   │   ├── RecommendationsList.tsx
│   │   ├── Register.tsx
│   │   └── SessionList.tsx
│   ├── services/            # Servicios de API
│   │   ├── authService.ts
│   │   ├── bookService.ts
│   │   ├── dashboardService.ts
│   │   ├── exerciseService.ts
│   │   ├── exportService.ts
│   │   ├── goalService.ts
│   │   ├── levelService.ts
│   │   ├── predictionService.ts
│   │   ├── recommendationService.ts
│   │   └── sessionService.ts
│   ├── theme/               # Configuración de tema
│   │   └── theme.ts
│   ├── types/               # Tipos TypeScript
│   │   ├── auth.types.ts
│   │   ├── book.types.ts
│   │   ├── dashboard.types.ts
│   │   ├── exercise.types.ts
│   │   ├── goal.types.ts
│   │   ├── level.types.ts
│   │   ├── prediction.types.ts
│   │   ├── recommendation.types.ts
│   │   └── session.types.ts
│   ├── utils/               # Utilidades
│   ├── App.css
│   ├── App.tsx              # Componente principal
│   ├── index.css
│   └── main.tsx             # Punto de entrada
├── .gitignore
├── ACCESSIBILITY_CHECKLIST.md
├── eslint.config.js
├── FRONTEND_CHECKLIST.md
├── FRONTEND_STRUCTURE.md
├── index.html
├── LAYOUT_IMPLEMENTATION.md
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Estadísticas

### Archivos por Categoría

| Categoría | Cantidad | Archivos |
|-----------|----------|----------|
| **Páginas** | 16 | Login, Register, ForgotPassword, Dashboard, BookList, ExerciseList, PracticeTimer, SessionList, PracticeCalendar, LevelDisplay, GoalList, RecommendationsList, PredictionDisplay, Profile, ExportData, NotFound |
| **Componentes** | 21 | AppLayout, Header, Sidebar, ErrorBoundary, LoadingSpinner, NotificationToast, ProtectedRoute, LiveRegion, StatsCard, PracticeChart, InstrumentDistribution, TopExercises, RecommendationsPreview, PredictionPreview, PDFViewer, SessionForm, GoalForm, GoalProgress, GoalHistory, LevelHistory |
| **Servicios** | 10 | authService, bookService, exerciseService, sessionService, dashboardService, goalService, levelService, recommendationService, predictionService, exportService |
| **Contextos** | 3 | AuthContext, ThemeContext, NotificationContext |
| **Hooks** | 1 | useDebounce |
| **Tipos** | 9 | auth, book, exercise, session, dashboard, goal, level, recommendation, prediction |

### Total de Archivos TypeScript/React
- **60 archivos** de código fuente (.tsx, .ts)

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                         Usuario                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Páginas (Pages)                           │
│  Login, Register, Dashboard, BookList, ExerciseList, etc.   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Componentes (Components)                     │
│  StatsCard, PracticeChart, GoalForm, PDFViewer, etc.        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Servicios (Services)                        │
│  authService, bookService, sessionService, etc.              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API                               │
│  /api/auth, /api/books, /api/sessions, etc.                 │
└─────────────────────────────────────────────────────────────┘
```

## Estado Global

```
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              ThemeProvider                             │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         NotificationProvider                     │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │          AuthProvider                      │ │ │ │
│  │  │  │  ┌──────────────────────────────────────┐ │ │ │ │
│  │  │  │  │        BrowserRouter                 │ │ │ │ │
│  │  │  │  │  ┌────────────────────────────────┐ │ │ │ │ │
│  │  │  │  │  │         Routes                 │ │ │ │ │ │
│  │  │  │  │  └────────────────────────────────┘ │ │ │ │ │
│  │  │  │  └──────────────────────────────────────┘ │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Rutas de la Aplicación

### Rutas Públicas
```
/login              → Login.tsx
/register           → Register.tsx
/forgot-password    → ForgotPassword.tsx
```

### Rutas Protegidas (requieren autenticación)
```
/                   → Dashboard.tsx
/books              → BookList.tsx
/exercises          → ExerciseList.tsx
/practice           → PracticeTimer.tsx
/sessions           → SessionList.tsx
/calendar           → PracticeCalendar.tsx
/level              → LevelDisplay.tsx
/goals              → GoalList.tsx
/recommendations    → RecommendationsList.tsx
/predictions        → PredictionDisplay.tsx
/profile            → Profile.tsx
/export             → ExportData.tsx
```

### Ruta de Error
```
*                   → NotFound.tsx
```

## Dependencias Principales

### Producción
- **React 19.2.0** - Framework UI
- **React Router DOM 6.22.0** - Enrutamiento
- **Material-UI 5.15.0** - Componentes UI
- **Axios 1.6.5** - Cliente HTTP
- **React PDF 10.4.1** - Visualización de PDFs
- **Recharts 3.7.0** - Gráficos y visualizaciones
- **Emotion** - Estilos CSS-in-JS

### Desarrollo
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.3.1** - Build tool
- **ESLint 9.39.1** - Linter

## Patrones de Diseño Utilizados

### 1. Context API
- **AuthContext**: Gestión de autenticación y usuario
- **ThemeContext**: Gestión de tema claro/oscuro
- **NotificationContext**: Sistema de notificaciones

### 2. Custom Hooks
- **useDebounce**: Debouncing para búsquedas

### 3. Higher-Order Components
- **ProtectedRoute**: Protección de rutas autenticadas
- **ErrorBoundary**: Captura de errores de renderizado

### 4. Service Layer
- Separación de lógica de API en servicios reutilizables
- Configuración centralizada de axios

### 5. Component Composition
- Componentes pequeños y reutilizables
- Separación de presentación y lógica

## Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (ej: `AppLayout.tsx`)
- **Servicios**: camelCase (ej: `authService.ts`)
- **Tipos**: PascalCase con sufijo `.types.ts` (ej: `auth.types.ts`)
- **Hooks**: camelCase con prefijo `use` (ej: `useDebounce.ts`)

### Estructura de Archivos
- Un componente por archivo
- Tipos exportados desde archivos `.types.ts`
- Servicios agrupados por funcionalidad

### TypeScript
- Tipado estricto en todos los archivos
- Interfaces para props de componentes
- Types para datos de API

## Próximos Pasos

1. **PWA** (Tareas 38-39)
   - Configurar Service Worker con Workbox
   - Implementar funcionalidad offline
   - Crear manifest.json

2. **Optimización** (Tarea 40)
   - Implementar lazy loading de rutas
   - Optimizar imágenes y assets
   - Verificar tiempos de carga

3. **Testing** (Tarea 41 - Opcional)
   - Configurar Vitest
   - Escribir tests unitarios
   - Escribir tests de componentes
   - Escribir tests de integración

4. **Deployment** (Tarea 42)
   - Configurar variables de entorno de producción
   - Build de producción
   - Deployment a servidor

---

**Documento generado**: Tarea 37 - Checkpoint Frontend Completo

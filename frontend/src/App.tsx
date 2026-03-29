import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationToast } from './components/NotificationToast';
import { OfflineBanner } from './components/OfflineBanner';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { useOfflineSync } from './hooks/useOfflineSync';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Páginas públicas - carga inmediata (críticas)
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas protegidas - lazy loading
const Home = lazy(() => import('./pages/Home'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BookList = lazy(() => import('./pages/BookList'));
const ExerciseList = lazy(() => import('./pages/ExerciseList'));
const ExerciseProgress = lazy(() => import('./pages/ExerciseProgress'));
const PracticeTimer = lazy(() => import('./pages/PracticeTimer'));
const PracticeSession = lazy(() => import('./pages/PracticeSession'));
const SessionList = lazy(() => import('./pages/SessionList'));
const PracticeCalendar = lazy(() => import('./pages/PracticeCalendar'));
const LevelDisplay = lazy(() => import('./pages/LevelDisplay'));
const GoalList = lazy(() => import('./pages/GoalList'));
const RecommendationsList = lazy(() => import('./pages/RecommendationsList'));
const PredictionDisplay = lazy(() => import('./pages/PredictionDisplay'));
const MusicLessons = lazy(() => import('./pages/MusicLessons'));
const Profile = lazy(() => import('./pages/Profile'));
const ExportData = lazy(() => import('./pages/ExportData'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente interno que usa los hooks
function AppContent() {
  // Inicializar sincronización offline
  useOfflineSync();

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rutas protegidas */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Rutas generales */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="lessons" element={<MusicLessons />} />
            <Route path="profile" element={<Profile />} />
            <Route path="export" element={<ExportData />} />

            {/* Rutas por instrumento */}
            <Route path="piano/books" element={<BookList instrument="PIANO" />} />
            <Route path="piano/exercises" element={<ExerciseList instrument="PIANO" />} />
            <Route path="piano/exercise-progress" element={<ExerciseProgress instrument="PIANO" />} />
            <Route path="piano/practice-session" element={<PracticeSession instrument="PIANO" />} />
            <Route path="piano/sessions" element={<SessionList instrument="PIANO" />} />
            <Route path="piano/calendar" element={<PracticeCalendar instrument="PIANO" />} />
            <Route path="piano/level" element={<LevelDisplay instrument="PIANO" />} />
            <Route path="piano/predictions" element={<PredictionDisplay instrument="PIANO" />} />
            <Route path="piano/goals" element={<GoalList instrument="PIANO" />} />
            <Route path="piano/recommendations" element={<RecommendationsList instrument="PIANO" />} />

            <Route path="guitar/books" element={<BookList instrument="GUITAR" />} />
            <Route path="guitar/exercises" element={<ExerciseList instrument="GUITAR" />} />
            <Route path="guitar/exercise-progress" element={<ExerciseProgress instrument="GUITAR" />} />
            <Route path="guitar/practice-session" element={<PracticeSession instrument="GUITAR" />} />
            <Route path="guitar/sessions" element={<SessionList instrument="GUITAR" />} />
            <Route path="guitar/calendar" element={<PracticeCalendar instrument="GUITAR" />} />
            <Route path="guitar/level" element={<LevelDisplay instrument="GUITAR" />} />
            <Route path="guitar/predictions" element={<PredictionDisplay instrument="GUITAR" />} />
            <Route path="guitar/goals" element={<GoalList instrument="GUITAR" />} />
            <Route path="guitar/recommendations" element={<RecommendationsList instrument="GUITAR" />} />

            <Route path="drums/books" element={<BookList instrument="DRUMS" />} />
            <Route path="drums/exercises" element={<ExerciseList instrument="DRUMS" />} />
            <Route path="drums/exercise-progress" element={<ExerciseProgress instrument="DRUMS" />} />
            <Route path="drums/practice-session" element={<PracticeSession instrument="DRUMS" />} />
            <Route path="drums/sessions" element={<SessionList instrument="DRUMS" />} />
            <Route path="drums/calendar" element={<PracticeCalendar instrument="DRUMS" />} />
            <Route path="drums/level" element={<LevelDisplay instrument="DRUMS" />} />
            <Route path="drums/predictions" element={<PredictionDisplay instrument="DRUMS" />} />
            <Route path="drums/goals" element={<GoalList instrument="DRUMS" />} />
            <Route path="drums/recommendations" element={<RecommendationsList instrument="DRUMS" />} />

            <Route path="bass/books" element={<BookList instrument="BASS" />} />
            <Route path="bass/exercises" element={<ExerciseList instrument="BASS" />} />
            <Route path="bass/exercise-progress" element={<ExerciseProgress instrument="BASS" />} />
            <Route path="bass/practice-session" element={<PracticeSession instrument="BASS" />} />
            <Route path="bass/sessions" element={<SessionList instrument="BASS" />} />
            <Route path="bass/calendar" element={<PracticeCalendar instrument="BASS" />} />
            <Route path="bass/level" element={<LevelDisplay instrument="BASS" />} />
            <Route path="bass/predictions" element={<PredictionDisplay instrument="BASS" />} />
            <Route path="bass/goals" element={<GoalList instrument="BASS" />} />
            <Route path="bass/recommendations" element={<RecommendationsList instrument="BASS" />} />

            {/* Rutas legacy (mantener compatibilidad) */}
            <Route path="books" element={<BookList />} />
            <Route path="exercises" element={<ExerciseList />} />
            <Route path="exercise-progress" element={<ExerciseProgress />} />
            <Route path="practice" element={<PracticeTimer />} />
            <Route path="practice-session" element={<PracticeSession />} />
            <Route path="sessions" element={<SessionList />} />
            <Route path="calendar" element={<PracticeCalendar />} />
            <Route path="level" element={<LevelDisplay />} />
            <Route path="predictions" element={<PredictionDisplay />} />
            <Route path="goals" element={<GoalList />} />
            <Route path="recommendations" element={<RecommendationsList />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <NotificationToast />
      <OfflineBanner />
      <PWAUpdatePrompt />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

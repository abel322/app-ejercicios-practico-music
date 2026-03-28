import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Paper,
  Stack,
  Chip,
  Divider,
  alpha,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  TrendingUp,
  Speed,
  Accessibility,
  DirectionsRun,
  MusicNote,
  Timer,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const DrumStudyGuide: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const studyPath = [
    {
      id: 1,
      title: 'Rudimentos y Técnica de Manos',
      subtitle: 'El Alfabeto del Baterista',
      icon: <MusicNote />,
      color: theme.palette.primary.main,
      description: 'Los rudimentos son el alfabeto del baterista. Dominar estos patrones fundamentales es esencial para desarrollar velocidad, control y musicalidad en la batería.',
      books: [
        {
          id: 'stick-control',
          title: 'Stick Control - George Lawrence Stone',
          subtitle: 'Método Fundamental de Control de Baquetas',
          description: '⚠️ REGLA DE ORO: Practica cada ejercicio 20 veces sin parar antes de pasar al siguiente. Esta es la recomendación del autor para obtener resultados satisfactorios. Enfócate en la igualdad de sonido entre ambas manos y usa siempre metrónomo.',
          exercises: [
            {
              name: 'Single Beat Combinations',
              pattern: 'Páginas 5, 6 y 7',
              focus: 'Control básico y alternancia de manos',
              description: 'Patrones fundamentales de golpes simples. Base de toda técnica.',
              bpm: '60-120',
            },
            {
              name: 'Triplets',
              pattern: 'Páginas 8 y 9',
              focus: 'Subdivisión en tresillos',
              description: 'Desarrollo de fluidez en grupos de tres notas.',
              bpm: '60-100',
            },
            {
              name: 'Short Roll Combinations (Single Beat Rolls)',
              pattern: 'Página 10',
              focus: 'Redobles cortos con golpes simples',
              description: 'Introducción a redobles de 5, 7 y 9 golpes.',
              bpm: '50-100',
            },
            {
              name: 'Short Roll Combinations (Double Beat Rolls)',
              pattern: 'Página 11',
              focus: 'Redobles con golpes dobles',
              description: 'Desarrollo de rebote controlado en redobles.',
              bpm: '50-110',
            },
            {
              name: 'Short Roll Combinations',
              pattern: 'Página 12',
              focus: 'Combinaciones mixtas de redobles',
              description: 'Integración de diferentes tipos de redobles.',
              bpm: '50-100',
            },
            {
              name: 'Review of Short Roll Combinations',
              pattern: 'Página 13',
              focus: 'Repaso y consolidación',
              description: 'Revisión de patrones de redobles aprendidos.',
              bpm: '60-110',
            },
            {
              name: 'Short Rolls and Triplets',
              pattern: 'Páginas 14 y 15',
              focus: 'Redobles en contexto de tresillos',
              description: 'Combinación de redobles con subdivisión ternaria.',
              bpm: '50-100',
            },
            {
              name: 'Flam Beats',
              pattern: 'Páginas 16, 17, 18, 19, 20, 21, 22 y 23',
              focus: 'Técnica de flam y aplicación rítmica',
              description: 'Desarrollo de flams limpios y controlados. Sección extensa y fundamental.',
              bpm: '50-90',
            },
            {
              name: 'Short Rolls in 6/8',
              pattern: 'Páginas 24, 25, 26 y 27',
              focus: 'Redobles en compás compuesto',
              description: 'Adaptación de redobles a métrica de 6/8.',
              bpm: '60-100',
            },
            {
              name: 'Review of Short Rolls in 6/8',
              pattern: 'Página 28',
              focus: 'Consolidación en 6/8',
              description: 'Repaso de patrones en compás compuesto.',
              bpm: '60-100',
            },
            {
              name: 'Review of Short Roll in 6/8',
              pattern: 'Página 29',
              focus: 'Repaso adicional en 6/8',
              description: 'Refuerzo de conceptos de redobles en compás compuesto.',
              bpm: '60-100',
            },
            {
              name: 'Combinations in 3/8',
              pattern: 'Páginas 30, 31 y 32',
              focus: 'Patrones en compás de 3/8',
              description: 'Ejercicios en métrica de tres octavos.',
              bpm: '70-120',
            },
            {
              name: 'Combinations in 2/4',
              pattern: 'Página 33',
              focus: 'Patrones en compás de 2/4',
              description: 'Desarrollo rítmico en dos por cuatro.',
              bpm: '70-130',
            },
            {
              name: 'Flam Triplets and Dotted Notes',
              pattern: 'Páginas 34, 35, 36 y 37',
              focus: 'Flams en tresillos y notas con puntillo',
              description: 'Técnica avanzada de flams con subdivisiones complejas.',
              bpm: '50-90',
            },
            {
              name: 'Short Roll Progressions',
              pattern: 'Páginas 38, 39, 40, 41, 42 y 43',
              focus: 'Progresiones de redobles',
              description: 'Secuencias progresivas de redobles cortos. Sección extensa.',
              bpm: '50-100',
            },
            {
              name: 'Short Roll Progressions and Triplets',
              pattern: 'Páginas 44, 45 y 46',
              focus: 'Progresiones con tresillos',
              description: 'Combinación final de redobles y subdivisión ternaria.',
              bpm: '50-100',
            },
          ],
        },
        {
          id: 'rudimental-reference',
          title: 'The Drummer\'s Rudimental Reference Book - John Wooton',
          subtitle: 'Sistema de Progresión por Tiers (Niveles)',
          description: '📊 SISTEMA DE TIERS: Este método organiza los rudimentos en 4 niveles de dificultad. NO avances al siguiente Tier sin dominar completamente el anterior. Los rudimentos "padre" del Tier 1 son la base de todo.',
          tiers: [
            {
              tier: 'Fundamentos',
              level: 'Preparación',
              color: '#9C27B0',
              sections: [
                { name: 'Grip and Stroke', pages: 'Pág. 4', description: 'Agarre y técnica de golpe' },
                { name: 'The Five Strokes', pages: 'Pág. 6', description: 'Los 5 tipos de golpe fundamentales' },
                { name: 'One Handed Exercises', pages: 'Pág. 8', description: 'Ejercicios a una mano' },
                { name: 'Hemiolas (Speed Changes)', pages: 'Pág. 13', description: 'Cambios de velocidad' },
                { name: 'Relaxation Exercises', pages: 'Pág. 15', description: 'Ejercicios de relajación' },
                { name: 'Timing Exercises', pages: 'Pág. 16', description: 'Ejercicios de tiempo' },
                { name: 'Stick Control Exercises', pages: 'Pág. 21', description: 'Control de baquetas' },
              ],
            },
            {
              tier: 'Tier 1',
              level: 'Rudimentos Padre (Fundamentales)',
              color: '#4CAF50',
              sections: [
                { name: 'Single Stroke Roll', pages: 'Pág. 29', description: 'Base de toda técnica' },
                { name: 'Multiple Bounce Roll', pages: 'Pág. 41', description: 'Redoble de múltiples rebotes' },
                { name: 'Double Stroke Roll', pages: 'Pág. 44', description: 'Golpes dobles fundamentales' },
                { name: 'Single Paradiddle', pages: 'Pág. 70', description: 'Paradiddle básico' },
                { name: 'Flam', pages: 'Pág. 76', description: 'Golpe apoyado fundamental' },
                { name: 'Drag', pages: 'Pág. 109', description: 'Arrastre básico' },
              ],
            },
            {
              tier: 'Tier 2',
              level: 'Derivados (Básico-Intermedio)',
              color: '#FF9800',
              sections: [
                { name: 'Single Stroke Four', pages: 'Pág. 29', description: 'Variación de golpes simples' },
                { name: 'Single Stroke Seven', pages: 'Pág. 29', description: 'Variación extendida' },
                { name: '5 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 5 golpes' },
                { name: '7 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 7 golpes' },
                { name: 'Double Paradiddle', pages: 'Pág. 70', description: 'Paradiddle doble' },
                { name: 'Flam Accent', pages: 'Pág. 81', description: 'Flam con acento' },
                { name: 'Flam Tap', pages: 'Pág. 87', description: 'Flam con tap' },
                { name: 'Flamacue', pages: 'Pág. 83', description: 'Combinación de flam' },
                { name: 'Single Drag Tap', pages: 'Pág. 112', description: 'Drag con tap' },
                { name: 'Single Ratamacue', pages: 'Pág. 120', description: 'Ratamacue simple' },
              ],
            },
            {
              tier: 'Tier 3',
              level: 'Complejos (Intermedio-Avanzado)',
              color: '#F44336',
              sections: [
                { name: '9 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 9 golpes' },
                { name: '11 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 11 golpes' },
                { name: '13 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 13 golpes' },
                { name: '15 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 15 golpes' },
                { name: 'Triple Paradiddle', pages: 'Pág. 70', description: 'Paradiddle triple' },
                { name: 'Paradiddle-Diddle', pages: 'Pág. 75', description: 'Paradiddle con diddle' },
                { name: 'Flam Paradiddle', pages: 'Pág. 85', description: 'Flam con paradiddle' },
                { name: 'Double Drag Tap', pages: 'Pág. 115', description: 'Drag doble con tap' },
                { name: 'Single Drag Paradiddle', pages: 'Pág. 118', description: 'Drag con paradiddle' },
                { name: 'Double Ratamacue', pages: 'Pág. 123', description: 'Ratamacue doble' },
              ],
            },
            {
              tier: 'Tier 4',
              level: 'Maestría (Avanzado)',
              color: '#9C27B0',
              sections: [
                { name: '17 Stroke Roll', pages: 'Pág. 49', description: 'Redoble de 17 golpes' },
                { name: 'Flam Paradiddle-Diddle', pages: 'Pág. 90', description: 'Combinación híbrida' },
                { name: 'Pataflafla', pages: 'Pág. 92', description: 'Rudimento complejo' },
                { name: 'Swiss Army Triplet', pages: 'Pág. 94', description: 'Tresillo suizo' },
                { name: 'Inverted Flam Tap', pages: 'Pág. 97', description: 'Flam tap invertido' },
                { name: 'Flam Drag', pages: 'Pág. 99', description: 'Flam con drag' },
                { name: 'Flam Stutters / Flam Fives', pages: 'Pág. 101', description: 'Flam stutter' },
                { name: 'Triple Ratamacue', pages: 'Pág. 125', description: 'Ratamacue triple' },
                { name: 'All Rudiment Combinations', pages: 'Pág. 129', description: 'Combinaciones avanzadas' },
                { name: 'Back Sticking', pages: 'Pág. 137', description: 'Técnica visual' },
              ],
            },
          ],
        },
        {
          id: 'rudimental-remedies',
          title: 'Dr. Throwdown\'s Rudimental Remedies - John Wooton',
          subtitle: 'Sistema de 7 Tempos con Audio',
          description: '🎵 SISTEMA DE 7 TEMPOS: Cada ejercicio incluye pistas de audio en 7 velocidades distintas. Wooton recomienda tocar TODOS los tempos, ya que los más lentos son a menudo más difíciles debido al espacio entre notas que exige mayor concentración rítmica. Usa la misma técnica en el tempo 1 que en el tempo 5.',
          levels: [
            {
              level: 'Nivel Básico',
              subtitle: 'Fundamentos del Golpe y Control Inicial',
              color: '#4CAF50',
              description: 'Se enfoca en los movimientos primarios y los rudimentos que establecen la base de la técnica.',
              lessons: [
                { name: 'Lesson 1: Rebound Strokes', pages: 'Pág. 6', description: 'Golpes de rebote' },
                { name: 'Lesson 2: All Strokes', pages: 'Pág. 8', description: 'Golpes controlados, taps y upstrokes' },
                { name: 'Lesson 3: Single Stroke Rolls', pages: 'Pág. 10', description: 'Redobles de golpes simples' },
                { name: 'Lesson 4: Multiple Bounce Rolls', pages: 'Pág. 12', description: 'Redoble de rebote múltiple/orquestal' },
                { name: 'Lesson 5: Single Paradiddles', pages: 'Pág. 14', description: 'Paradiddles básicos' },
                { name: 'Lesson 6: Five, Seven & Nine Stroke Rolls', pages: 'Pág. 16', description: 'Redobles de 5, 7 y 9 golpes' },
                { name: 'Lesson 7: Double Paradiddles & Paradiddle-diddles', pages: 'Pág. 18', description: 'Paradiddles dobles y con diddles' },
              ],
            },
            {
              level: 'Nivel Intermedio',
              subtitle: 'Rudimentos Estándar y Coordinación',
              color: '#FF9800',
              description: 'Introduce notas de adorno (gracia) y combinaciones rítmicas más exigentes.',
              lessons: [
                { name: 'Lesson 8: Flams & Flam Accents', pages: 'Pág. 20', description: 'Golpes apoyados' },
                { name: 'Lesson 9: Six, Nine, Ten & Eleven Stroke Rolls', pages: 'Pág. 22', description: 'Redobles de 6, 9, 10 y 11 golpes' },
                { name: 'Lesson 10: Ruffs & Drags', pages: 'Pág. 24', description: 'Ruffs y drags' },
                { name: 'Lesson 11: Lesson 25 & Drag Paradiddle #1', pages: 'Pág. 26', description: 'Drag paradiddle #1' },
                { name: 'Lesson 12: Roll Grids', pages: 'Pág. 28', description: 'Cuadrículas de redobles' },
                { name: 'Lesson 13: Flam Taps & Single Flammed Mills', pages: 'Pág. 30', description: 'Flam taps y mills' },
                { name: 'Lesson 14: Triple Paradiddles & Drag Paradiddle #2', pages: 'Pág. 32', description: 'Paradiddles triples y drag paradiddle #2' },
                { name: 'Lesson 15: Thirteen, Fifteen & Seventeen Stroke Rolls', pages: 'Pág. 34', description: 'Redobles de 13, 15 y 17 golpes' },
                { name: 'Lesson 18: Stick Control', pages: 'Pág. 40', description: 'Ejercicios de control de baquetas' },
              ],
            },
            {
              level: 'Nivel Avanzado',
              subtitle: 'Rudimentos Complejos e Invertidos',
              color: '#F44336',
              description: 'Requiere un dominio total de los tipos de golpe y una gran relajación a altas velocidades.',
              lessons: [
                { name: 'Lesson 16: Flamacues', pages: 'Pág. 36', description: 'Flamacues' },
                { name: 'Lesson 17: Ratamacues', pages: 'Pág. 38', description: 'Ratamacues' },
                { name: 'Lesson 19: Flam Paradiddles', pages: 'Pág. 42', description: 'Flam paradiddles' },
                { name: 'Lesson 20: Double Drags', pages: 'Pág. 44', description: 'Drags dobles' },
                { name: 'Lesson 21: Double & Triple Ratamacues', pages: 'Pág. 46', description: 'Ratamacues dobles y triples' },
                { name: 'Lesson 22: Swiss Army Triplets', pages: 'Pág. 48', description: 'Swiss army triplets' },
                { name: 'Lesson 23: Pataflaflas', pages: 'Pág. 50', description: 'Pataflaflas' },
                { name: 'Lesson 24: Inverted Flam Taps & Flam Paradiddle-diddles', pages: 'Pág. 52', description: 'Flam taps invertidos y flam paradiddle-diddles' },
                { name: 'Lesson 25: Flam Drags & Flam Fives', pages: 'Pág. 54', description: 'Flam drags y flam fives' },
              ],
            },
          ],
        },
        {
          id: 'master-studies',
          title: 'Master Studies - Joe Morello',
          subtitle: 'Control, Técnica y Sensibilidad Avanzada',
          description: '🎯 FILOSOFÍA MORELLO: Este NO es un libro de instrucciones sobre "cómo tocar", sino un recurso para perfeccionar la ejecución independientemente de la técnica que uses. La técnica es solo un medio para un fin: tocar instantáneamente cualquier cosa que escuches en tu mente de forma musical.',
          levels: [
            {
              level: 'Nivel Básico',
              subtitle: 'Fundamentos del Acento y el Control',
              color: '#4CAF50',
              description: 'Se trabaja la distinción clara entre dos niveles dinámicos: la nota acentuada y la nota suave (tap).',
              lessons: [
                { name: 'Accent Studies', pages: 'Pág. 6', description: 'Estudios de acentos' },
                { name: '8th Notes With Accents', pages: 'Pág. 6', description: 'Corcheas con acentos' },
                { name: 'Triplets With Accents', pages: 'Pág. 12', description: 'Tresillos con acentos' },
                { name: '8th-Note and Triplet Combinations', pages: 'Pág. 18', description: 'Combinaciones de corcheas y tresillos' },
                { name: 'Sticking Exercise', pages: 'Pág. 40', description: 'Cambiar de un patrón de manos a otro sin que cambie el sonido' },
              ],
            },
            {
              level: 'Nivel Intermedio',
              subtitle: 'Desarrollo del Rebote y la Velocidad',
              color: '#FF9800',
              description: 'Control de la presión de los dedos para pasar de golpes simples a redobles cerrados (buzz rolls).',
              lessons: [
                { name: 'Buzz Roll Studies', pages: 'Pág. 20', description: 'Estudios de redoble cerrado' },
                { name: '8th Notes With Buzz Rolls', pages: 'Pág. 20', description: 'Corcheas con buzz rolls' },
                { name: 'Triplets With Buzz Rolls', pages: 'Pág. 25', description: 'Tresillos con buzz rolls' },
                { name: 'Stroke Combination Studies', pages: 'Pág. 30', description: 'Combinaciones de golpes' },
                { name: 'Singles, Doubles y Buzzes', pages: 'Págs. 30-33', description: 'Combinaciones de singles, doubles y buzzes' },
                { name: 'Roll Combinations', pages: 'Págs. 34-39', description: 'Redobles de 5, 7 y 9 golpes' },
                { name: 'Initial Control Studies', pages: 'Pág. 42', description: 'Estudios de control inicial' },
                { name: 'Table of Time', pages: 'Pág. 42', description: 'Tabla del tiempo/subdivisiones' },
                { name: 'Velocity', pages: 'Pág. 45', description: 'Velocidad y relajación' },
              ],
            },
            {
              level: 'Nivel Avanzado',
              subtitle: 'Resistencia, Dinámica e Independencia',
              color: '#F44336',
              description: 'Exige relajación extrema y resistencia física superior, además de coordinación avanzada.',
              lessons: [
                { name: 'The Stone "Killer"', pages: 'Pág. 54', description: 'Ejercicio estrella para ganar resistencia extrema trabajando cada mano por separado' },
                { name: 'Advanced Control Studies', pages: 'Pág. 48', description: 'Estudios de control avanzado' },
                { name: 'Progressive Accents', pages: 'Pág. 48', description: 'Acentos progresivos' },
                { name: 'Dynamics', pages: 'Pág. 52', description: 'Control dinámico de pp a ff' },
                { name: 'Fill-In Studies', pages: 'Pág. 66', description: 'Estudios de rellenos' },
                { name: 'Fill-In Groups', pages: 'Págs. 66-75', description: 'Grupos de dos, tres y cuatro con notas de relleno entre acentos' },
                { name: 'Ostinato Studies', pages: 'Pág. 76', description: 'Independencia total: una mano mantiene un patrón fijo mientras la otra improvisa' },
                { name: 'Flam Studies', pages: 'Pág. 82', description: 'Estudios de flams' },
                { name: 'Flat Flams', pages: 'Págs. 82-93', description: 'Golpes simultáneos exactos y variaciones' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Fraseo Profesional en Rudimentos',
      subtitle: 'De la Técnica a la Musicalidad',
      icon: <MusicNote />,
      color: theme.palette.secondary.main,
      description: 'Transforma los rudimentos en frases musicales aplicables en solos y grooves. Estos ejercicios desarrollan el "vocabulario" del baterista profesional.',
      books: [
        {
          id: 'gaddiments',
          title: 'Gaddiments - Steve Gadd',
          subtitle: 'Rudimentos Híbridos y Desplazamientos',
          description: '🎵 EL TOQUE GADD: No se trata solo de velocidad, sino de la calidad del sonido. Los acentos deben ser claros, pero las notas no acentuadas (ghost notes) deben ser muy suaves y consistentes. El objetivo es usar estos "Gaddiments" como frases musicales en solos o grooves.',
          levels: [
            {
              level: 'Nivel Inicial',
              subtitle: 'Calentamiento y Cimientos',
              color: '#4CAF50',
              description: 'Establece el control necesario para los desplazamientos. Se centra en la fluidez y el calentamiento básico.',
              lessons: [
                { name: 'Warm Up', pages: 'Pág. 1', description: 'Calentamiento' },
                { name: 'Flam Paradiddles Displaced', pages: 'Pág. 3', description: 'Flam paradiddles desplazados' },
                { name: 'Flam Taps & Flam Paradiddles Displaced', pages: 'Pág. 4', description: 'Flam taps y flam paradiddles desplazados' },
              ],
            },
            {
              level: 'Nivel Intermedio',
              subtitle: 'Variaciones y Desplazamientos',
              color: '#FF9800',
              description: 'Introduce variaciones rítmicas y cambios en el "sticking" (digitación) que desafían la coordinación y el sentido del pulso.',
              lessons: [
                { name: 'Flam Tap Variations', pages: 'Pág. 5', description: 'Variaciones de flam tap' },
                { name: 'Reversed Flam Tap Variations', pages: 'Pág. 7', description: 'Variaciones de flam tap invertido' },
                { name: 'Flam Taps w/Different Stickings', pages: 'Pág. 9', description: 'Flam taps con diferentes digitaciones' },
                { name: 'Fladiflaflas Displaced', pages: 'Pág. 11', description: 'Fladiflaflas desplazados' },
                { name: 'Fladiflaflas & Flam Paradiddles Displaced', pages: 'Pág. 12', description: 'Fladiflaflas y flam paradiddles desplazados' },
                { name: 'Flam Accents & Flam Paradiddles Displaced - Flambé', pages: 'Pág. 13', description: 'Flam accents y flam paradiddles desplazados' },
              ],
            },
            {
              level: 'Nivel Avanzado',
              subtitle: 'Híbridos Complejos y Aplicación de Drags',
              color: '#F44336',
              description: 'Máxima complejidad. Combina rudimentos híbridos suizos con arrastres (drags) y desplazamientos rítmicos que requieren independencia y precisión extremas.',
              lessons: [
                { name: 'Swiss Flamadiddles Displaced - Not Homeless', pages: 'Pág. 14', description: 'Swiss flamadiddles desplazados' },
                { name: 'Swiss Flam Accents Swiss Flamadiddle Combo Displaced', pages: 'Pág. 15', description: 'Combo de swiss flam accents y flamadiddles desplazados' },
                { name: 'Swiss Flam Accent & Swiss Flamadiddle Grooves', pages: 'Pág. 16', description: 'Grooves con swiss flam accents y flamadiddles' },
                { name: 'Flam Accents Displaced - Not Lost', pages: 'Pág. 17', description: 'Flam accents desplazados' },
                { name: 'Flam Accents w/Drags - No Mustard', pages: 'Pág. 18', description: 'Flam accents con drags' },
                { name: 'Swiss Flam Accents Displaced - Not Lost', pages: 'Pág. 19', description: 'Swiss flam accents desplazados' },
                { name: 'Swiss Flam Accents w/Drags Displaced - Fondu', pages: 'Pág. 20', description: 'Swiss flam accents con drags desplazados' },
                { name: 'Fladiflaflas w/Flam Accents Displaced - To Go', pages: 'Pág. 21', description: 'Fladiflaflas con flam accents desplazados' },
                { name: 'Fladiflaflas w/Flam Accents Displaced - Baked', pages: 'Pág. 22', description: 'Fladiflaflas con flam accents desplazados (variación)' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'Independencia y Coordinación',
      subtitle: 'Cada Extremidad con Vida Propia',
      icon: <Accessibility />,
      color: theme.palette.success.main,
      description: 'El reto de la batería es que cada extremidad haga algo distinto sin que una interfiera con la otra.',
      books: [
        {
          id: '4-way-coordination',
          title: '4-Way Coordination - Marvin Dahlgren & Elliot Fine',
          subtitle: 'La Biblia de la Independencia',
          description: '🎯 INDEPENDENCIA ABSOLUTA: Este no es un libro de ritmos específicos, sino un método puramente técnico diseñado para que tus cuatro extremidades funcionen de manera totalmente independiente. Es un "acondicionamiento cerebral" que rompe las barreras entre lo que piensas y lo que tus extremidades pueden ejecutar.',
          levels: [
            {
              level: 'Nivel 1: Básico',
              subtitle: 'Coordinación Melódica',
              color: '#4CAF50',
              description: 'Solo una mano o un pie toca a la vez. Es el punto de partida esencial para conectar el cerebro con cada extremidad de forma individual.',
              lessons: [
                { name: 'Melodic Coordination (Exercises in 8th Notes)', pages: 'Pág. 4', description: 'Corcheas simples alternando extremidades' },
                { name: 'Eighth Note Solos', pages: 'Pág. 7', description: 'Solos básicos en corcheas para aplicar la alternancia' },
                { name: 'Melodic Coordination (Exercises in Triplets)', pages: 'Pág. 9', description: 'Introducción al tresillo alternando manos y pies' },
                { name: 'Triplet Solos', pages: 'Pág. 10', description: 'Solos en subdivisión ternaria' },
                { name: 'Combining 8th Notes and Triplets in Solos', pages: 'Pág. 13', description: 'Mezcla de ritmos binarios y ternarios' },
              ],
            },
            {
              level: 'Nivel 2: Intermedio',
              subtitle: 'Coordinación Armónica de 2 Partes',
              color: '#FF9800',
              description: 'Tocar más de una mano o pie al mismo tiempo. Comienzas a tocar patrones con las manos mientras los pies hacen algo distinto.',
              lessons: [
                { name: 'Two-Part Harmonic Coordination (8th Notes)', pages: 'Pág. 15', description: 'Combinaciones de dos extremidades en corcheas' },
                { name: 'Eighth Note Solos in Two-Part', pages: 'Pág. 18', description: 'Solos de independencia de dos vías' },
                { name: 'Two-Part Harmonic Coordination (Triplets)', pages: 'Pág. 20', description: 'Independencia de dos vías en tresillos' },
                { name: 'Triplet Solos in Two-Part', pages: 'Pág. 22', description: 'Solos ternarios de independencia' },
                { name: 'Combining 8th Notes and Triplets', pages: 'Pág. 23', description: 'El reto de tocar un ritmo diferente en cada capa' },
              ],
            },
            {
              level: 'Nivel 3: Avanzado',
              subtitle: 'Coordinación a 4 Vías e Independencia Total',
              color: '#F44336',
              description: 'El núcleo del libro, donde las cuatro extremidades trabajan de manera simultánea e independiente.',
              lessons: [
                { name: 'Four-Way Coordination', pages: 'Pág. 24', description: 'Ejercicios básicos integrando las 4 extremidades' },
                { name: 'Four-Way Coordination on the Drum Set', pages: 'Pág. 27', description: 'Aplicación con la mano derecha en el platillo ride' },
                { name: 'Studies to Develop the Left Foot', pages: 'Pág. 28', description: 'Enfoque específico en el control del Hi-hat' },
                { name: 'Adding the Left Hand', pages: 'Pág. 29', description: 'Integración de la mano izquierda en el redoblante' },
                { name: 'Complete Independence in Multiple Time Signatures', pages: 'Pág. 32', description: 'Ejercicios en compases de 2/4, 3/4, 4/4, 5/4 y 6/4' },
                { name: 'Three-beat Ideas in 4/4 Time', pages: 'Pág. 48', description: 'Desplazamientos rítmicos avanzados' },
                { name: 'Solos Written in Complete Independence', pages: 'Pág. 51', description: 'Piezas musicales finales que exigen control total' },
              ],
            },
            {
              level: 'Nivel 4: Maestro',
              subtitle: 'Polirritmia Avanzada',
              color: '#9C27B0',
              description: 'Tocar dos o más ritmos independientes y contrastantes simultáneamente.',
              lessons: [
                { name: 'Advanced Polyrhythmics', pages: 'Pág. 54', description: 'Ejercicios de 12/8 contra 4/4 y otras métricas amalgamas' },
              ],
            },
          ],
        },
        {
          id: 'drumset-control',
          title: 'Drumset Control - Ron Spagnardi',
          subtitle: 'Agilidad y Fluidez por Todo el Set',
          description: '🥁 MOVIMIENTO FLUIDO: Método técnico diseñado para desarrollar agilidad, velocidad y precisión al moverte por toda la batería. A diferencia de los libros de rudimentos que se centran solo en las manos, este libro te enseña a trasladar esos patrones a los diferentes tambores (redoblante, toms y gran tom) de manera fluida.',
          levels: [
            {
              level: 'Parte 1: Tresillos',
              subtitle: 'Nivel Básico',
              color: '#4CAF50',
              description: 'Establece los fundamentos del movimiento rítmico ternario por el set.',
              lessons: [
                { name: 'One Group Of Triplets', pages: 'Pág. 4', description: 'Un grupo de tresillos' },
                { name: 'Two Groups Of Triplets', pages: 'Pág. 5', description: 'Dos grupos de tresillos' },
                { name: 'Three Groups Of Triplets', pages: 'Pág. 9', description: 'Tres grupos de tresillos' },
                { name: 'Four Groups Of Triplets', pages: 'Pág. 12', description: 'Cuatro grupos de tresillos' },
                { name: 'Two-Bar Patterns', pages: 'Pág. 16', description: 'Patrones de dos compases' },
                { name: 'Triplet Fills', pages: 'Pág. 17', description: 'Rellenos de tresillos' },
              ],
            },
            {
              level: 'Parte 2: Semicorcheas',
              subtitle: 'Nivel Intermedio',
              color: '#FF9800',
              description: 'Se incrementa la densidad de notas y se trabaja la subdivisión binaria.',
              lessons: [
                { name: 'One Group Of 16th Notes', pages: 'Pág. 18', description: 'Un grupo de semicorcheas' },
                { name: 'Two Groups Of 16th Notes', pages: 'Pág. 20', description: 'Dos grupos de semicorcheas' },
                { name: 'Three Groups Of 16th Notes', pages: 'Pág. 24', description: 'Tres grupos de semicorcheas' },
                { name: 'Four Groups Of 16th Notes', pages: 'Pág. 29', description: 'Cuatro grupos de semicorcheas' },
                { name: 'Two-Bar Patterns', pages: 'Pág. 34', description: 'Patrones de dos compases' },
                { name: '16th-Note Fills', pages: 'Pág. 35', description: 'Rellenos de semicorcheas' },
              ],
            },
            {
              level: 'Parte 3: Seisillos',
              subtitle: 'Nivel Avanzado',
              color: '#F44336',
              description: 'Requiere mayor velocidad y precisión en el control de manos al moverse entre tambores.',
              lessons: [
                { name: 'One Group Of 16th-Note Triplets', pages: 'Pág. 36', description: 'Un grupo de seisillos' },
                { name: 'Two Groups Of 16th-Note Triplets', pages: 'Pág. 39', description: 'Dos grupos de seisillos' },
                { name: 'Three Groups Of 16th-Note Triplets', pages: 'Pág. 43', description: 'Tres grupos de seisillos' },
                { name: 'Four Groups Of 16th-Note Triplets', pages: 'Pág. 46', description: 'Cuatro grupos de seisillos' },
                { name: 'Two-Bar Patterns', pages: 'Pág. 50', description: 'Patrones de dos compases' },
                { name: '16th-Note-Triplet Fills', pages: 'Pág. 51', description: 'Rellenos de seisillos' },
              ],
            },
            {
              level: 'Parte 4: Fusas',
              subtitle: 'Nivel Experto',
              color: '#9C27B0',
              description: 'La sección más exigente del libro, diseñada para desarrollar fluidez técnica extrema.',
              lessons: [
                { name: 'One Group Of 32nd Notes', pages: 'Pág. 52', description: 'Un grupo de fusas' },
                { name: 'Two Groups Of 32nd Notes', pages: 'Pág. 58', description: 'Dos grupos de fusas' },
                { name: 'Three Groups Of 32nd Notes', pages: 'Pág. 64', description: 'Tres grupos de fusas' },
                { name: 'Four Groups Of 32nd Notes', pages: 'Pág. 70', description: 'Cuatro grupos de fusas' },
                { name: 'Two-Bar Patterns', pages: 'Pág. 76', description: 'Patrones de dos compases' },
                { name: '32nd-Note Fills', pages: 'Pág. 78', description: 'Rellenos de fusas' },
              ],
            },
          ],
        },
        {
          id: 'jungle-drum-bass',
          title: 'Jungle/Drum \'n\' Bass For the Acoustic Drum Set - Johnny Rabb',
          subtitle: 'Música Electrónica en Batería Acústica',
          description: '🎛️ SIMULACIÓN ELECTRÓNICA: Guía técnica para aplicar patrones de música electrónica moderna al set acústico. Simula sonidos electrónicos (loops y samples procesados) usando técnicas de afinación poco ortodoxas, múltiples cajas y platillos específicos. Reconocido como el libro educativo #1 por Modern Drummer.',
          levels: [
            {
              level: 'Fundamentos',
              subtitle: 'Teoría y Setup',
              color: '#9C27B0',
              description: 'Conceptos básicos del estilo, configuración del set y técnicas de afinación para obtener sonidos electrónicos.',
              lessons: [
                { name: 'Introducción', pages: 'Pág. 13', description: 'Propósito y misión del método' },
                { name: '¿Qué es el Jungle/Drum \'n\' Bass?', pages: 'Pág. 14', description: 'Definición de los estilos y sus diferencias rítmicas' },
                { name: 'Samplers y CDs de Sampleo', pages: 'Págs. 15-16', description: 'El rol de la tecnología en la creación de estos ritmos' },
                { name: 'Entrevista con Clyde Stubblefield', pages: 'Pág. 19', description: 'La influencia de los grooves de funk originales' },
                { name: 'Setup y Sonidos', pages: 'Pág. 20', description: 'Posibilidades de afinación de tambores' },
                { name: 'Configuración de Platillos', pages: 'Pág. 22', description: 'Configuración de platillos y accesorios' },
                { name: 'Tips de Práctica', pages: 'Pág. 22', description: 'Recomendaciones para el estudio con metrónomo y loops' },
                { name: 'Clave de Notación', pages: 'Pág. 24', description: 'Explicación de los símbolos usados en las partituras' },
              ],
            },
            {
              level: 'Nivel Básico',
              subtitle: 'Grooves Fundamentales',
              color: '#4CAF50',
              description: 'Ejercicios preliminares y grooves básicos en corcheas y semicorcheas.',
              lessons: [
                { name: 'Chapter 1: Preliminary Exercises', pages: 'Pág. 26', description: 'Fundamentos en corcheas y semicorcheas' },
                { name: 'Chapter 2: Eighth-Note Grooves', pages: 'Pág. 31', description: 'Fragmentos y ejercicios de un compás y fuera de tiempo' },
                { name: 'Chapter 3: Sixteenth-Note Grooves', pages: 'Pág. 45', description: 'Patrones de alta precisión y velocidad' },
                { name: 'Chapter 4: Basic Rolls and Buzzes', pages: 'Pág. 55', description: 'Simulación de redobles electrónicos procesados' },
              ],
            },
            {
              level: 'Nivel Intermedio',
              subtitle: 'Técnicas Especializadas',
              color: '#FF9800',
              description: 'Patrones lineales, técnicas de hi-hat y uso de múltiples cajas.',
              lessons: [
                { name: 'Chapter 5: Unison Jungle', pages: 'Pág. 69', description: 'Ejercicios donde la caja o el bombo tocan junto al Hi-Hat' },
                { name: 'Chapter 6: Linear Jungle Grooves', pages: 'Pág. 89', description: 'Patrones donde no se tocan dos instrumentos al mismo tiempo' },
                { name: 'Chapter 7: Hi-Hat Exercises', pages: 'Pág. 103', description: 'Técnicas de apertura y cierre para expandir las texturas' },
                { name: 'Chapter 8: Multiple Snare Jungle Grooves', pages: 'Pág. 107', description: 'Uso de dos o más cajas para imitar cambios de sample' },
              ],
            },
            {
              level: 'Nivel Avanzado',
              subtitle: 'Integración y Electrónica',
              color: '#F44336',
              description: 'Grooves complejos, doble pedal, transcripciones y técnicas electrónicas.',
              lessons: [
                { name: 'Chapter 9: Split Grooves', pages: 'Pág. 119', description: 'Combinaciones rítmicas avanzadas entre el kit' },
                { name: 'Chapter 10: Ostinato Grooves', pages: 'Pág. 125', description: 'Mantenimiento de patrones fijos con rellenos auxiliares' },
                { name: 'Chapter 11: Double-Bass Jungle Grooves', pages: 'Pág. 129', description: 'Aplicación del doble pedal al estilo' },
                { name: 'Chapter 12: Transcriptions', pages: 'Pág. 133', description: 'Análisis de ritmos de artistas como DJ Goldie y Soul Coughing' },
                { name: 'Chapter 13: Advanced Sound Exercises', pages: 'Pág. 137', description: 'Uso de mutes, baquetas especiales (RhythmSaw) y platillos auxiliares' },
                { name: 'Chapter 14: Freehand Technique', pages: 'Pág. 145', description: 'Movimientos avanzados para mayor velocidad' },
                { name: 'Chapter 15: Basic Electronics', pages: 'Pág. 147', description: 'Guía sobre samplers de frase (Roland SP-303) y controladores de pads' },
                { name: 'Chapter 16: Putting It All Together', pages: 'Pág. 149', description: 'Ejemplos finales que combinan todos los conceptos' },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          name: 'Ostinatos',
          pattern: 'Pies fijos + Manos variables',
          focus: 'Mantener base constante mientras improvisan las manos',
          description: 'Bombo en negras y hi-hat en 2 y 4, mientras las manos hacen rudimentos.',
          bpm: '60-100',
        },
        {
          name: 'Lectura de Síncopa',
          pattern: 'Ritmos sincopados sobre base constante',
          focus: 'Que ninguna extremidad arrastre a la otra',
          description: 'Tocar ritmos complejos de manos sobre una base simple de pies.',
          bpm: '70-120',
        },
        {
          name: 'Linear Chops',
          pattern: 'Mano - Mano - Pie o Mano - Pie - Mano',
          focus: 'No coinciden dos notas al mismo tiempo',
          description: 'Ejercicios lineales donde cada golpe es independiente.',
          bpm: '60-110',
        },
      ],
    },
    {
      id: 4,
      title: 'Control de Pies',
      subtitle: 'Nivelando el Pie Débil',
      icon: <DirectionsRun />,
      color: theme.palette.warning.main,
      description: 'Es común que el pie izquierdo (hi-hat) sea el más débil. Estos ejercicios buscan nivelarlo con el derecho.',
      books: [
        {
          id: 'bass-drum-control',
          title: 'Bass Drum Control - Colin Bailey',
          subtitle: 'Técnica, Control y Velocidad del Pedal',
          description: '🦶 DOMINIO DEL PEDAL: Método clásico diseñado específicamente para desarrollar la técnica, el control, la flexibilidad y la velocidad del pie en el bombo. Bailey se enfoca en enseñar a dominar el pedal mediante el uso del rebote, recomendando inicialmente la técnica de "talón abajo" (heel down) y la identificación del "punto dulce" (sweet spot) del pedal.',
          levels: [
            {
              level: 'Nivel 1: Básico',
              subtitle: 'Fundamentos y Desarrollo de Control',
              color: '#4CAF50',
              description: 'Se centra en la postura correcta y en establecer la coordinación básica entre el pie y el pulso.',
              lessons: [
                { name: 'Prefacio e Instrucciones de Técnica', pages: 'Págs. 2-3', description: 'Explicación del agarre del pedal y el movimiento del pie' },
                { name: 'Control Development', pages: 'Pág. 4', description: 'Ejercicios iniciales con negras y tresillos' },
                { name: 'Accents', pages: 'Pág. 5', description: 'Desarrollo de diferentes intensidades dinámicas con el pie' },
              ],
            },
            {
              level: 'Nivel 2: Intermedio',
              subtitle: 'Patrones de Semicorcheas y Rudimentos',
              color: '#FF9800',
              description: 'Introduce la velocidad y la aplicación de patrones rítmicos más complejos.',
              lessons: [
                { name: 'Single Bass Drum Beats', pages: 'Pág. 6', description: 'Ejercicios de un solo golpe combinados con manos en semicorcheas' },
                { name: 'Double Bass Drum Beats', pages: 'Pág. 7', description: 'Introducción de golpes dobles rápidos' },
                { name: 'Triple and Quadruple Beats', pages: 'Págs. 11, 14', description: 'Tres y cuatro golpes consecutivos' },
                { name: 'Beats Múltiples (5 a 8 golpes)', pages: 'Págs. 15-17', description: 'Desarrollo de ráfagas largas de notas' },
                { name: 'Sixteenth Note Patterns', pages: 'Págs. 19-20', description: 'Variaciones rítmicas aplicadas' },
                { name: 'Rudimental Exercises', pages: 'Pág. 21', description: 'Aplicación de rudimentos como paradiddles y ruffs al bombo' },
              ],
            },
            {
              level: 'Nivel 3: Avanzado',
              subtitle: 'Resistencia, Independencia y Solos',
              color: '#F44336',
              description: 'Exige alta capacidad física y coordinación avanzada entre las cuatro extremidades.',
              lessons: [
                { name: 'Endurance Exercise', pages: 'Pág. 18', description: 'Secuencias de 4 a 15 golpes seguidos' },
                { name: 'Combination Triplets', pages: 'Pág. 23', description: 'Mezcla compleja de tresillos' },
                { name: 'Contrapuntal Exercises', pages: 'Págs. 27-28', description: 'Independencia total con patrones cruzados' },
                { name: 'Exercises with Tom-Toms', pages: 'Pág. 29', description: 'Integración del bombo con el resto del set' },
                { name: 'Four Bar Solos (Estilo Funk)', pages: 'Pág. 30', description: 'Aplicación musical en frases de cuatro compases' },
                { name: 'Triplet Solo', pages: 'Pág. 31', description: 'Solo basado íntegramente en subdivisiones ternarias' },
                { name: 'Solo on "Agitation"', pages: 'Págs. 32-34', description: 'Pieza final de alta complejidad técnica' },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          name: 'Talón Arriba vs. Talón Abajo',
          pattern: 'Técnicas de pedal',
          focus: 'Potencia vs. Control fino',
          description: 'Practicar ambas técnicas para dominar diferentes situaciones.',
          bpm: '60-140',
        },
        {
          name: 'Control de Bombo',
          pattern: 'Dobles golpes rápidos',
          focus: 'Técnicas de slide o swivel',
          description: 'Dobles con un solo pedal para velocidad sin doble pedal.',
          bpm: '80-160',
        },
        {
          name: 'Independencia del Hi-hat',
          pattern: 'Tiempos 2 y 4, o contratiempos',
          focus: 'Marcar el backbeat mientras tocas grooves',
          description: 'Hi-hat en 2 y 4 mientras tocas ritmos de rock o jazz.',
          bpm: '70-130',
        },
      ],
    },
    {
      id: 5,
      title: 'Groove y Tiempo (Timekeeping)',
      subtitle: 'La Función Principal del Baterista',
      icon: <Timer />,
      color: theme.palette.error.main,
      description: 'Mantener el pulso es la responsabilidad número uno. Todo lo demás es secundario.',
      exercises: [
        {
          name: 'Subdivisiones',
          pattern: 'Negras → Corcheas → Tresillos → Semicorcheas',
          focus: 'Mantener tempo constante en todas las subdivisiones',
          description: 'Pasar entre subdivisiones sin variar el tempo (siempre con metrónomo).',
          bpm: '60-120',
        },
        {
          name: 'Desplazamiento de Acentos',
          pattern: 'Ritmo básico con acento móvil',
          focus: 'Mover el acento a diferentes partes del compás',
          description: 'Tocar el mismo groove pero acentuando diferentes tiempos.',
          bpm: '70-110',
        },
        {
          name: 'Dinámicas',
          pattern: 'Piano (pp) → Forte (ff)',
          focus: 'Mismo ritmo, diferentes volúmenes',
          description: 'Practicar muy suave y muy fuerte sin perder velocidad ni precisión.',
          bpm: '60-100',
        },
      ],
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          p: 4,
          mb: 4,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 4,
            }}
          >
            <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Guía de Estudio de Batería
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Roadmap Profesional: De Principiante a Avanzado
            </Typography>
            <Typography variant="body1" mt={1}>
              Sigue este camino estructurado para desarrollar una técnica sólida y convertirte en un baterista completo.
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Study Path - Accordions */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {studyPath.map((section, index) => (
          <Accordion
            key={section.id}
            expanded={expanded === section.id}
            onChange={handleAccordionChange(section.id)}
            sx={{
              border: `2px solid ${alpha(section.color, 0.3)}`,
              borderRadius: '12px !important',
              overflow: 'hidden',
              '&:before': { display: 'none' },
              boxShadow: expanded === section.id ? 4 : 2,
              transition: 'all 0.3s',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: section.color, fontSize: 32 }} />}
              sx={{
                background: `linear-gradient(135deg, ${alpha(section.color, 0.1)} 0%, ${alpha(section.color, 0.05)} 100%)`,
                minHeight: 80,
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(section.color, 0.15)} 0%, ${alpha(section.color, 0.08)} 100%)`,
                },
                '& .MuiAccordionSummary-content': {
                  my: 2,
                },
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center" width="100%">
                {/* Icon Circle */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: alpha(section.color, 0.15),
                    border: `3px solid ${section.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: section.color,
                    flexShrink: 0,
                  }}
                >
                  {section.icon}
                </Box>

                {/* Title and Subtitle */}
                <Box flex={1}>
                  <Typography variant="h5" fontWeight="bold" color={section.color} gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {section.subtitle}
                  </Typography>
                </Box>

                {/* Step Number */}
                <Chip
                  label={`Paso ${section.id}`}
                  sx={{
                    bgcolor: section.color,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    height: 36,
                  }}
                />
              </Stack>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                p: 4,
                background: `linear-gradient(to bottom, ${alpha(section.color, 0.02)}, white)`,
              }}
            >
                {/* Description */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: alpha(section.color, 0.08),
                    borderLeft: `4px solid ${section.color}`,
                  }}
                >
                  <Typography variant="body1" fontWeight="500">
                    {section.description}
                  </Typography>
                </Paper>

                {/* Books - Nested Accordions */}
                {section.books ? (
                  <Stack spacing={2}>
                    {section.books.map((book: any) => (
                      <Accordion
                        key={book.id}
                        sx={{
                          border: `2px solid ${alpha(section.color, 0.2)}`,
                          borderRadius: '8px !important',
                          '&:before': { display: 'none' },
                          boxShadow: 2,
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: section.color }} />}
                          sx={{
                            background: `linear-gradient(90deg, ${alpha(section.color, 0.08)} 0%, ${alpha(section.color, 0.03)} 100%)`,
                            '&:hover': {
                              background: `linear-gradient(90deg, ${alpha(section.color, 0.12)} 0%, ${alpha(section.color, 0.05)} 100%)`,
                            },
                          }}
                        >
                          <Stack spacing={0.5} width="100%">
                            <Typography variant="h6" fontWeight="bold" color={section.color}>
                              📚 {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {book.subtitle}
                            </Typography>
                          </Stack>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 3, bgcolor: alpha(section.color, 0.02) }}>
                          {/* Golden Rule - Solo para Stick Control */}
                          {book.id === 'stick-control' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.warning.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.warning.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  ⚠️
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                                    REGLA DE ORO DEL AUTOR
                                  </Typography>
                                  <Typography variant="body1" fontWeight="600">
                                    Practica cada ejercicio 20 veces sin parar antes de pasar al siguiente.
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" mt={1}>
                                    Esta es la recomendación de George Lawrence Stone para obtener resultados satisfactorios.
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Tier System Info - Solo para Rudimental Reference */}
                          {book.id === 'rudimental-reference' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.info.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.info.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  📊
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="info.main" gutterBottom>
                                    SISTEMA DE PROGRESIÓN POR TIERS
                                  </Typography>
                                  <Typography variant="body1" fontWeight="600">
                                    NO avances al siguiente Tier sin dominar completamente el anterior.
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" mt={1}>
                                    Los rudimentos "padre" del Tier 1 son la base de todo. Cada nivel superior depende del control desarrollado en los niveles anteriores.
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* 7 Tempos System Info - Solo para Rudimental Remedies */}
                          {book.id === 'rudimental-remedies' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.success.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.success.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🎵
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                                    LAS REGLAS DE NATHAN (Método Wooton)
                                  </Typography>
                                  <Typography variant="body1" fontWeight="600" gutterBottom>
                                    Sistema de 7 Tempos con Pistas de Audio
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="No marques un ejercicio como completado si no lo tocaste de principio a fin en esa pista de audio"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Toca cada ejercicio en cada tempo, sin importar tu nivel de experiencia"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary='"Desalienta, desglosa y luego domina" (Slow it down, break it down, so you can throw it down)'
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Usa la misma técnica en el tempo 1 que en el tempo 5 - practicar lento correctamente facilita ganar velocidad"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Morello Philosophy Info - Solo para Master Studies */}
                          {book.id === 'master-studies' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.secondary.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.secondary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🎯
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>
                                    RECOMENDACIONES DE JOE MORELLO
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Sin orden estricto: puedes saltar a la sección que más necesites en el momento"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Relajación Total: si sientes tensión, detente inmediatamente, baja el tempo y retoma solo cuando estés relajado"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Usa el metrónomo para precisión rítmica, pero nunca como un reto de velocidad que te haga perder la musicalidad"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Aislar las manos: trabaja cada mano individualmente antes de intentar combinarlas"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Usa movimientos corporales naturales que se ajusten a tu fisonomía"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Gadd Touch Info - Solo para Gaddiments */}
                          {book.id === 'gaddiments' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.secondary.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.secondary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🎵
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>
                                    RECOMENDACIONES DE STEVE GADD
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Interpretación de corcheas: Gadd interpreta las corcheas con un ligero sentimiento de swing o shuffle, similar a una Big Band"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="El Toque Gadd: acentos claros, pero las ghost notes deben ser muy suaves y consistentes"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Simetría: desarrolla la misma habilidad en ambas manos. Si un ejercicio empieza con la derecha, practícalo también con la izquierda"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Metrónomo indispensable: para no perderse en los desplazamientos. Empieza muy lento para entender dónde cae cada golpe"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Musicalidad: usa estos Gaddiments como frases musicales en solos o como parte de un groove en el set"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* 4-Way Coordination Info - Solo para 4-Way Coordination */}
                          {book.id === '4-way-coordination' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.info.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.success.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.success.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🎯
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                                    RECOMENDACIONES DE DAHLGREN & FINE
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Entiende la Notación: Línea superior = Mano Derecha, debajo = Mano Izquierda; línea inferior = Pie Derecho, debajo = Pie Izquierdo"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Igualdad de extremidades: El objetivo es que tus pies lleguen a ser tan hábiles como tus manos"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Velocidad Gradual: Comienza extremadamente lento y aumenta solo cuando el patrón se sienta natural y relajado"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Metrónomo: No para buscar velocidad máxima, sino para asegurar que los golpes simultáneos caigan exactamente juntos"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Aislar para Dominar: Si un ejercicio de 4 vías es muy difícil, practica primero solo las manos, luego solo los pies, y finalmente combínalos"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Bass Drum Control Info - Solo para Bass Drum Control */}
                          {book.id === 'bass-drum-control' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.warning.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.warning.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🦶
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                                    RECOMENDACIONES DE COLIN BAILEY
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary='Técnica "Talón Abajo" (Heel Down): Comienza con esta técnica para desarrollar control y precisión antes de pasar a talón arriba'
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary='Encuentra el "Punto Dulce" (Sweet Spot): Identifica el punto del pedal donde obtienes la mejor respuesta mecánica y rebote'
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Usa el Rebote: Aprovecha la respuesta natural del pedal y el parche, no fuerces el movimiento"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Metrónomo Obligatorio: Practica siempre con metrónomo para desarrollar precisión rítmica"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Relajación del Pie: No pases al siguiente ejercicio hasta que el pie se sienta totalmente relajado y el golpe suene consistente"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Drumset Control Info - Solo para Drumset Control */}
                          {book.id === 'drumset-control' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.success.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.success.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🥁
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                                    RECOMENDACIONES DE RON SPAGNARDI
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Foco en el Sticking: Toca cada ejercicio exactamente como está escrito (fíjate bien en las R y L)"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Regla de las 10 Repeticiones: Repite cada ejercicio al menos 10 veces antes de pasar al siguiente"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Coordinación Total: Mantén el bombo en negras (1, 2, 3, 4) y el hi-hat en negras o corcheas mientras haces los ejercicios de manos"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Desarrollo del Bombo: Variante avanzada - sustituye todas las notas del redoblante o toms por golpes de bombo, manteniendo la digitación original"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Metrónomo Indispensable: Para medir tu progreso y llegar eventualmente a la velocidad máxima"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Jungle/Drum 'n' Bass Info - Solo para Jungle/Drum 'n' Bass */}
                          {book.id === 'jungle-drum-bass' && (
                            <Paper
                              elevation={3}
                              sx={{
                                p: 3,
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                                border: `3px solid ${theme.palette.secondary.main}`,
                                borderRadius: 2,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.secondary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                  }}
                                >
                                  🎛️
                                </Box>
                                <Box flex={1}>
                                  <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>
                                    RECOMENDACIONES DE JOHNNY RABB
                                  </Typography>
                                  <List dense sx={{ mt: 1 }}>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Afinación No Ortodoxa: Experimenta con afinaciones extremas para simular sonidos electrónicos procesados"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Uso de Fragments: Combina fragmentos de un tiempo de duración libremente para crear tus propios grooves originales"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Practica con Loops: Usa los CDs de audio incluidos con ejemplos de afinación, ejercicios a diferentes tempos y bucles de acompañamiento"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Múltiples Cajas: Usa dos o más cajas con afinaciones diferentes para imitar cambios de sample electrónicos"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Integración Electrónica: Experimenta con samplers de frase y controladores de pads para expandir tus posibilidades sonoras"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                          {/* Book Description */}
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 3,
                              bgcolor: alpha(section.color, 0.08),
                              borderLeft: `4px solid ${section.color}`,
                            }}
                          >
                            <Typography variant="body1" fontWeight="500">
                              {book.description}
                            </Typography>
                          </Paper>

                          {/* Tiers - Para Rudimental Reference */}
                          {book.tiers ? (
                            <Stack spacing={3}>
                              {book.tiers.map((tier: any, tierIdx: number) => (
                                <Card
                                  key={tierIdx}
                                  sx={{
                                    border: `2px solid ${tier.color}`,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      background: `linear-gradient(135deg, ${alpha(tier.color, 0.15)} 0%, ${alpha(tier.color, 0.05)} 100%)`,
                                      p: 2,
                                      borderBottom: `2px solid ${tier.color}`,
                                    }}
                                  >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Chip
                                        label={tier.tier}
                                        sx={{
                                          bgcolor: tier.color,
                                          color: 'white',
                                          fontWeight: 'bold',
                                          fontSize: '0.9rem',
                                        }}
                                      />
                                      <Box>
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: tier.color }}>
                                          {tier.level}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Box>
                                  <Box sx={{ p: 2 }}>
                                    <Grid container spacing={1.5}>
                                      {tier.sections.map((item: any, idx: number) => (
                                        <Grid item xs={12} sm={6} md={4} key={idx}>
                                          <Paper
                                            sx={{
                                              p: 1.5,
                                              bgcolor: alpha(tier.color, 0.05),
                                              border: `1px solid ${alpha(tier.color, 0.2)}`,
                                              transition: 'all 0.2s',
                                              '&:hover': {
                                                bgcolor: alpha(tier.color, 0.1),
                                                transform: 'translateY(-2px)',
                                                boxShadow: 2,
                                              },
                                            }}
                                          >
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                              {item.name}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ color: tier.color, fontWeight: 'bold', mb: 0.5 }}>
                                              {item.pages}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              {item.description}
                                            </Typography>
                                          </Paper>
                                        </Grid>
                                      ))}
                                    </Grid>
                                  </Box>
                                </Card>
                              ))}
                            </Stack>
                          ) : book.levels ? (
                            /* Levels - Para Rudimental Remedies */
                            <Stack spacing={3}>
                              {book.levels.map((level: any, levelIdx: number) => (
                                <Card
                                  key={levelIdx}
                                  sx={{
                                    border: `2px solid ${level.color}`,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      background: `linear-gradient(135deg, ${alpha(level.color, 0.15)} 0%, ${alpha(level.color, 0.05)} 100%)`,
                                      p: 2,
                                      borderBottom: `2px solid ${level.color}`,
                                    }}
                                  >
                                    <Stack spacing={0.5}>
                                      <Typography variant="h6" fontWeight="bold" sx={{ color: level.color }}>
                                        {level.level}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        {level.subtitle}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" mt={1}>
                                        {level.description}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                  <Box sx={{ p: 2 }}>
                                    <Grid container spacing={1.5}>
                                      {level.lessons.map((lesson: any, idx: number) => (
                                        <Grid item xs={12} sm={6} key={idx}>
                                          <Paper
                                            sx={{
                                              p: 1.5,
                                              bgcolor: alpha(level.color, 0.05),
                                              border: `1px solid ${alpha(level.color, 0.2)}`,
                                              transition: 'all 0.2s',
                                              '&:hover': {
                                                bgcolor: alpha(level.color, 0.1),
                                                transform: 'translateY(-2px)',
                                                boxShadow: 2,
                                              },
                                            }}
                                          >
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                              {lesson.name}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ color: level.color, fontWeight: 'bold', mb: 0.5 }}>
                                              {lesson.pages}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              {lesson.description}
                                            </Typography>
                                          </Paper>
                                        </Grid>
                                      ))}
                                    </Grid>
                                  </Box>
                                </Card>
                              ))}
                            </Stack>
                          ) : (
                            /* Exercises - Para Stick Control */
                            <Grid container spacing={2}>
                              {book.exercises?.map((exercise: any, idx: number) => (
                              <Grid item xs={12} md={6} key={idx}>
                                <Card
                                  sx={{
                                    p: 2.5,
                                    height: '100%',
                                    bgcolor: 'white',
                                    border: `1px solid ${alpha(section.color, 0.2)}`,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                      boxShadow: 4,
                                      transform: 'translateY(-4px)',
                                      borderColor: section.color,
                                    },
                                  }}
                                >
                                  <Stack spacing={1.5}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <CheckCircle sx={{ color: section.color, fontSize: 20 }} />
                                      <Typography variant="h6" fontWeight="bold">
                                        {exercise.name}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem',
                                        bgcolor: '#1a1a1a',
                                        color: section.color,
                                        p: 1.5,
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {exercise.pattern}
                                    </Box>

                                    <Box
                                      sx={{
                                        p: 1.5,
                                        bgcolor: alpha(section.color, 0.1),
                                        borderRadius: 1,
                                      }}
                                    >
                                      <Typography variant="caption" fontWeight="bold" color={section.color}>
                                        ENFOQUE:
                                      </Typography>
                                      <Typography variant="body2" fontWeight="500">
                                        {exercise.focus}
                                      </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                      {exercise.description}
                                    </Typography>

                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Speed sx={{ fontSize: 18, color: section.color }} />
                                      <Typography variant="caption" fontWeight="bold">
                                        BPM: {exercise.bpm}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                ) : (
                  /* Exercises - For sections without books */
                  <Grid container spacing={2}>
                    {section.exercises?.map((exercise: any, idx: number) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Card
                          sx={{
                            p: 2.5,
                            height: '100%',
                            bgcolor: 'white',
                            border: `1px solid ${alpha(section.color, 0.2)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: 4,
                              transform: 'translateY(-4px)',
                              borderColor: section.color,
                            },
                          }}
                        >
                          <Stack spacing={1.5}>
                            {/* Exercise name */}
                            <Box display="flex" alignItems="center" gap={1}>
                              <CheckCircle sx={{ color: section.color, fontSize: 20 }} />
                              <Typography variant="h6" fontWeight="bold">
                                {exercise.name}
                              </Typography>
                            </Box>

                            {/* Pattern */}
                            <Box
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '1.1rem',
                                bgcolor: '#1a1a1a',
                                color: section.color,
                                p: 1.5,
                                borderRadius: 1,
                                textAlign: 'center',
                                fontWeight: 'bold',
                              }}
                            >
                              {exercise.pattern}
                            </Box>

                            {/* Focus */}
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: alpha(section.color, 0.1),
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="caption" fontWeight="bold" color={section.color}>
                                ENFOQUE:
                              </Typography>
                              <Typography variant="body2" fontWeight="500">
                                {exercise.focus}
                              </Typography>
                            </Box>

                            {/* Description */}
                            <Typography variant="body2" color="text.secondary">
                              {exercise.description}
                            </Typography>

                            {/* BPM */}
                            <Box display="flex" alignItems="center" gap={1}>
                              <Speed sx={{ fontSize: 18, color: section.color }} />
                              <Typography variant="caption" fontWeight="bold">
                                BPM: {exercise.bpm}
                              </Typography>
                            </Box>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Tips section */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    borderLeft: `4px solid ${theme.palette.info.main}`,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                    💡 Consejos de Práctica
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Usa siempre metrónomo para desarrollar tiempo interno"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Comienza lento y aumenta gradualmente el tempo"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Practica cada ejercicio 10-15 minutos diarios"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Graba tu práctica para identificar áreas de mejora"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      {/* Practice Schedule Suggestion */}
      <Card
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
          border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
          📅 Rutina de Práctica Sugerida (60 minutos)
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {[
            { time: '10 min', activity: 'Calentamiento con Single y Double Strokes', color: 'primary' },
            { time: '15 min', activity: 'Rudimentos (Paradiddles, Flams, Drags)', color: 'secondary' },
            { time: '15 min', activity: 'Independencia y Coordinación', color: 'success' },
            { time: '10 min', activity: 'Control de Pies', color: 'warning' },
            { time: '10 min', activity: 'Groove y Timekeeping con metrónomo', color: 'error' },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette[item.color as keyof typeof theme.palette].main, 0.1),
                  border: `2px solid ${alpha(theme.palette[item.color as keyof typeof theme.palette].main, 0.3)}`,
                }}
              >
                <Chip
                  label={item.time}
                  size="small"
                  sx={{
                    bgcolor: theme.palette[item.color as keyof typeof theme.palette].main,
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                />
                <Typography variant="body2" fontWeight="500">
                  {item.activity}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
};

export default DrumStudyGuide;

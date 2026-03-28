export const ExerciseStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  MASTERED: 'MASTERED',
} as const;

export type ExerciseStatus = typeof ExerciseStatus[keyof typeof ExerciseStatus];

export interface ExerciseProgress {
  id: string;
  userId: string;
  exerciseId: string;
  status: ExerciseStatus;
  currentTempo: number | null;
  totalPracticeTime: number; // en segundos
  masteryTime: number; // en segundos
  lastPracticedAt: string | null;
  masteredAt: string | null;
  createdAt: string;
  updatedAt: string;
  exercise?: {
    id: string;
    name: string;
    targetTempo: number | null;
    minMasteryTime: number;
    book: {
      name: string;
      instrument: string;
    };
  };
}

export interface ExerciseProgressStats {
  total: number;
  notStarted: number;
  inProgress: number;
  mastered: number;
  totalPracticeHours: number;
}

export interface UpdateProgressData {
  tempo: number;
  durationSeconds: number;
}

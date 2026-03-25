export interface Session {
  id: string;
  userId: string;
  date: string;
  durationMinutes: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  exercises: SessionExercise[];
}

export interface SessionExercise {
  id: string;
  sessionId: string;
  exerciseId: string;
  durationMinutes: number;
  exercise?: {
    id: string;
    name: string;
    bookId: string;
    book?: {
      name: string;
      instrument: string;
    };
  };
}

export interface SessionFormData {
  date: string; // ISO string
  durationMinutes: number;
  exercises: {
    exerciseId: string;
    durationMinutes: number;
  }[];
  notes?: string;
}

export interface SessionUpdateData {
  durationMinutes?: number;
  exercises?: {
    exerciseId: string;
    durationMinutes: number;
  }[];
  notes?: string;
}

export interface SessionResponse {
  session: Session;
  levelChanged?: boolean;
  newLevel?: string;
  goalsCompleted?: Array<{
    id: string;
    type: string;
    targetMinutes: number;
    currentMinutes: number;
  }>;
}

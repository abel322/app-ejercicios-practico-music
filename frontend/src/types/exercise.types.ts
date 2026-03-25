export const Difficulty = {
  BASIC: 'BASIC',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export interface Exercise {
  id: string;
  name: string;
  description: string;
  bookId: string;
  pages: string;
  difficulty: Difficulty;
  notes: string;
  createdAt: string;
  updatedAt: string;
  book?: {
    id: string;
    name: string;
    instrument: string;
  };
}

export interface ExerciseFormData {
  name: string;
  description: string;
  bookId: string;
  pages: string;
  difficulty: Difficulty;
  notes: string;
}

export interface ExerciseUpdateData {
  name?: string;
  description?: string;
  pages?: string;
  difficulty?: Difficulty;
  notes?: string;
}

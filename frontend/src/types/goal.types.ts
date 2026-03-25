export type GoalType = 'DAILY' | 'WEEKLY';

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  targetMinutes: number;
  startDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  type: GoalType;
  targetMinutes: number;
  startDate: string;
}

export interface GoalUpdateData {
  targetMinutes?: number;
  active?: boolean;
}

export interface GoalWithProgress extends Goal {
  progress: number; // Porcentaje de completitud (0-100)
  currentMinutes: number; // Minutos practicados en el período actual
}

export interface DashboardStats {
  totalMinutes: number;
  averageDaily: number;
  averageWeekly: number;
  currentStreak: number;
  totalSessions: number;
}

export interface PracticeChartData {
  date: string;
  minutes: number;
}

export interface PracticeChartResponse {
  data: PracticeChartData[];
}

export interface InstrumentDistributionData {
  instrument: string;
  minutes: number;
}

export interface InstrumentDistributionResponse {
  data: InstrumentDistributionData[];
}

export interface TopExercise {
  exerciseId: string;
  exerciseName: string;
  bookName: string;
  totalMinutes: number;
}

export interface TopExercisesResponse {
  exercises: TopExercise[];
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

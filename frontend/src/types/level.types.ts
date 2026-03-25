import { Level } from './auth.types';

export interface LevelProgress {
  totalHours: number;
  consistency: number; // percentage
  exerciseVariety: number;
  nextLevel: Level | null;
  percentageToNext: number;
  missingRequirements: string[];
}

export interface LevelMetrics {
  totalHours: number;
  consistency: number;
  exerciseVariety: number;
}

export interface LevelChange {
  id: string;
  previousLevel: Level;
  newLevel: Level;
  achievedAt: string;
  totalHours: number;
  consistency: number;
  exerciseVariety: number;
}

export interface CurrentLevelResponse {
  level: Level;
  progress: LevelProgress;
}

export interface LevelHistoryResponse {
  history: LevelChange[];
}

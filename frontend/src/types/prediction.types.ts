import { Level } from './auth.types';

export interface PredictionScenario {
  name: string;
  dailyMinutes: number;
  estimatedDays: number;
}

export interface LevelPrediction {
  nextLevel: Level;
  estimatedDate: string;
  scenarios: PredictionScenario[];
}

export interface PredictionResponse {
  prediction: LevelPrediction | null;
  insufficientData: boolean;
}

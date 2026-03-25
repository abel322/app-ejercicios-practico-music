export type RecommendationType = 
  | 'consistency' 
  | 'variety' 
  | 'reminder' 
  | 'duration' 
  | 'exercise_suggestion'
  | 'getting_started';

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface Recommendation {
  type: RecommendationType;
  message: string;
  priority: RecommendationPriority;
}

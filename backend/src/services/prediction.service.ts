import { prisma } from '../lib/prisma';
import { Level } from '@prisma/client';
import { LevelCalculationService } from './level-calculation.service';

interface PredictionScenario {
  name: string;
  dailyMinutes: number;
  estimatedDays: number;
}

interface NextLevelPrediction {
  currentLevel: Level;
  nextLevel: Level | null;
  estimatedDate: string | null;
  scenarios: PredictionScenario[];
  currentMetrics: {
    totalHours: number;
    consistency: number;
    exerciseVariety: number;
  };
  requiredMetrics: {
    totalHours?: number;
    consistency?: number;
    exerciseVariety?: number;
  };
}

export class PredictionService {
  /**
   * Predict when user will reach next level
   */
  static async predictNextLevel(userId: string, instrument?: string): Promise<NextLevelPrediction | null> {
    // Get user's current level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const currentLevel = user.currentLevel;
    const nextLevel = this.getNextLevel(currentLevel);

    // If already at max level, return null
    if (!nextLevel) {
      return null;
    }

    // Get current metrics (filtered by instrument if specified)
    const currentMetrics = await LevelCalculationService.getMetrics(userId, instrument);

    // Check if user has at least 7 days of practice data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Build where clause for sessions
    const sessionWhere: any = {
      userId,
      date: { gte: sevenDaysAgo },
    };
    
    // If instrument is specified, filter by exercises from books of that instrument
    if (instrument) {
      sessionWhere.exercises = {
        some: {
          exercise: {
            book: {
              instrument: instrument
            }
          }
        }
      };
    }

    const sessions = await prisma.session.findMany({
      where: sessionWhere,
      select: {
        date: true,
        durationMinutes: true,
        exercises: {
          select: {
            exercise: {
              select: {
                book: {
                  select: {
                    instrument: true
                  }
                }
              }
            }
          }
        }
      },
    });

    // Filter sessions to only include those with exercises from the specified instrument
    const filteredSessions = instrument 
      ? sessions.filter(session => 
          session.exercises.some(e => e.exercise.book.instrument === instrument)
        )
      : sessions;

    // Count unique days with practice
    const uniqueDays = new Set(
      filteredSessions.map((s) => s.date.toISOString().split('T')[0])
    );

    // If less than 7 days of data, return null
    if (uniqueDays.size < 7) {
      return null;
    }

    // Calculate average daily practice in last 7 days
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const averageDailyMinutes = totalMinutes / 7;

    // Get required metrics for next level
    const requiredMetrics = this.getRequiredMetrics(nextLevel);

    // Calculate scenarios
    const scenarios = this.calculateScenarios(
      currentMetrics,
      requiredMetrics,
      averageDailyMinutes
    );

    // Use conservative scenario for estimated date
    const conservativeScenario = scenarios.find((s) => s.name === 'Conservador');
    const estimatedDate = conservativeScenario
      ? this.calculateEstimatedDate(conservativeScenario.estimatedDays)
      : null;

    return {
      currentLevel,
      nextLevel,
      estimatedDate,
      scenarios,
      currentMetrics,
      requiredMetrics,
    };
  }

  /**
   * Get next level
   */
  private static getNextLevel(currentLevel: Level): Level | null {
    switch (currentLevel) {
      case Level.BASIC:
        return Level.INTERMEDIATE;
      case Level.INTERMEDIATE:
        return Level.ADVANCED;
      case Level.ADVANCED:
        return null;
      default:
        return null;
    }
  }

  /**
   * Get required metrics for a level
   */
  private static getRequiredMetrics(level: Level): {
    totalHours?: number;
    consistency?: number;
    exerciseVariety?: number;
  } {
    switch (level) {
      case Level.INTERMEDIATE:
        return {
          totalHours: 20,
          consistency: 40,
        };
      case Level.ADVANCED:
        return {
          totalHours: 100,
          consistency: 60,
          exerciseVariety: 15,
        };
      default:
        return {};
    }
  }

  /**
   * Calculate prediction scenarios
   */
  private static calculateScenarios(
    currentMetrics: {
      totalHours: number;
      consistency: number;
      exerciseVariety: number;
    },
    requiredMetrics: {
      totalHours?: number;
      consistency?: number;
      exerciseVariety?: number;
    },
    currentDailyMinutes: number
  ): PredictionScenario[] {
    const scenarios: PredictionScenario[] = [];

    // Calculate hours needed
    const hoursNeeded = requiredMetrics.totalHours
      ? Math.max(0, requiredMetrics.totalHours - currentMetrics.totalHours)
      : 0;

    // Conservative: maintain current pace
    if (currentDailyMinutes > 0) {
      const daysNeeded = Math.ceil((hoursNeeded * 60) / currentDailyMinutes);
      scenarios.push({
        name: 'Conservador',
        dailyMinutes: Math.round(currentDailyMinutes),
        estimatedDays: daysNeeded,
      });
    } else {
      // If no current practice, use moderate pace as conservative
      const daysNeeded = Math.ceil((hoursNeeded * 60) / 30);
      scenarios.push({
        name: 'Conservador',
        dailyMinutes: 30,
        estimatedDays: daysNeeded,
      });
    }

    // Moderate: 30 min daily
    const moderateDays = Math.ceil((hoursNeeded * 60) / 30);
    scenarios.push({
      name: 'Moderado',
      dailyMinutes: 30,
      estimatedDays: moderateDays,
    });

    // Ambitious: 60 min daily
    const ambitiousDays = Math.ceil((hoursNeeded * 60) / 60);
    scenarios.push({
      name: 'Ambicioso',
      dailyMinutes: 60,
      estimatedDays: ambitiousDays,
    });

    return scenarios;
  }

  /**
   * Calculate estimated date from days
   */
  private static calculateEstimatedDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}

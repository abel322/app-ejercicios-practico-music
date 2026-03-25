import { prisma } from '../lib/prisma';
import { Level } from '@prisma/client';

interface LevelMetrics {
  totalHours: number;
  consistency: number; // percentage of days with practice in last 30 days
  exerciseVariety: number; // count of unique exercises practiced
}

interface LevelProgress {
  totalHours: number;
  consistency: number;
  exerciseVariety: number;
  nextLevel: Level | null;
  percentageToNext: number;
  missingRequirements: string[];
}

export class LevelCalculationService {
  /**
   * Calculate user level based on metrics
   */
  static async calculateLevel(userId: string, instrument?: string): Promise<Level> {
    const metrics = await this.getMetrics(userId, instrument);

    // BASIC: < 20 hours
    if (metrics.totalHours < 20) {
      return Level.BASIC;
    }

    // INTERMEDIATE: 20-100 hours AND consistency > 40%
    if (
      metrics.totalHours >= 20 &&
      metrics.totalHours < 100 &&
      metrics.consistency > 40
    ) {
      return Level.INTERMEDIATE;
    }

    // ADVANCED: > 100 hours AND consistency > 60% AND variety >= 15
    if (
      metrics.totalHours >= 100 &&
      metrics.consistency > 60 &&
      metrics.exerciseVariety >= 15
    ) {
      return Level.ADVANCED;
    }

    // If requirements not met, return current level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    return user?.currentLevel || Level.BASIC;
  }

  /**
   * Get metrics for level calculation
   */
  static async getMetrics(userId: string, instrument?: string): Promise<LevelMetrics> {
    // Build where clause for sessions
    const sessionWhere: any = { userId };
    
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

    // Get all sessions (filtered by instrument if specified)
    const sessions = await prisma.session.findMany({
      where: sessionWhere,
      select: {
        durationMinutes: true,
        date: true,
        exercises: {
          select: {
            exerciseId: true,
            exercise: {
              select: {
                book: {
                  select: {
                    instrument: true
                  }
                }
              }
            }
          },
        },
      },
    });

    // Filter sessions to only include those with exercises from the specified instrument
    const filteredSessions = instrument 
      ? sessions.filter(session => 
          session.exercises.some(e => e.exercise.book.instrument === instrument)
        )
      : sessions;

    // Calculate total hours
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalHours = totalMinutes / 60;

    // Calculate consistency (% of days with practice in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = filteredSessions.filter((s) => s.date >= thirtyDaysAgo);
    const uniqueDates = new Set(
      recentSessions.map((s) => s.date.toISOString().split('T')[0])
    );
    const consistency = (uniqueDates.size / 30) * 100;

    // Calculate exercise variety (unique exercises practiced for the instrument)
    const uniqueExercises = new Set<string>();
    filteredSessions.forEach((s) => {
      s.exercises.forEach((e) => {
        if (!instrument || e.exercise.book.instrument === instrument) {
          uniqueExercises.add(e.exerciseId);
        }
      });
    });
    const exerciseVariety = uniqueExercises.size;

    return {
      totalHours,
      consistency,
      exerciseVariety,
    };
  }

  /**
   * Get progress to next level
   */
  static async getProgressToNextLevel(userId: string, instrument?: string): Promise<LevelProgress> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const metrics = await this.getMetrics(userId, instrument);
    const currentLevel = user.currentLevel;
    const nextLevel = this.getNextLevel(currentLevel);
    const missingRequirements: string[] = [];
    let percentageToNext = 0;

    if (!nextLevel) {
      // Already at max level
      return {
        ...metrics,
        nextLevel: null,
        percentageToNext: 100,
        missingRequirements: [],
      };
    }

    // Calculate requirements for next level
    if (nextLevel === Level.INTERMEDIATE) {
      // Requirements: 20 hours AND 40% consistency
      const hoursProgress = Math.min((metrics.totalHours / 20) * 100, 100);
      const consistencyProgress = Math.min((metrics.consistency / 40) * 100, 100);
      percentageToNext = Math.min((hoursProgress + consistencyProgress) / 2, 100);

      if (metrics.totalHours < 20) {
        missingRequirements.push(
          `Necesitas ${(20 - metrics.totalHours).toFixed(1)} horas más de práctica`
        );
      }
      if (metrics.consistency < 40) {
        missingRequirements.push(
          `Necesitas ${(40 - metrics.consistency).toFixed(1)}% más de consistencia`
        );
      }
    } else if (nextLevel === Level.ADVANCED) {
      // Requirements: 100 hours AND 60% consistency AND 15 exercises
      const hoursProgress = Math.min((metrics.totalHours / 100) * 100, 100);
      const consistencyProgress = Math.min((metrics.consistency / 60) * 100, 100);
      const varietyProgress = Math.min((metrics.exerciseVariety / 15) * 100, 100);
      percentageToNext = Math.min(
        (hoursProgress + consistencyProgress + varietyProgress) / 3,
        100
      );

      if (metrics.totalHours < 100) {
        missingRequirements.push(
          `Necesitas ${(100 - metrics.totalHours).toFixed(1)} horas más de práctica`
        );
      }
      if (metrics.consistency < 60) {
        missingRequirements.push(
          `Necesitas ${(60 - metrics.consistency).toFixed(1)}% más de consistencia`
        );
      }
      if (metrics.exerciseVariety < 15) {
        missingRequirements.push(
          `Necesitas practicar ${15 - metrics.exerciseVariety} ejercicios diferentes más`
        );
      }
    }

    return {
      ...metrics,
      nextLevel,
      percentageToNext,
      missingRequirements,
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
        return null; // Already at max level
      default:
        return null;
    }
  }

  /**
   * Check and update user level
   * Returns true if level changed
   */
  static async checkAndUpdateLevel(userId: string, instrument?: string): Promise<{
    levelChanged: boolean;
    previousLevel?: Level;
    newLevel?: Level;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const previousLevel = user.currentLevel;
    const newLevel = await this.calculateLevel(userId, instrument);

    if (previousLevel !== newLevel) {
      // Update user level
      await prisma.user.update({
        where: { id: userId },
        data: { currentLevel: newLevel },
      });

      // Create level history record
      const metrics = await this.getMetrics(userId, instrument);
      await prisma.levelHistory.create({
        data: {
          userId,
          previousLevel,
          newLevel,
          totalHours: metrics.totalHours,
          consistency: metrics.consistency,
          exerciseVariety: metrics.exerciseVariety,
        },
      });

      return {
        levelChanged: true,
        previousLevel,
        newLevel,
      };
    }

    return { levelChanged: false };
  }
}
